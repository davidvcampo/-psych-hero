import { createHash } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const FIREBASE_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Works out who is asking from their Firebase login token, then checks that
// their users/{uid} record says "moderator". No admin credentials needed:
// the users collection is publicly readable under our Firestore rules.
async function isModerator(idToken) {
  const lookup = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!lookup.ok) return false;
  const uid = (await lookup.json())?.users?.[0]?.localId;
  if (!uid) return false;

  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}`
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data?.fields?.role?.stringValue === "moderator";
}

async function destroyAsset({ publicId, resourceType }) {
  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
  const signature = createHash("sha1").update(toSign).digest("hex");

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    invalidate: "true",
    api_key: API_KEY,
    signature,
  });

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/destroy`, {
    method: "POST",
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || "Cloudinary refused the delete.");
  // "not found" means it's already gone, which is fine.
  return data.result;
}

export async function POST(request) {
  if (!API_KEY || !API_SECRET || !CLOUD_NAME || !FIREBASE_KEY || !PROJECT_ID) {
    return NextResponse.json(
      { error: "Deleting from Cloudinary isn't set up yet. Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in Vercel, then redeploy." },
      { status: 500 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const { idToken, assets } = payload || {};
  if (!idToken || !Array.isArray(assets) || assets.length === 0 || assets.length > 30) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  let allowed = false;
  try {
    allowed = await isModerator(idToken);
  } catch {
    return NextResponse.json({ error: "Couldn't verify your login. Try again." }, { status: 502 });
  }
  if (!allowed) {
    return NextResponse.json({ error: "Moderators only." }, { status: 403 });
  }

  const allowedTypes = ["image", "raw", "video"];
  try {
    for (const a of assets) {
      if (!a?.publicId || !allowedTypes.includes(a.resourceType)) {
        return NextResponse.json({ error: "Bad asset." }, { status: 400 });
      }
      await destroyAsset(a);
    }
  } catch (err) {
    return NextResponse.json({ error: err.message || "Delete failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
