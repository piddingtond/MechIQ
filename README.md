# MechIQ — AI Chat Assistant for UK Mechanics

MechIQ is a subscription SaaS that gives UK mechanics instant AI-powered answers on vehicle diagnostics, fault codes, service intervals, and repair procedures. Built on Next.js, Supabase, Stripe, and Claude.

---

## What it does

- **AI chat** — Ask any vehicle question with make/model/mileage context; Claude answers with mechanic-grade detail
- **Free tier** — 5 queries/day, no account required for basic use
- **Paid tiers** — Individual (£15/mo), Garage Team (£35/mo), Multi-Bay (£75/mo) — all 500 queries/day
- **Session history** — Conversations saved per vehicle, auto-titled
- **Subscription management** — Stripe Customer Portal for billing changes, cancellations
- **Admin dashboard** — Role-based view of all users, subscriptions, and usage

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database + Auth | Supabase (PostgreSQL + RLS) |
| Payments | Stripe (subscriptions + webhooks) |
| AI | Anthropic Claude (claude-sonnet-4-6 for chat, claude-haiku-4-5 for titles) |
| Hosting | Vercel (London region — lhr1) |
| Styling | Tailwind CSS |

---

## Local development

### Prerequisites
- Node.js 18+
- A Supabase project
- A Stripe account (test mode is fine for dev)
- An Anthropic API key

### Setup

```bash
git clone <repo>
cd mechiq
npm install
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials (see Environment Variables below), then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database setup

Run these SQL files **in order** in the Supabase SQL Editor:

1. `database/schema.sql` — all tables, RLS policies, indexes
2. `database/functions.sql` — `handle_new_user` trigger + `increment_query_count` RPC
3. `database/migrations/001_subscriptions_unique_user.sql`
4. `database/migrations/002_admin_rls_policies.sql`

Then set your admin account:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```

---

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_INDIVIDUAL=price_...   # £15/mo
STRIPE_PRICE_TEAM=price_...         # £35/mo
STRIPE_PRICE_MULTI_BAY=price_...    # £75/mo

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://mechiq.co.uk   # production only

# Dev bypass
STRIPE_TEST_MODE=false   # set to true to skip real Stripe in dev
```

---

## Stripe setup

1. Create three monthly recurring products in the Stripe Dashboard:
   - **MechIQ Individual** — £15/month
   - **MechIQ Garage Team** — £35/month
   - **MechIQ Multi-Bay** — £75/month
2. Copy the price IDs to `STRIPE_PRICE_INDIVIDUAL`, `STRIPE_PRICE_TEAM`, `STRIPE_PRICE_MULTI_BAY`
3. Add a webhook endpoint pointing to `https://mechiq.co.uk/api/webhook` with these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Deployment (Vercel)

The project is pre-configured for Vercel (London region, `vercel.json`).

```bash
# First deployment
vercel --prod

# Subsequent deploys
git push  # if connected to GitHub via Vercel dashboard
```

Add all environment variables in the Vercel dashboard under Project → Settings → Environment Variables. Use the same keys as `.env.local` with production values.

After deployment, update the Stripe webhook URL to the live domain.

---

## API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Sign in, returns session tokens |
| `/auth/callback` | GET | Supabase email confirmation handler |
| `/api/chat` | POST | AI chat endpoint (rate-limited by tier) |
| `/api/subscribe` | POST | Create Stripe Checkout session |
| `/api/billing-portal` | POST | Open Stripe Customer Portal |
| `/api/webhook` | POST | Stripe webhook (subscription sync) |

---

## Data model

| Table | Purpose |
|---|---|
| `profiles` | User identity, role (`mechanic` / `admin`), garage name |
| `subscriptions` | Tier, Stripe IDs, status, billing period |
| `chat_sessions` | Conversation containers with vehicle context |
| `chat_messages` | Individual messages per session |
| `query_usage` | Daily query count per user (for rate limiting) |

All tables have Row Level Security enabled. Users see only their own data. Admins bypass RLS.

---

## Custom domain (end of month)

1. Buy `mechiq.co.uk` via Namecheap or 123-reg (~£10/yr)
2. Add domain in Vercel: Project → Domains → Add
3. Set DNS at registrar:
   - `A @ → 76.76.21.21`
   - `CNAME www → cname.vercel-dns.com`
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel env → redeploy
5. Update Stripe webhook URL to `https://mechiq.co.uk/api/webhook`
6. Update Supabase auth redirect URLs to include `https://mechiq.co.uk`

---

## Known limitations / future work

- **Vehicle data**: ~8,500 UK vehicle nodes were scoped for a future iteration using the DVSA MOT API piped to Supabase. Not a launch blocker — the AI answers well without it.
- **Team features**: Team and Multi-Bay tiers are priced; team-member management UI is a future sprint.
