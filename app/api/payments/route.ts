// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

type Payment = {
  id: string;
  sender_name: string;
  sender: string;
  receiver_name: string;
  receiver: string;
  amount: number;
  time: FirebaseFirestore.Timestamp;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const amount = parseInt(searchParams.get('amount') || '10');
  const pageNumber = parseInt(searchParams.get('page') || '1');
  const startIndex = (pageNumber - 1) * amount;

  const allowedOrigins = ['localhost:3000', 'ihyd.xyz'];
  console.log(req.headers.get('host') || '');

  if (!allowedOrigins.includes(req.headers.get('host') || '')) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 400 });
  }
  

  try {
    const paymentsRef = db.collection('payments').orderBy('time', 'desc');
    let query = paymentsRef.limit(amount);

    if (pageNumber > 1) {
      const previousQuery = paymentsRef.limit(startIndex);
      const previousDocs = await previousQuery.get();
      const lastDoc = previousDocs.docs[previousDocs.docs.length - 1];
      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();
    const payments: Payment[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Payment));

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching payments' }, { status: 500 });
  }
}
