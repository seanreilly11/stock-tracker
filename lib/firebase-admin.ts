import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined;

const app = getApps().length
    ? getApps()[0]
    : initializeApp(
          serviceAccount ? { credential: cert(serviceAccount) } : undefined,
      );

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
