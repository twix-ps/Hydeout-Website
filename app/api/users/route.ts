import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

interface User {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  won: number;
  lost: number;
  level: number;
  xp: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const allowedOrigins = ['localhost:3000', 'ihyd.xyz'];
  console.log(req.headers.get('host') || '');

  if (!allowedOrigins.includes(req.headers.get('host') || '')) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 400 });
  }

  if (searchParams.has('id')) {
    const id = searchParams.get('id');
    if (id) {
      try {
        const userDoc = await db.collection('users').doc(id).get();
        if (!userDoc.exists) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const user = { id: userDoc.id, ...userDoc.data() } as User;
        return NextResponse.json(user);
      } catch (error) {
        console.error('Error fetching user by ID:', error);
        return NextResponse.json({ error: 'Error fetching user by ID' }, { status: 500 });
      }
    }
  }

  try {
    const usersCollection = db.collection('users');
    const query = usersCollection.orderBy('xp', 'desc');
    const snapshot = await query.get();

    const users: User[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as User));

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}
