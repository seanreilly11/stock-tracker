import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const app = getApps().length
    ? getApps()[0]
    : initializeApp({
          credential: cert(
              JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!),
          ),
      });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
