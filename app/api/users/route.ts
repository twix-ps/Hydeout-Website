// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

type User = {
  id: string;
  avatar: string;
  level: number;
  won: number;
  lost: number;
  name: string;
  xp: number;
  robux: number;
};

export async function GET(req: NextRequest) {
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
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}
