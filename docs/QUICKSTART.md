# MentorPath Quick Start Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase project (PostgreSQL) — [supabase.com](https://supabase.com)
- An OpenAI API key — [platform.openai.com](https://platform.openai.com)

## 1. Install Dependencies

```bash
npm install
```

## 2. Environment Setup

Copy the example env file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

### Getting your Supabase connection strings

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and open your project
2. Click **Connect** (green button, top right)
3. Select **ORMs** → **Prisma**
4. Copy both `DATABASE_URL` and `DIRECT_URL` — paste them into `.env.local`

### Environment variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | Supabase pooled connection (port `6543`, with `?pgbouncer=true`) | Yes |
| `DIRECT_URL` | Supabase direct connection (port `5432`) | Yes |
| `OPENAI_API_KEY` | Your OpenAI API key | Yes* |
| `OPENAI_MOCK` | Set to `true` to skip OpenAI calls (uses mock responses) | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | No |
| `NEXT_PUBLIC_APP_URL` | App URL (default: `http://localhost:3000`) | No |

*Not required if `OPENAI_MOCK=true`.

## 3. Database Setup

Push the Prisma schema to your Supabase database:

```bash
npx dotenv -e .env.local -- npx prisma db push
```

## 4. Seed the Database

Populate with sample data:

```bash
npx dotenv -e .env.local -- npx prisma db seed
```

This creates:

### Student Profile (1)
| Field | Value |
|---|---|
| Name | Liang Chen |
| School | MIT - Massachusetts Institute of Technology |
| Major | Computer Science |
| Graduation Year | 2026 |
| Visa Status | F-1 |
| Target Industries | Climate Tech, Technology |
| Target Roles | Product Manager, Strategy |

### Alumni Mentors (70 total)
- **20 hand-crafted profiles** with detailed career timelines, pivot stories, and bios
- **50 generated profiles** with randomized attributes for variety

Alumni are distributed across 5 schools:
- MIT - Massachusetts Institute of Technology
- Harvard University
- Stanford University
- New York University
- University of Pennsylvania

Majors include: Computer Science, Business Administration, Data Science, Electrical Engineering, Economics, Mechanical Engineering, Applied Mathematics, Biomedical Engineering, and more.

Industries covered: Technology, Consulting, Finance, Climate Tech, Healthcare, Nonprofit, Social Impact.

## 5. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 6. Run Tests

### Unit & component tests

```bash
npm test
```

### E2E tests (Playwright)

```bash
npm run test:e2e
```

E2E tests run against a local dev server with `OPENAI_MOCK=true`. They cover:
- Profile setup and persistence
- Match generation and filtering
- Mentor detail pages with rationale
- Outreach message composition
- Dashboard connection pipeline

## Key Features

1. **Profile Setup** (`/profile`) — Set up your student profile with school, major, career interests
2. **Match Discovery** (`/matches`) — AI-powered mentor matching with 6-dimension scoring
3. **Mentor Detail** (`/mentor/[id]`) — Detailed mentor profiles with career timelines and AI rationale
4. **Outreach Composer** (`/outreach/[id]`) — AI-generated outreach messages with tone guidance
5. **Dashboard** (`/dashboard`) — Track your mentorship connections through a pipeline view
