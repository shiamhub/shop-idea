import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server'

export const middleware = async (request) => {
    const { pathname } = request.nextUrl;
    const isPath = (path) => pathname.startsWith(path)
    try {
        let cookie = request.cookies.get('jwt-token')?.value;
        if (!cookie || !cookie.startsWith("bearer")) {
            throw new Error("Not authenticated");
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(cookie.split("bearer ")[1], secret);
        if(isPath("/login") || isPath("/signup")) {
            return NextResponse.redirect(new URL("/", request.url))
        } 
        return NextResponse.next();

    } catch (error) {
        if(isPath("/login") || isPath("/signup")) {
            return NextResponse.next();
        } 
        return NextResponse.redirect(new URL(`/login?redirectUrl=${pathname}`, request.url))
    }
}

export const config = {
    matcher: ["/profile/:path*", "/dashboard/:path*", "/login/:path*", "/signup/:path*"],
}