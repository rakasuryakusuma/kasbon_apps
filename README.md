# Kasbon — Supabase + Vercel Edition
### 100% Free, No Credit Card Needed

---

## What You Need (all free, no card)
- GitHub account → https://github.com
- Supabase account → https://supabase.com (sign in with GitHub)
- Vercel account → https://vercel.com (sign in with GitHub)

---

## Step 1 — Set Up Supabase

1. Go to https://supabase.com → **New Project**
2. Give it a name: `kasbon`
3. Set a **database password** (save it somewhere safe)
4. Choose region: **Southeast Asia (Singapore)** ← closest to Indonesia!
5. Click **Create new project** — wait ~2 minutes

### Run the database schema:
6. In Supabase dashboard, click **SQL Editor** (left sidebar)
7. Click **New query**
8. Open the `schema.sql` file from this folder, copy ALL the contents
9. Paste into the SQL editor → click **Run** ✅

### Get your API keys:
10. Go to **Project Settings → API**
11. Copy these two values (you'll need them in Step 3):
    - **Project URL** (looks like `https://xxxx.supabase.co`)
    - **service_role** key (under "Project API keys" — use the `service_role` one, NOT `anon`)

---

## Step 2 — Upload to GitHub

1. Go to https://github.com/new
2. Create a **private** repo named `kasbon`
3. Upload ALL files from this folder (keep folder structure!)
4. Commit changes

---

## Step 3 — Deploy on Vercel

1. Go to https://vercel.com → **Add New Project**
2. Import your `kasbon` GitHub repo
3. Click **Environment Variables** and add these:

| Name | Value |
|---|---|
| `SUPABASE_URL` | Your Project URL from Step 1 |
| `SUPABASE_SERVICE_KEY` | Your service_role key from Step 1 |

4. Click **Deploy** ✅

---

## Step 4 — Open Your App

1. Vercel gives you a URL like `kasbon.vercel.app`
2. Open it — you'll see the **First-time setup** screen
3. Create your admin account
4. Use **👥 Users** in the header to add family & friends!

---

## Free Tier Limits
| Service | Limit |
|---|---|
| Supabase DB | 500MB storage (holds ~millions of transactions) |
| Supabase bandwidth | 5GB/month |
| Vercel functions | 1 million calls/month |
| Vercel bandwidth | 100GB/month |

Way more than enough for a family budget tracker!

---

## Important Notes
- Supabase free projects **pause after 1 week of inactivity**
  → Just open the app once a week and it stays active
  → Or upgrade to Supabase Pro ($25/mo) to disable pausing
- Vercel Hobby is for **personal/non-commercial** use only ✅
