import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://cdn.sanity.io https://images.unsplash.com https://www.googletagmanager.com https://www.google-analytics.com",
    "font-src 'self' data:",
    "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
    "frame-src 'self' https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
].join('; ');

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    response.headers.set('Content-Security-Policy', CSP);
    return response;
}

export const config = {
    matcher: ['/((?!studio|api|_next/static|_next/image|favicon.ico).*)'],
};
