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
import { auth } from "../firebase";
import { createUserOnSignUp, updateUserLoginDate } from "./db";
import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { redirect } from "next/navigation";

const googleProvider = new GoogleAuthProvider();

export async function signUp(email: string, password: string, name: string) {
    try {
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        // const additional = getAdditionalUserInfo(result);

        result &&
            (await createUserOnSignUp(
                result.user.uid,
                email,
                name,
                result?.user.providerData[0].providerId
            ));
        auth.currentUser &&
            updateProfile(auth.currentUser, {
                displayName: name,
            });
        return result as UserCredential;
    } catch (e: unknown) {
        if (e instanceof FirebaseError) {
            console.log(e);
            return e as FirebaseError;
        }
        throw e;
    }
}

export async function signIn(email: string, password: string) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result) updateUserLoginDate(result.user.uid);
        return result;
    } catch (e) {
        return e;
    }
}

export function signInWithGoogle() {
    signInWithPopup(auth, googleProvider)
        .then(async (result) => {
            const additional = getAdditionalUserInfo(result);
            // console.log(result);
            if (additional?.isNewUser) {
                const {
                    uid,
                    displayName: name,
                    email,
                    providerData,
                } = result.user;
                await createUserOnSignUp(
                    uid,
                    email || "",
                    name || "",
                    providerData[0].providerId
                );
            }
            updateUserLoginDate(result.user.uid);
            return result as UserCredential;
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            // const credential = GoogleAuthProvider.credentialFromError(error);
        });
}

export async function signOutUser() {
    try {
        await signOut(auth);
        location.assign("/");
        return;
    } catch (e) {
        return e;
    }
}

export async function resetPassword(email: string) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
            return email;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error);
        });
}

// import { GithubAuthProvider } from "firebase/auth";
// const provider = new GithubAuthProvider();

// export const githubSignIn = () => {
//     console.log("Github time");
//     // signInWithPopup(auth, provider)
//     //     .then((result) => {
//     //         // This gives you a GitHub Access Token. You can use it to access the GitHub API.
//     //         const credential = GithubAuthProvider.credentialFromResult(result);
//     //         const token = credential?.accessToken;

//     //         // The signed-in user info.
//     //         const user = result.user;
//     //         // IdP data available using getAdditionalUserInfo(result)
//     //         // ...
//     //         console.log(user);
//     //     })
//     //     .catch((error) => {
//     //         // Handle Errors here.
//     //         const errorCode = error.code;
//     //         const errorMessage = error.message;
//     //         // The email of the user's account used.
//     //         const email = error.customData.email;
//     //         // The AuthCredential type that was used.
//     //         const credential = GithubAuthProvider.credentialFromError(error);
//     //         // ...
//     //     });
// };
