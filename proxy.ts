import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const isLoggedIn = !!request.cookies.get("__session")?.value;
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/stocks") && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const authPages = ["/login", "/register", "/forgot-password"];
    if (authPages.includes(pathname) && isLoggedIn) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/stocks/:path*", "/login", "/register", "/forgot-password"],
};
