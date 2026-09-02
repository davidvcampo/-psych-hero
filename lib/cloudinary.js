// Uploads a file straight from the browser to Cloudinary using an
// "unsigned" upload preset — no server code, no API secret exposed.
// Cloudinary's free plan needs no credit card and no billing account,
// which is why this replaced Firebase Storage in this project.
//
// Setup: create a free account at cloudinary.com, then create an
// unsigned upload preset (Settings -> Upload -> Upload presets -> Add
// upload preset -> Signing Mode: Unsigned). Put your cloud name and the
// preset name in .env.local as NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
// NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.

export const CLOUDINARY_MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB — the free-plan cap for raw/image uploads

export async function uploadToCloudinary(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary isn't configured yet — check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  // "auto" lets Cloudinary route images vs. PDFs/DOCX ("raw") correctly.
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Upload to Cloudinary failed.");
  }

  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}
