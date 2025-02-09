import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken'  // You can use the 'jsonwebtoken' library

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const jwtToken = req.cookies.get('token')?.value;  // Get JWT token from cookies

    if (!jwtToken) {
        // Redirect to login if no token is found
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    try {
        // Decode the JWT token to extract user role (assuming the secret is known)
        const payload: any = jwt.decode(jwtToken);

        if (!payload) {
            // If decoding fails or payload is missing, redirect to login
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }

        const userRole = payload.role;

        // Check the pathname for role-based access
        if (pathname.startsWith('/admin') && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/auth/unauthorized', req.url));
        }
        if (pathname.startsWith('/judge') && userRole !== 'judge') {
            return NextResponse.redirect(new URL('/auth/unauthorized', req.url));
        }
        if (pathname.startsWith('/entrepreneur') && userRole !== 'entrepreneur') {
            return NextResponse.redirect(new URL('/auth/unauthorized', req.url));
        }
        if (pathname.startsWith('/event-coordinator') && userRole !== 'event-coordinator') {
            return NextResponse.redirect(new URL('/auth/unauthorized', req.url));
        }
    } catch (error) {
        // In case of an error while decoding the JWT, redirect to login
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();  // Allow the request to proceed if everything checks out
}

export const config = {
    matcher: ['/admin/:path*', '/judge/:path*', '/entrepreneur/:path*', '/event-coordinator/:path*'],
};
