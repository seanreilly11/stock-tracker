import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

export async function getUidFromSession(): Promise<string | null> {
    const session = (await cookies()).get("__session")?.value;
    if (!session) return null;
    try {
        const decoded = await adminAuth.verifySessionCookie(session, true);
        return decoded.uid;
    } catch {
        return null;
    }
}
