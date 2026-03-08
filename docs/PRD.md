# MentorPath - Product Requirements Document

**Version**: 1.0
**Date**: March 4, 2026
**Team 15**: Bingyi Zhang, Fengyi Ye, Mingyang Sun, Zhongyang Huang
**Course**: 15.785 Introduction to Product Management

---

## 1. Problem Statement

Graduate students spend hours manually searching alumni on LinkedIn and university career portals, but keyword-based search fails to surface people who meaningfully resonate with their background, constraints, and career pivot goals. Students face four compounding pain points:

1. **Manual, time-consuming search** across fragmented tools (LinkedIn, Excel, alumni portals)
2. **Keyword filtering misses meaningful alignment** (visa status, career pivot trajectory, shared background)
3. **No visibility into alumni openness** to conversation (one-time chat vs. ongoing mentorship)
4. **Fragmented workflow** leads to scattered effort, low response rates, and high anxiety

## 2. Target User

**Primary persona**: Liang Chen

- 28-year-old second-year MBA student at MIT Sloan
- Former data analyst (4 years at a large tech firm), exploring career pivot
- F-1 visa holder (Chinese national), navigating U.S. networking norms
- Interested in technology, social impact, climate tech, product management
- Does not have a clearly defined target role; needs pattern discovery, not keyword search

**JTBD**: "When I am facing career choice uncertainty, help me find an alumnus whose background resonates with mine and can provide actionable insights, and facilitate starting a conversation in a clear and unambiguous way."

**Deep needs**:
- Efficiency & Precision: Intelligent matches with reasoning, not keyword filtering
- Clarity & Confidence: Clear engagement expectations + contextual outreach support
- Belonging & Path Validation: See alumni who followed similar paths to validate possibilities

## 3. Value Proposition

**Central statement**: From keyword search to pattern-based, guided mentor discovery.

| Pillar | Description |
|---|---|
| **AI Pattern Matching** | Surface alumni by multidimensional alignment (academic background, career pivot, visa context, industry) — not just job titles |
| **Openness Signals** | See who's available and for what (one-time chat vs. ongoing mentorship), reducing outreach anxiety |
| **Integrated Workflow** | Centralized contact tracking + guided message templates to reduce cognitive load |

## 4. MVP Scope

### 4.1 What We're Validating

> Does pattern-based matching with a match rationale reduce student anxiety and increase outreach initiation rate?

### 4.2 Core Features (V1)

#### Feature 1: Profile Setup & Onboarding
- Student enters background information: school, program, prior role(s), years of experience
- Student enters constraints: visa status, geographic preferences
- Student enters interests/goals: industries of interest, role types, career pivot direction
- Profile completion indicator (percentage bar)

**Acceptance criteria**:
- User can complete profile in < 3 minutes
- All fields are optional but system shows completion % to encourage full profiles
- Data persists in Supabase

#### Feature 2: AI-Powered Matching Engine
- **Rule-based scoring**: Weighted algorithm considers shared school/program, visa status overlap, career transition similarity, industry alignment, geographic proximity, stage proximity
- **Claude API rationale**: For each match, generate a 1-2 sentence plain-language explanation (e.g., "Like you, she pivoted from data analytics to climate tech on an F-1 visa")
- Returns ranked list of alumni with match score (0-100%)

**Acceptance criteria**:
- Matching completes in < 5 seconds
- Each match includes a numeric score + plain-language rationale
- Results are ranked by relevance score

#### Feature 3: Browse & Filter Matches
- Match cards display: name, current role/company, match score, openness badge, 1-line rationale
- Filters: industry, openness type, match threshold slider, visa experience, career transition type
- Sort: by match score, by recency of alumni activity

**Acceptance criteria**:
- Filter/sort updates results in real-time (no page reload)
- Cards show openness badge clearly (coffee chat / ongoing mentorship / short-term advising)
- Minimum 3 filter dimensions available

#### Feature 4: Mentor Detail & Preparation
- Expanded mentor profile: full career timeline, education, skills, shared connections
- Match rationale expanded: detailed breakdown of why this mentor was recommended
- Conversation prompts: AI-generated suggested questions based on the match context
- "Why this match" section with specific alignment points

**Acceptance criteria**:
- Detail page loads from match card click
- At least 3 conversation prompts generated per mentor
- Career timeline is visually displayed

#### Feature 5: Outreach Composer
- Pre-populated message template based on match rationale and mentor context
- Student can edit/customize the message before sending
- Tone guidance (e.g., "Keep it concise, mention your shared background")
- Message preview before send

**Acceptance criteria**:
- Template auto-fills with relevant context from match data
- Student can fully edit the message
- Character count / recommended length guidance shown

#### Feature 6: Connection Tracking Dashboard
- Status pipeline for each connection: Saved / Outreach Sent / Replied / Met / Ongoing
- Timeline view of all interactions
- Follow-up reminders (visual indicator, no push notifications in MVP)
- Stats: total matches, outreach sent, confirmed conversations, best match score

**Acceptance criteria**:
- Drag-and-drop or click to update connection status
- Dashboard shows summary stats at top
- Each connection shows last activity date

### 4.3 Out of Scope (V1)

- User authentication / accounts (single demo user)
- Real email/LinkedIn message sending (outreach is simulated)
- Alumni self-service portal (alumni profiles are seeded, not user-created)
- Push notifications
- Mobile native app (responsive web only)
- Real-time chat between student and alumni
- Payment/subscription features

## 5. User Flow

```
Sign Up & Profile Setup
        ↓
    AI Matching (rule-based scoring + Claude rationale)
        ↓
    Browse & Filter (match cards with openness badges)
        ↓
    Select & Prepare (mentor detail + conversation prompts)
        ↓
    Initiate Outreach (guided message template)
        ↓
    Track & Follow Up (connection status dashboard)
```

## 6. Success Metrics

| Metric | Target | How Measured |
|---|---|---|
| Profile completion rate | > 80% of fields filled | Profile completion % |
| Time to first match view | < 10 seconds from profile submit | Frontend timer |
| Match relevance (self-reported) | > 4/5 rating | Post-match survey |
| Outreach initiation rate | > 60% of users initiate at least 1 outreach | Dashboard tracking |
| Outreach anxiety reduction | Qualitative improvement | User interview feedback |

## 7. Key Differentiators vs. Alternatives

| Dimension | LinkedIn / Alumni Portals | MentorPath |
|---|---|---|
| Search method | Keyword/filter-based | Pattern-based AI matching |
| Profile context | Static, self-reported | Enriched with match rationale |
| Openness signals | None | Explicit availability badges |
| Outreach support | Blank message box | Guided templates with context |
| Tracking | External (spreadsheets) | Integrated pipeline dashboard |

## 8. Data Requirements

### Mock Alumni Dataset (~50-100 profiles)
Each alumni profile includes:
- **Identity**: Name, graduation year, program, school
- **Career**: Current role, company, industry, previous roles (career timeline)
- **Transition**: Career pivot type (e.g., "data analyst → product manager"), years since pivot
- **Constraints**: Visa history (F-1, H-1B, green card, citizen), geographic history
- **Mentorship**: Openness level (one-time chat, short-term advising, ongoing mentorship), topics willing to discuss
- **Skills**: Key skills, certifications
- **Engagement**: Last active date, response rate (simulated)

### Student Profile Data
- School, program, graduation year
- Prior role(s) and industry
- Visa status
- Career interests (industries, role types)
- Geographic preferences
- What they're looking for in a mentor

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Claude API latency | Slow match generation | Cache rationales; generate async |
| Mock data feels unrealistic | Poor demo experience | Hand-craft ~20 core profiles, generate rest with realistic variation |
| Scoring algorithm bias | Unfair matches | Transparent scoring breakdown shown to user |
| Scope creep | Delayed delivery | Strict MVP boundary; out-of-scope items documented |

## 10. Timeline

| Phase | Deliverable | Target |
|---|---|---|
| Phase 1 | Documents (PRD, Tech Spec, Design System) | Week 1 |
| Phase 2 | Project scaffold + Supabase setup + seed data | Week 1-2 |
| Phase 3 | Profile setup + matching engine | Week 2-3 |
| Phase 4 | Browse/filter + mentor detail | Week 3 |
| Phase 5 | Outreach + tracking dashboard | Week 3-4 |
| Phase 6 | Polish, test, deploy to Vercel | Week 4 |
