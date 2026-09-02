# Psych Hero

A subject-catalogued digital library for PSYMS (Psychology Majors' Society,
MSU-GSC) — students file notes, reviewers, and modules; the Committee on
Academic Matters reviews them; approved resources become searchable by
subject, year level, and type.

Built with **Next.js (App Router) + Tailwind CSS** on the frontend and
**Firebase (Auth, Firestore, Storage)** as the backend. Deploys to **Vercel**.

## 1. Set up Firebase (one-time)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project (e.g. "psych-hero").
2. **Add a Web App**: Project settings → General → "Your apps" → Web (`</>`). Copy the config values — you'll need them in step 3.
3. **Enable Authentication**: Build → Authentication → Sign-in method → enable **Email/Password**.
4. **Create Firestore**: Build → Firestore Database → Create database → start in production mode → pick a region close to the Philippines (e.g. `asia-southeast1`).
5. **Enable Storage**: Build → Storage → Get started (same region as Firestore).
6. **Deploy the security rules** in this repo:
   - In Firestore Database → Rules, paste the contents of `firestore.rules` and Publish.
   - In Storage → Rules, paste the contents of `storage.rules` and Publish.
   - (Or install the [Firebase CLI](https://firebase.google.com/docs/cli) and run `firebase deploy --only firestore:rules,storage:rules`.)

## 2. Run it locally in VS Code

```bash
# inside the psych-hero folder
npm install
cp .env.local.example .env.local
```

Open `.env.local` and paste in the config values from step 1.2 (they all start with `NEXT_PUBLIC_`).

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 3. Make yourself a moderator

Sign up for an account in the app first (so your user document exists), then
in the Firebase console go to **Firestore Database → users → (your uid)**
and change the `role` field from `student` to `moderator`. You'll then see a
**Moderation** link in the nav and can approve/reject submissions at `/admin`.

## 4. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — no build settings to change.
4. Under **Environment Variables**, add the same six `NEXT_PUBLIC_FIREBASE_*` keys from your `.env.local`.
5. Deploy. Vercel gives you a `.vercel.app` URL immediately; you can attach a custom domain later under Project → Domains.

Every push to your main branch redeploys automatically.

## Project structure

```
app/            pages (App Router): landing, login, signup, browse, upload, admin, spotlight
components/     Navbar, Footer, ResourceCard, AuthProvider
lib/            firebase.js (SDK init), firestore.js (data access + subject catalog)
firestore.rules, storage.rules   security rules to paste into Firebase console
```

## Editing the subject list

The list of subjects (PSYC courses + GE courses) lives in `lib/firestore.js`
as the `SUBJECTS` array. Add, remove, or rename entries there — the browse
filters and upload form both read from it automatically.

## Notes

- File size limit for uploads is 25MB (enforced in both the upload form and the Storage rules).
- The "psyCOOLogy: EngAGE Spotlight" page ranks members by approved-upload count, tracked automatically when a moderator approves a submission.
- No payment or paid Firebase tier is required at this scale — Firebase's free Spark plan covers Auth, Firestore, and Storage for typical PSYMS usage.
