# MentorPath - Technical Specification

**Version**: 1.0
**Date**: March 4, 2026

---

## 1. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | React-based, SSR/SSG, API routes, Vercel-native |
| **Language** | TypeScript | Type safety across frontend + backend |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI development, consistent design system |
| **Database** | PostgreSQL (Supabase) | Hosted Postgres, built-in REST API, free tier |
| **ORM** | Prisma | Type-safe DB queries, migrations, schema management |
| **AI** | Anthropic Claude API | Match rationale generation, conversation prompts |
| **Deployment** | Vercel | Zero-config Next.js hosting, preview deploys |
| **State Management** | React Context + SWR | Lightweight, good for data fetching patterns |

## 2. Project Structure

```
mentorpath/
├── .env.local                  # Supabase + Claude API keys
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script for mock alumni data
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (nav, sidebar)
│   │   ├── page.tsx            # Landing / home (redirects to profile or dashboard)
│   │   ├── profile/
│   │   │   └── page.tsx        # Profile setup & onboarding
│   │   ├── matches/
│   │   │   └── page.tsx        # AI matching results + browse/filter
│   │   ├── mentor/
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Mentor detail & preparation
│   │   ├── outreach/
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Outreach composer for specific mentor
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Connection tracking dashboard
│   │   └── api/
│   │       ├── matches/
│   │       │   └── route.ts    # POST: run matching algorithm
│   │       ├── mentors/
│   │       │   ├── route.ts    # GET: list/filter mentors
│   │       │   └── [id]/
│   │       │       └── route.ts # GET: mentor detail
│   │       ├── rationale/
│   │       │   └── route.ts    # POST: generate Claude rationale
│   │       ├── outreach/
│   │       │   └── route.ts    # POST: generate message template
│   │       ├── connections/
│   │       │   └── route.ts    # GET/POST/PATCH: connection tracking
│   │       └── profile/
│   │           └── route.ts    # GET/POST: student profile CRUD
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── PageContainer.tsx
│   │   ├── profile/
│   │   │   ├── ProfileForm.tsx
│   │   │   └── CompletionBar.tsx
│   │   ├── matches/
│   │   │   ├── MatchCard.tsx
│   │   │   ├── MatchList.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── SortDropdown.tsx
│   │   ├── mentor/
│   │   │   ├── MentorProfile.tsx
│   │   │   ├── CareerTimeline.tsx
│   │   │   ├── MatchRationale.tsx
│   │   │   └── ConversationPrompts.tsx
│   │   ├── outreach/
│   │   │   ├── MessageComposer.tsx
│   │   │   └── ToneGuidance.tsx
│   │   └── dashboard/
│   │       ├── ConnectionPipeline.tsx
│   │       ├── ConnectionCard.tsx
│   │       └── StatsOverview.tsx
│   ├── lib/
│   │   ├── db.ts               # Prisma client singleton
│   │   ├── claude.ts           # Claude API client wrapper
│   │   ├── matching.ts         # Rule-based scoring algorithm
│   │   └── utils.ts            # Shared helpers
│   └── types/
│       └── index.ts            # Shared TypeScript types
├── public/
│   └── images/                 # Static assets
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 3. Database Schema

### 3.1 Entity Relationship

```
StudentProfile 1 ──── * Connection * ──── 1 AlumniProfile
                                              │
                                              * MatchResult
```

### 3.2 Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model StudentProfile {
  id                String       @id @default(cuid())
  name              String
  school            String
  program           String
  graduationYear    Int
  priorRoles        Json         // [{ title, company, industry, years }]
  visaStatus        String?      // "F-1", "H-1B", "green_card", "citizen", etc.
  industries        String[]     // target industries
  roleInterests     String[]     // target role types
  pivotDirection    String?      // free text description of career goals
  geographicPrefs   String[]     // preferred locations
  mentorPreferences String?      // what they want from a mentor
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  connections       Connection[]
  matchResults      MatchResult[]
}

model AlumniProfile {
  id                String       @id @default(cuid())
  name              String
  graduationYear    Int
  school            String
  program           String
  currentRole       String
  currentCompany    String
  industry          String
  careerTimeline    Json         // [{ title, company, startYear, endYear }]
  pivotType         String?      // e.g., "data analyst → product manager"
  skills            String[]
  visaHistory       String[]     // ["F-1", "H-1B", "green_card"]
  geographicHistory String[]
  openness          String       // "one_time_chat" | "short_term_advising" | "ongoing_mentorship"
  topicsWilling     String[]     // topics open to discuss
  responseRate      Float        @default(0.8) // simulated
  lastActive        DateTime     @default(now())
  bio               String?
  createdAt         DateTime     @default(now())

  connections       Connection[]
  matchResults      MatchResult[]
}

model MatchResult {
  id              String         @id @default(cuid())
  studentId       String
  alumniId        String
  score           Float          // 0-100
  scoreBreakdown  Json           // { academic: 20, visa: 15, pivot: 30, ... }
  rationale       String?        // Claude-generated plain-language rationale
  createdAt       DateTime       @default(now())

  student         StudentProfile @relation(fields: [studentId], references: [id])
  alumni          AlumniProfile  @relation(fields: [alumniId], references: [id])

  @@unique([studentId, alumniId])
}

model Connection {
  id              String         @id @default(cuid())
  studentId       String
  alumniId        String
  status          String         @default("saved") // saved | outreach_sent | replied | met | ongoing
  outreachMessage String?
  notes           String?
  lastActivityAt  DateTime       @default(now())
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  student         StudentProfile @relation(fields: [studentId], references: [id])
  alumni          AlumniProfile  @relation(fields: [alumniId], references: [id])

  @@unique([studentId, alumniId])
}
```

## 4. API Design

### 4.1 Student Profile

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | Get current student profile |
| POST | `/api/profile` | Create/update student profile |

**POST /api/profile** body:
```json
{
  "name": "Liang Chen",
  "school": "MIT Sloan",
  "program": "MBA",
  "graduationYear": 2026,
  "priorRoles": [{ "title": "Data Analyst", "company": "TechCorp", "industry": "Technology", "years": 4 }],
  "visaStatus": "F-1",
  "industries": ["climate_tech", "product_management"],
  "roleInterests": ["Product Manager", "Strategy"],
  "pivotDirection": "Transition from data analytics to product management in climate tech",
  "geographicPrefs": ["San Francisco", "New York", "Boston"],
  "mentorPreferences": "Someone who has navigated a similar career pivot and visa process"
}
```

### 4.2 Matching

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/matches` | Run matching algorithm for student |

**POST /api/matches** body:
```json
{
  "studentId": "clx..."
}
```

**Response**:
```json
{
  "matches": [
    {
      "alumniId": "clx...",
      "score": 94,
      "scoreBreakdown": {
        "academicBackground": 20,
        "careerPivot": 30,
        "visaAlignment": 20,
        "industryMatch": 15,
        "geographicProximity": 9
      },
      "rationale": "Like you, Sarah pivoted from data analytics to product management at a climate tech startup, and navigated the F-1 to H-1B transition.",
      "alumni": { ... }
    }
  ]
}
```

### 4.3 Mentor Detail & Rationale

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/mentors/:id` | Get full alumni profile |
| POST | `/api/rationale` | Generate detailed match rationale + prompts via Claude |

**POST /api/rationale** body:
```json
{
  "studentId": "clx...",
  "alumniId": "clx..."
}
```

**Response**:
```json
{
  "detailedRationale": "Sarah's career path closely mirrors your goals...",
  "alignmentPoints": [
    "Both transitioned from data analytics roles",
    "Both navigated F-1 to H-1B visa process",
    "Shared interest in climate technology"
  ],
  "conversationPrompts": [
    "What made you decide to leave your data analyst role for product management?",
    "How did you navigate the H-1B sponsorship process during your career transition?",
    "What skills from data analytics have been most transferable to your PM role?"
  ]
}
```

### 4.4 Outreach

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/outreach` | Generate outreach message template via Claude |

**POST /api/outreach** body:
```json
{
  "studentId": "clx...",
  "alumniId": "clx...",
  "purpose": "one_time_chat"
}
```

### 4.5 Connections

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/connections` | List all connections for student |
| POST | `/api/connections` | Create new connection (save mentor) |
| PATCH | `/api/connections/:id` | Update connection status |

## 5. Matching Algorithm

### 5.1 Rule-Based Scoring (100 points total)

| Dimension | Max Points | Logic |
|---|---|---|
| **Career Pivot Similarity** | 30 | Compare student's prior role + target with alumni's actual pivot path. Exact match = 30, partial = 15-25 |
| **Academic Background** | 20 | Same school = 10, same program = 10, overlapping year range = 5 |
| **Visa Alignment** | 20 | Shared visa type = 20, related visa path = 10 |
| **Industry Match** | 15 | Alumni current industry matches student interest = 15, adjacent = 8 |
| **Geographic Proximity** | 10 | Shared geographic preference = 10 |
| **Stage Proximity** | 5 | Years since graduation alignment |

### 5.2 Claude Rationale Generation

**System prompt**:
```
You are a mentor matching assistant for MentorPath, a platform that helps
graduate students find alumni mentors. Given a student profile and an alumni
profile, generate a concise 1-2 sentence match rationale that explains why
this alumni is a good match. Focus on shared experiences, similar career
transitions, and relevant constraints like visa status. Be warm and encouraging.
```

**Input**: Student profile JSON + Alumni profile JSON + match score breakdown
**Output**: Plain-language rationale string

## 6. Seed Data Strategy

### Alumni Profile Generation
- **Hand-crafted core set** (~20 profiles): Diverse backgrounds covering key personas — career pivoters, international students, various industries, different openness levels
- **Generated expansion** (~30-80 profiles): Use Claude to generate realistic alumni profiles with varied backgrounds, ensuring diversity in:
  - Industries: Tech, consulting, finance, climate tech, healthcare, nonprofit
  - Pivots: Engineering → PM, analyst → strategy, academia → industry, finance → tech
  - Visa paths: F-1 → OPT → H-1B → green card, citizen, various nationalities
  - Openness: Mix of one-time chat, short-term, ongoing

### Default Student Profile
- Pre-filled with Liang Chen's persona for demo purposes
- Editable to test different matching scenarios

## 7. Environment Variables

```env
# Supabase
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 8. Deployment

### Vercel Configuration
- **Framework**: Next.js (auto-detected)
- **Build command**: `next build`
- **Environment variables**: Set via Vercel dashboard
- **Preview deploys**: Auto on PR branches

### Supabase Setup
- Create project on Supabase free tier
- Run Prisma migrations: `npx prisma migrate deploy`
- Seed data: `npx prisma db seed`

## 9. Performance Considerations

| Concern | Approach |
|---|---|
| Claude API latency (2-5s per call) | Generate rationales async; cache in MatchResult table |
| Large match computation | Pre-compute scores on profile save; store in MatchResult |
| Filter/sort responsiveness | Client-side filtering on pre-fetched match list |
| Seed data loading | Run seed script once; Supabase persists |

## 10. Future Extensions (Post-MVP)

- Authentication (NextAuth.js with Google/university SSO)
- Alumni self-registration portal
- Real email integration (SendGrid/Resend)
- LinkedIn profile import
- Mobile PWA
- Analytics dashboard for university career offices
- Multi-university support
