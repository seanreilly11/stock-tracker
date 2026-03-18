import { adminAuth } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";

const SESSION_DURATION_MS = 60 * 60 * 24 * 14 * 1000; // 14 days

export async function POST(req: NextRequest) {
    try {
        const { idToken } = await req.json();
        if (!idToken) {
            return Response.json({ error: "Missing idToken" }, { status: 400 });
        }

        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn: SESSION_DURATION_MS,
        });

        const response = Response.json({ status: "ok" });
        response.headers.set(
            "Set-Cookie",
            `__session=${sessionCookie}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DURATION_MS / 1000}`,
        );
        return response;
    } catch (error) {
        return Response.json(
            { error: (error as Error).message },
            { status: 401 },
        );
    }
}
