# Liam's Reward Tracker

A mobile-first web app for tracking Liam's weekly points, earning rewards, and busting boredom. Built with Next.js 14, Supabase, and Tailwind CSS.

---

## What the app does

- **Rules tab** — displays all the house rules: what earns points, what costs points, daily caps, and non-negotiables.
- **Tracker tab** — the main hub. Shows total points balance, a 7-day grid, progress to the next milestone, a streak counter, quick-add earn/spend buttons, custom entry form, recent activity log, and a weekly reset button.
- **Rewards tab** — shows all available rewards with their point costs. Unlocked rewards can be redeemed directly, deducting points from the balance.
- **Boredom Buster tab** — shuffleable grid of 17 activities across four categories. Point-bearing activities add to the Supabase balance; others show fun encouragement.

---

## Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Supabase account** — free tier at [supabase.com](https://supabase.com)
- **Vercel account** — free tier at [vercel.com](https://vercel.com) (for deployment)
- **Git** — for version control and Vercel integration

---

## 1. Supabase setup

### Create a project

1. Go to [app.supabase.com](https://app.supabase.com) and sign in.
2. Click **New project**.
3. Fill in the project name (e.g. `liam-tracker`), set a strong database password, and choose a region close to you.
4. Click **Create new project** and wait ~2 minutes for it to spin up.

### Run the database setup script

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Copy the entire contents of `supabase-setup.sql` from this project and paste it into the editor.
4. Click **Run** (or press Ctrl/Cmd+Enter).
5. You should see "Success. No rows returned" for each statement.

### Get your API credentials

1. In the Supabase dashboard, go to **Project Settings** → **API**.
2. Copy the **Project URL** — this is your `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy the **anon public** key under "Project API keys" — this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 2. Local development setup

```bash
# Clone the repo (or just use the project directory)
git clone <your-repo-url>
cd liam

# Install dependencies
npm install

# Create your environment file
cp .env.local.example .env.local
```

Open `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app should load with the Tracker tab active.

---

## 3. Deploy to Vercel

### Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/liam-tracker.git
git push -u origin main
```

### Import in Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in.
2. Click **Import** next to your GitHub repository.
3. Vercel will auto-detect Next.js — no build settings need changing.

### Add environment variables

Before clicking Deploy, expand **Environment Variables** and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |

4. Click **Deploy**.
5. Vercel will build and deploy the app. You'll get a URL like `liam-tracker.vercel.app`.

Future pushes to `main` will automatically redeploy.

---

## 4. Day-to-day usage

**Adding points (earn)**
- Go to the **Tracker** tab.
- Tap any of the green quick-earn buttons (Homework, Reading, etc.) to instantly log points.
- Use the **Custom entry** form for anything not covered by the quick buttons — positive numbers earn, negative numbers spend.

**Spending points**
- Tap the coral **PS5 1hr** or **Phone 30min** buttons in the Tracker tab.
- Or go to the **Rewards** tab to redeem milestone rewards.

**Checking the week**
- The 7-day grid in Tracker shows net points per day for the current week.
- The progress bar shows how close Liam is to the next 20-point milestone.
- The streak counter shows consecutive days where he earned points.

**Resetting the week**
- At the bottom of the Tracker tab, tap **Reset weekly view**.
- Confirm in the dialog. This inserts a reset marker so the weekly grid starts fresh.
- The total balance is NOT affected — only the weekly display resets.

**Redeeming rewards**
- Go to the **Rewards** tab.
- Rewards with a green "Unlocked" badge can be redeemed by tapping the **Redeem** button.
- Confirm in the dialog. The cost is deducted from the balance immediately.

**Boredom Buster**
- Go to the **Buster** tab when Liam needs something to do.
- Tap **Shuffle** to get a fresh set of 8 random activities.
- Tap an activity card — those with green "+N pts" badges will add points to the balance after confirmation.

---

## Project structure

```
liam/
├── app/
│   ├── globals.css        # Tailwind directives + custom component classes
│   ├── layout.tsx         # Root layout with Geist font + metadata
│   └── page.tsx           # Tab shell (client component)
├── components/
│   └── tabs/
│       ├── RulesTab.tsx          # Static rules display
│       ├── PointsTab.tsx         # Main tracker with Supabase
│       ├── RewardsTab.tsx        # Rewards with redemption
│       └── BoredomBusterTab.tsx  # Activity cards with shuffle
├── lib/
│   └── supabase.ts        # Supabase client + TypeScript types
├── supabase-setup.sql     # Run this in Supabase SQL Editor
├── .env.local.example     # Copy to .env.local and fill in
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```
