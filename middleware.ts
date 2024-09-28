import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server"

// export { default } from "next-auth/middleware"

const apiPaths = ['/api/users', '/api/payments']
let rateLimit: { [key: string]: { count: number, lastRequest: number } } = {};

export default async function middleware(req: NextRequest) {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    if (!rateLimit[ip]) {
        rateLimit[ip] = { count: 1, lastRequest: now };
    } else {
        const elapsed = now - rateLimit[ip].lastRequest;
        rateLimit[ip].lastRequest = now;

      if (elapsed < 60000) { // If within 1 minute
        rateLimit[ip].count++;
        if (rateLimit[ip].count > 100) {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
            }
        } else {
        // Reset count if more than 1 minute has passed
        rateLimit[ip].count = 1;
        }
    }

    // Optional: Clean up stale entries to prevent memory bloat
    Object.keys(rateLimit).forEach((ip) => {
      if (now - rateLimit[ip].lastRequest > 60000) { // Clean up after 1 minute
        delete rateLimit[ip];
        }
    });    
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