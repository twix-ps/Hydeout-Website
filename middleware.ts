import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server"

// export { default } from "next-auth/middleware"

const apiPaths = ['/api/users', '/api/payments']

export default async function middleware(req: NextRequest) {
    
    if (apiPaths.includes(req.nextUrl.pathname)) {
        const csrfToken = req.cookies.get('next-auth.csrf-token');
        if (!csrfToken && req.nextUrl.pathname.startsWith('/api')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
      
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const response = NextResponse.next();
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        return response;

    }

    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    return response;
}