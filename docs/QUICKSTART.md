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

Edit `.env.local` with your values:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase connection string (pooled) |
| `DIRECT_URL` | Supabase direct connection string |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `NEXT_PUBLIC_APP_URL` | App URL (default: `http://localhost:3000`) |

**Mock mode:** Set `OPENAI_MOCK=true` to run without an OpenAI key. The app will return deterministic placeholder responses instead of calling the API.

## 3. Database Setup

Generate the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

## 4. Seed the Database

The seed script populates the database with sample data:

```bash
npx prisma db seed
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

```bash
npm test
```

## Key Features

1. **Profile Setup** (`/profile`) — Set up your student profile with school, major, career interests
2. **Match Discovery** (`/matches`) — AI-powered mentor matching with 6-dimension scoring
3. **Mentor Detail** (`/mentor/[id]`) — Detailed mentor profiles with career timelines and AI rationale
4. **Outreach Composer** (`/outreach/[id]`) — AI-generated outreach messages with tone guidance
5. **Dashboard** (`/dashboard`) — Track your mentorship connections through a pipeline view
