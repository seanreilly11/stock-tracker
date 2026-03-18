import {
    UserCredential,
    createUserWithEmailAndPassword,
    getAdditionalUserInfo,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserOnSignUp, updateUserLoginDate } from "./db";
import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export async function signUp(
    email: string,
    password: string,
    name: string,
): Promise<UserCredential | FirebaseError | { error: string }> {
    try {
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );
        if (result) {
            await createUserOnSignUp(
                result.user.uid,
                email,
                name,
                result.user.providerData[0].providerId,
            );
            if (auth.currentUser) {
                updateProfile(auth.currentUser, { displayName: name });
            }
            await exchangeIdToken(result.user);
            return result as UserCredential;
        }
        return { error: "Server error. Please try again." };
    } catch (e: unknown) {
        if (e instanceof FirebaseError) return e;
        throw e;
    }
}

async function exchangeIdToken(user: { getIdToken: () => Promise<string> }) {
    const idToken = await user.getIdToken();
    await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
    });
}

export async function signIn(
    email: string,
    password: string,
): Promise<UserCredential | unknown> {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result) {
            updateUserLoginDate(result.user.uid);
            await exchangeIdToken(result.user);
        }
        return result;
    } catch (e) {
        return e;
    }
}

export function signInWithGoogle(): Promise<UserCredential | void> {
    return signInWithPopup(auth, googleProvider)
        .then(async (result) => {
            const additional = getAdditionalUserInfo(result);
            if (additional?.isNewUser) {
                const { uid, displayName: name, email, providerData } =
                    result.user;
                await createUserOnSignUp(
                    uid,
                    email || "",
                    name || "",
                    providerData[0].providerId,
                );
            }
            updateUserLoginDate(result.user.uid);
            await exchangeIdToken(result.user);
            return result as UserCredential;
        })
        .catch((error: FirebaseError) => {
            console.error("Google sign-in error:", error.code, error.message);
        });
}

export async function signOutUser(): Promise<void | unknown> {
    try {
        await signOut(auth);
        await fetch("/api/auth/logout", { method: "POST" });
        if (typeof window !== "undefined") {
            if (window.location.pathname !== "/") window.location.assign("/");
        }
    } catch (e) {
        return e;
    }
}

export async function resetPassword(
    email: string,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error: unknown) {
        const message =
            error instanceof FirebaseError ? error.message : "Unknown error";
        return { success: false, error: message };
    }
}
