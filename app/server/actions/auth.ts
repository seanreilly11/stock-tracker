// import {
//     getRedirectResult,
//     sendSignInLinkToEmail,
//     signInWithRedirect,
// } from "firebase/auth";
// // import { auth } from "../firebase";

// const actionCodeSettings = {
//     // URL you want to redirect back to. The domain (www.example.com) for this
//     // URL must be in the authorized domains list in the Firebase Console.
//     url: "http://localhost:3000/",
//     // This must be true.
//     handleCodeInApp: true,
//     iOS: {
//         bundleId: "com.example.ios",
//     },
//     android: {
//         packageName: "com.example.android",
//         installApp: true,
//         minimumVersion: "12",
//     },
//     dynamicLinkDomain: "example.page.link",
// };

// export const signIn = (email: string) => {
//     sendSignInLinkToEmail(auth, email, actionCodeSettings)
//         .then(() => {
//             // The link was successfully sent. Inform the user.
//             // Save the email locally so you don't need to ask the user for it again
//             // if they open the link on the same device.
//             localStorage.setItem("emailForSignIn", email);
//             // ...
//         })
//         .catch((error) => {
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             // ...
//         });
// };

// import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
// const provider = new GithubAuthProvider();

// export const githubSignIn = () => {
//     console.log("Github time");
//     signInWithRedirect(auth, provider);
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

// export const getSignInResult = () => {
//     console.log("get result");
//     getRedirectResult(auth)
//         .then((result) => {
//             // const credential = GithubAuthProvider.credentialFromResult(result);
//             // if (credential) {
//             //     // This gives you a GitHub Access Token. You can use it to access the GitHub API.
//             //     const token = credential.accessToken;
//             //     // ...
//             // }

//             // The signed-in user info.
//             const user = result?.user;
//             console.log(user);
//             // IdP data available using getAdditionalUserInfo(result)
//             // ...
//         })
//         .catch((error) => {
//             // Handle Errors here.
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             // The email of the user's account used.
//             // const email = error.customData.email;
//             // The AuthCredential type that was used.
//             const credential = GithubAuthProvider.credentialFromError(error);
//             console.log(errorMessage);
//         });
// };
