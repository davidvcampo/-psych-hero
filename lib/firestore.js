"use client";

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
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
import { db, auth } from "./firebase";
import { uploadToCloudinary } from "./cloudinary";
import { normalizeResource, getCloudinaryAssets } from "./constants";

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
export async function submitResource({ files = [], links = [], title, subjectCode, subjectName, yearLevel, resourceType, notes, user, onProgress }) {
  if (files.length + links.length === 0 || !title || !subjectCode || !user) {
    throw new Error("Missing required fields for a resource submission.");
  }

  // Upload one at a time, in order, so the lesson keeps the order the student chose.
  const uploaded = [];
  for (let i = 0; i < files.length; i++) {
    if (onProgress) onProgress(i + 1, files.length);
    const f = files[i];
    const { url, publicId } = await uploadToCloudinary(f);
    uploaded.push({ url, name: f.name, type: f.type || "", publicId });
  }

  // Google Drive links ride along in the same list, after any uploaded files.
  links.forEach((url, i) => {
    uploaded.push({ url, name: `Google Drive link ${i + 1}`, type: "link", publicId: "" });
  });

  const docRef = await addDoc(collection(db, "resources"), {
    title,
    subjectCode,
    subjectName,
    yearLevel,
    resourceType,
    notes: notes || "",
    files: uploaded,
    // First file is also stored the old way, so nothing that reads fileUrl breaks.
    fileUrl: uploaded[0].url,
    fileName: uploaded[0].name,
    cloudinaryPublicId: uploaded[0].publicId,
    uploaderUid: user.uid,
    uploaderName: user.displayName || user.email.split("@")[0],
    status: "pending",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// One resource by id. Returns null if it doesn't exist or you aren't allowed to see it
// (pending items are visible to moderators only).
export async function getResource(id) {
  try {
    const snap = await getDoc(doc(db, "resources", id));
    return snap.exists() ? normalizeResource({ id: snap.id, ...snap.data() }) : null;
  } catch (err) {
    return null;
  }
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

// Takes a published resource off the site. The record is kept (status "removed")
// so it can be restored from the Firebase console, but it disappears from the catalog.
export async function removeResource(resourceId, uploaderUid) {
  await updateDoc(doc(db, "resources", resourceId), { status: "removed" });
  if (uploaderUid) {
    await updateDoc(doc(db, "users", uploaderUid), {
      approvedUploads: increment(-1),
    });
  }
}

// Removed (hidden) resources, newest first. Sorted here instead of in the query
// so it doesn't need an extra Firestore index.
export function subscribeRemovedResources(callback) {
  const q = query(collection(db, "resources"), where("status", "==", "removed"));
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => normalizeResource({ id: d.id, ...d.data() }));
    rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    callback(rows);
  });
}

export async function restoreResource(resourceId, uploaderUid) {
  await updateDoc(doc(db, "resources", resourceId), { status: "approved" });
  if (uploaderUid) {
    await updateDoc(doc(db, "users", uploaderUid), {
      approvedUploads: increment(1),
    });
  }
}

// Permanently deletes a resource: the files in Cloudinary first (through our server
// route, which holds the secret key), then the record. wasPublished = it was still live,
// so the uploader's approved count goes down by one.
export async function deleteResourceForever(resource, wasPublished) {
  const assets = getCloudinaryAssets(resource);
  if (assets.length > 0) {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch("/api/delete-files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, assets }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Couldn't delete the files from Cloudinary.");
  }

  await deleteDoc(doc(db, "resources", resource.id));

  if (wasPublished && resource.uploaderUid) {
    await updateDoc(doc(db, "users", resource.uploaderUid), {
      approvedUploads: increment(-1),
    });
  }
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