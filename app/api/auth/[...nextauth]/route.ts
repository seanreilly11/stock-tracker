import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { cert } from "firebase-admin/app";
import { getUserByEmail } from "@/app/server/actions/db";

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
    ],
    // adapter: FirestoreAdapter({
    //     credential: cert({
    //         projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
    //         clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL,
    //         privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY,
    //     }),
    // }),
    session: {
        strategy: "jwt",
    },
    callbacks: {
        // session: async ({ session, token }) => {
        //     console.log("Token", token);
        //     if (session?.user) {
        //         session.user.id = token.sub;
        //     }
        //     console.log("Session", session);

        //     return session;
        // },
        // jwt: async ({ user, token }) => {
        //     console.log("User", user);
        //     if (user) {
        //         token.uid = user.id;
        //     }
        //     console.log("Token", token);

        //     return token;
        // },
        // jwt({ token, account, user }) {
        //     console.log("Token", token);
        //     console.log("Account", account);
        //     console.log("User", user);
        //     if (account) {
        //         token.accessToken = account.access_token;
        //         token.id = user?.id;
        //     }
        //     return token;
        // },
        // session({ session, token }) {
        //     // I skipped the line below coz it gave me a TypeError
        //     // session.accessToken = token.accessToken;
        //     session.user.id = token.id;

        //     return session;
        // },
        async jwt({ user, token }) {
            if (user) {
                const userId = await getUserByEmail(user);
                token.uid = userId;
                return token;
            }

            return token;
        },
        async session({ session, token }) {
            session.user.uid = token.uid;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
