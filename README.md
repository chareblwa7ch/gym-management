# ElAmidy Sports Fitness

Simple internal membership management for ElAmidy Sports Fitness. The app is built for the owner or staff to register members, record monthly payments, track expiry dates, and renew memberships quickly on phone, tablet, or desktop.

## What It Does

- Staff-only login with Supabase Auth
- Add members with name, phone, notes, and first payment
- Save every renewal as a separate subscription row
- Track active, expiring soon, and expired memberships
- Search members quickly by name or phone
- Open WhatsApp reminders from member screens
- Install the dashboard as a PWA on phone or desktop

## Tech Stack

- Next.js 16 App Router
- Tailwind CSS v4
- shadcn-style UI components
- Lucide icons
- Supabase Auth + Postgres
- Vercel deployment
- Progressive Web App manifest + offline fallback

## Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can copy [`.env.example`](./.env.example) as a starting point.

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create a Supabase project.
3. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql).
4. In `Authentication > Users`, create at least one email/password staff user.
5. Create `.env.local` and add the two environment variables above.
6. Start the app.

```bash
npm run dev
```

7. Open `http://localhost:3000/login`.

## Supabase Setup

The schema in [`supabase/schema.sql`](./supabase/schema.sql) creates:

- `members`
- `subscriptions`
- row level security policies for authenticated users
- `create_member_with_subscription(...)`
- `renew_membership(...)`
- normalization and timestamp triggers

Every renewal creates a new row in `subscriptions`. Membership expiry is always `payment_date + 30 days`.

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repository into Vercel as a Next.js project.
3. Add these environment variables in Vercel:
   `NEXT_PUBLIC_SUPABASE_URL`
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy after saving the variables.
5. Make sure the same Supabase project has already run [`supabase/schema.sql`](./supabase/schema.sql).
6. Create the staff user in Supabase Auth.

## Branding

- If `public/logo.png` exists, the app shows the real logo.
- If it does not exist, the app falls back to the built-in `ESF` placeholder.
