"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Note: no Firebase Storage here on purpose. Since Feb 2026, Cloud Storage
// for Firebase requires a linked billing account (Blaze plan) even for
// free-tier usage. Files are uploaded to Cloudinary instead (free, no card
// needed) — see lib/cloudinary.js. Firestore and Auth stay fully free on
// the Spark plan.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This app is client-only (every page that touches Firebase is "use client").
// Guard initialization to the browser so Next.js's server-side prerender
// pass never tries to boot the Firebase SDK with no real config.
function getFirebaseApp() {
  if (typeof window === "undefined") return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

const app = getFirebaseApp();

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export default app;