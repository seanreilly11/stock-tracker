import { adminAuth } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = req.cookies.get("__session")?.value;
        if (session) {
            const decoded = await adminAuth.verifySessionCookie(session);
            await adminAuth.revokeRefreshTokens(decoded.uid);
        }
    } catch {
        // If the cookie is invalid, we still clear it
    }

    const response = Response.json({ status: "ok" });
    response.headers.set(
        "Set-Cookie",
        "__session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
    );
    return response;
}
