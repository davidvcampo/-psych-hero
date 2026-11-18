"use client";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { uploadToCloudinary } from "./cloudinary";
import { normalizeResource } from "./constants";

// Subject/type/year-level lists live in ./constants.js (no "use client",
// so Server Components — like the landing page — can import them directly).

// ---------- Users ----------
export async function ensureUserProfile(user) {
  if (!user) return null;
  const ref_ = doc(db, "users", user.uid);
  const snap = await getDoc(ref_);
  if (!snap.exists()) {
    const profile = {
      uid: user.uid,
      name: user.displayName || user.email.split("@")[0],
      email: user.email,
      role: "student",
      approvedUploads: 0,
      createdAt: serverTimestamp(),
    };
    await setDoc(ref_, profile);
    return profile;
  }
  return snap.data();
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

// ---------- Resources ----------
export async function submitResource({ file, title, subjectCode, subjectName, yearLevel, resourceType, notes, user }) {
  if (!file || !title || !subjectCode || !user) {
    throw new Error("Missing required fields for a resource submission.");
  }

  const { url: fileUrl, publicId } = await uploadToCloudinary(file);

  const docRef = await addDoc(collection(db, "resources"), {
    title,
    subjectCode,
    subjectName,
    yearLevel,
    resourceType,
    notes: notes || "",
    fileUrl,
    fileName: file.name,
    cloudinaryPublicId: publicId,
    uploaderUid: user.uid,
    uploaderName: user.displayName || user.email.split("@")[0],
    status: "pending",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// Live-subscribe to approved resources, optionally filtered client-side by the caller.
export function subscribeApprovedResources(callback) {
  const q = query(
    collection(db, "resources"),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => normalizeResource({ id: d.id, ...d.data() })));
  });
}

export function subscribePendingResources(callback) {
  const q = query(
    collection(db, "resources"),
    where("status", "==", "pending"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => normalizeResource({ id: d.id, ...d.data() })));
  });
}

export async function approveResource(resourceId, uploaderUid) {
  await updateDoc(doc(db, "resources", resourceId), { status: "approved" });
  if (uploaderUid) {
    await updateDoc(doc(db, "users", uploaderUid), {
      approvedUploads: increment(1),
    });
  }
}

export async function rejectResource(resourceId, reason) {
  await updateDoc(doc(db, "resources", resourceId), {
    status: "rejected",
    rejectionReason: reason || "Did not meet submission guidelines.",
  });
}

// ---------- Contributor Spotlight ----------
export function subscribeTopContributors(callback, take = 10) {
  const q = query(
    collection(db, "users"),
    orderBy("approvedUploads", "desc"),
    limit(take)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((u) => u.approvedUploads > 0));
  });
}