# ElAmidy Sports Fitness Dashboard

Private membership management app for the owner and staff of ElAmidy Sports Fitness.

## Stack

- Next.js 16 App Router
- Tailwind CSS v4
- shadcn-style UI components
- Lucide icons
- Supabase Auth + Postgres
- Vercel-ready deployment

## Exact Environment Variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can start from [`.env.example`](./.env.example).

## Exact Supabase SQL Schema

Run the exact contents of [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor.

That schema creates:

- `members`
- `subscriptions`
- row level security policies for authenticated users
- `create_member_with_subscription(...)`
- `renew_membership(...)`
- member field normalization and `updated_at` triggers

## Exact Local Setup Steps

1. Install dependencies:

```bash
npm install
```

2. Create a Supabase project.

3. In Supabase, open `SQL Editor` and run [`supabase/schema.sql`](./supabase/schema.sql).

4. In Supabase, open `Authentication > Users` and create at least one email/password user for staff access.

5. Create `.env.local` from [`.env.example`](./.env.example):

```bash
copy .env.example .env.local
```

6. Fill in the two environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

7. Start the app:

```bash
npm run dev
```

8. Open `http://localhost:3000/login` and sign in with the Supabase user you created.

## Exact Vercel Deployment Steps

1. Push this project to GitHub.

2. In Vercel, click `Add New... > Project` and import the repository.

3. Keep the default Next.js framework settings.

4. In `Project Settings > Environment Variables`, add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Redeploy the project after saving the environment variables.

6. In Supabase, make sure the SQL schema from [`supabase/schema.sql`](./supabase/schema.sql) has been run in the same project.

7. In Supabase Auth, create the owner/staff user who will log in on the deployed app.

8. Open the deployed Vercel URL and sign in at `/login`.

If the deployed site shows the setup screen, it means one of these is still missing:

- Vercel environment variables
- Supabase SQL schema
- a Supabase Auth user

## Notes

- The app uses real Supabase data only.
- Every renewal creates a new row in `subscriptions`.
- Membership expiry is always `payment_date + 30 days`.
- If `public/logo.png` exists, the real logo is shown.
- If `public/logo.png` does not exist, the app falls back to the `ESF` placeholder.
# gym-management
# gym-management
# gym-management
# gym-management
# gym-management
# gym-management
