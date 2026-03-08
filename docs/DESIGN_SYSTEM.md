# MentorPath - Design System

**Version**: 1.0
**Date**: March 4, 2026

---

## 1. Brand Identity

**MentorPath** is a professional, approachable, and trustworthy platform for graduate students navigating career uncertainty. The visual language should feel:

- **Professional** — Suitable for MBA / graduate context
- **Approachable** — Not intimidating; reduces networking anxiety
- **Clear** — Information hierarchy that reduces cognitive load
- **Warm** — Encouraging tone in copy and visual cues

---

## 2. Color Palette

### Primary Colors

| Name | Hex | Usage |
|---|---|---|
| **Blue 700** (Primary) | `#0A66C2` | Primary actions, links, active states, branding |
| **Blue 900** (Dark) | `#004182` | Headings, emphasis, hover states |
| **Blue 50** (Light) | `#E3F0FE` | Backgrounds, highlights, badges |

### Neutral Colors

| Name | Hex | Usage |
|---|---|---|
| **Gray 900** | `#191919` | Primary text |
| **Gray 600** | `#666666` | Secondary text, labels |
| **Gray 400** | `#A0A0A0` | Placeholder text, disabled states |
| **Gray 100** | `#F3F2EF` | Page background |
| **White** | `#FFFFFF` | Cards, surfaces |
| **Border** | `#D0D0D0` | Borders, dividers |

### Semantic Colors

| Name | Hex | Usage |
|---|---|---|
| **Success** | `#057642` | Connected, completed, high match scores |
| **Warning** | `#E0A100` | Pending states, medium match scores |
| **Danger** | `#C73428` | Errors, low compatibility alerts |
| **Info** | `#0A66C2` | Informational badges, tips |

### Tailwind Config

```js
// tailwind.config.ts - extend colors
colors: {
  brand: {
    50: '#E3F0FE',
    100: '#C7E1FD',
    200: '#8FC3FB',
    300: '#57A5F9',
    400: '#1F87F7',
    500: '#0A6ED1',
    600: '#0A66C2',  // primary
    700: '#085BA5',
    800: '#064F88',
    900: '#004182',  // dark
  }
}
```

---

## 3. Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
```

Use Tailwind's `font-sans` class, which maps to this stack.

### Scale

| Element | Size | Weight | Line Height | Tailwind Class |
|---|---|---|---|---|
| Page title | 28px | Bold (700) | 1.2 | `text-3xl font-bold` |
| Section heading | 22px | Semibold (600) | 1.3 | `text-xl font-semibold` |
| Card title | 18px | Semibold (600) | 1.4 | `text-lg font-semibold` |
| Body | 15px | Regular (400) | 1.5 | `text-base` |
| Small / caption | 13px | Regular (400) | 1.5 | `text-sm text-gray-600` |
| Label | 13px | Medium (500) | 1.4 | `text-sm font-medium` |
| Badge text | 12px | Medium (500) | 1 | `text-xs font-medium` |

---

## 4. Spacing & Layout

### Spacing Scale
Follow Tailwind's default spacing (4px base unit):
- `4` = 16px (element padding)
- `6` = 24px (section padding)
- `8` = 32px (section gap)
- `12` = 48px (page margin)

### Layout

| Property | Value |
|---|---|
| Max content width | `1128px` (`max-w-6xl`) |
| Sidebar width | `280px` |
| Card border radius | `8px` (`rounded-lg`) |
| Page padding | `24px` (`p-6`) |

### Grid System
- **Dashboard layout**: Sidebar (280px fixed) + Main content (fluid)
- **Match cards**: 1 column on mobile, 2 on tablet, 3 on desktop
- **Filter panel**: Left sidebar on desktop, collapsible drawer on mobile

---

## 5. Component Library

All components built with **shadcn/ui** as the base, customized with brand colors.

### 5.1 Cards

**Match Card** — Primary display unit for mentor matches.

```
┌─────────────────────────────────────────────┐
│  [Avatar]  Name                  Score: 94%  │
│            Current Role @ Company            │
│            ☕ One-time chat                   │
│                                              │
│  "Like you, she pivoted from data analytics  │
│   to climate tech on an F-1 visa"            │
│                                              │
│  [View Profile]            [Save]            │
└─────────────────────────────────────────────┘
```

Styles:
- Background: white
- Border: `1px solid #D0D0D0`
- Shadow: `0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.1)`
- Border radius: `8px`
- Padding: `20px`
- Hover: slight shadow increase

### 5.2 Badges

**Openness Badges**:

| Badge | Color | Icon | Text |
|---|---|---|---|
| One-time chat | Blue 50 bg + Blue 600 text | Coffee icon | "1x Chat" |
| Short-term advising | Blue 50 bg + Blue 600 text | Calendar icon | "Short-term" |
| Ongoing mentorship | Success bg + Success text | Users icon | "Ongoing" |

**Match Score Badge**:
- 80-100%: Green background (`#057642`)
- 60-79%: Blue background (`#0A66C2`)
- Below 60%: Gray background

### 5.3 Buttons

| Variant | Style |
|---|---|
| **Primary** | `bg-brand-600 text-white hover:bg-brand-700` rounded-lg px-4 py-2 |
| **Secondary** | `border border-brand-600 text-brand-600 hover:bg-brand-50` |
| **Ghost** | `text-brand-600 hover:bg-brand-50` |
| **Danger** | `bg-red-600 text-white hover:bg-red-700` |

### 5.4 Form Inputs

- Border: `1px solid #D0D0D0`
- Focus: `ring-2 ring-brand-600 border-brand-600`
- Border radius: `6px` (`rounded-md`)
- Padding: `8px 12px`
- Placeholder color: `#A0A0A0`

### 5.5 Navigation Bar

```
┌──────────────────────────────────────────────────────────────────┐
│  [Logo] Mentor Path    [Search...]    Home  Discover  Messages  │
│                                       Notifications  [Avatar]   │
└──────────────────────────────────────────────────────────────────┘
```

- Background: white
- Height: `56px`
- Box shadow: `0 0 0 1px rgba(0,0,0,0.08)`
- Sticky top
- Active nav item: blue underline + blue icon

### 5.6 Connection Status Pipeline

| Status | Color | Icon |
|---|---|---|
| Saved | Gray 100 bg | Bookmark |
| Outreach Sent | Blue 50 bg | Send |
| Replied | Blue 100 bg | MessageCircle |
| Met | Success light bg | CheckCircle |
| Ongoing | Success bg | Users |

---

## 6. Iconography

Use **Lucide React** icons (included with shadcn/ui).

Key icons:
- `Search` — search bar
- `Home` — home nav
- `Users` — discover/mentors
- `MessageCircle` — messages
- `Bell` — notifications
- `Coffee` — one-time chat
- `Calendar` — short-term advising
- `UserCheck` — ongoing mentorship
- `Send` — outreach sent
- `Bookmark` — save mentor
- `ChevronRight` — card navigation
- `Filter` — filter panel
- `ArrowUpDown` — sort
- `Sparkles` — AI-generated content indicator

---

## 7. Page Layouts

### 7.1 Profile Setup

```
┌──────────────────────────────────────┐
│  Navbar                              │
├──────────────────────────────────────┤
│         Welcome to MentorPath        │
│      Tell us about your background   │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  Profile Completion: ████ 65% │   │
│  └──────────────────────────────┘    │
│                                      │
│  Section: Background                 │
│  ┌────────────┐ ┌────────────┐       │
│  │ School     │ │ Program    │       │
│  └────────────┘ └────────────┘       │
│  ┌────────────┐ ┌────────────┐       │
│  │ Grad Year  │ │ Visa Status│       │
│  └────────────┘ └────────────┘       │
│                                      │
│  Section: Career History             │
│  ┌──────────────────────────────┐    │
│  │ + Add Prior Role             │    │
│  └──────────────────────────────┘    │
│                                      │
│  Section: What You're Looking For    │
│  ┌──────────────────────────────┐    │
│  │ Industries (multi-select)    │    │
│  │ Role types (multi-select)    │    │
│  │ Pivot direction (text)       │    │
│  └──────────────────────────────┘    │
│                                      │
│  [Find My Mentors →]                 │
└──────────────────────────────────────┘
```

### 7.2 Matches (Browse & Filter)

```
┌──────────────────────────────────────────────┐
│  Navbar                                      │
├─────────┬────────────────────────────────────┤
│ Sidebar │  Welcome back, Liang!              │
│         │  12 Highly Matched Mentors         │
│ Profile │                                    │
│ Summary │  ┌─────────┐ ┌─────────┐ ┌──────┐ │
│         │  │ Match   │ │ Match   │ │Match │ │
│ Filters │  │ Card 1  │ │ Card 2  │ │Card 3│ │
│ ──────  │  └─────────┘ └─────────┘ └──────┘ │
│ Industry│                                    │
│ Openness│  ┌─────────┐ ┌─────────┐ ┌──────┐ │
│ Score   │  │ Match   │ │ Match   │ │Match │ │
│ Visa    │  │ Card 4  │ │ Card 5  │ │Card 6│ │
│         │  └─────────┘ └─────────┘ └──────┘ │
└─────────┴────────────────────────────────────┘
```

### 7.3 Mentor Detail

```
┌──────────────────────────────────────┐
│  Navbar                              │
├──────────────────────────────────────┤
│  ← Back to Matches                   │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ [Avatar]  Name               │    │
│  │ Role @ Company    Score: 94% │    │
│  │ ☕ One-time chat             │    │
│  └──────────────────────────────┘    │
│                                      │
│  Why This Match                      │
│  ┌──────────────────────────────┐    │
│  │ ✦ Detailed rationale...     │    │
│  │ • Alignment point 1          │    │
│  │ • Alignment point 2          │    │
│  │ • Alignment point 3          │    │
│  └──────────────────────────────┘    │
│                                      │
│  Career Timeline                     │
│  ┌──────────────────────────────┐    │
│  │ 2024 ● PM @ ClimateCo       │    │
│  │ 2021 ● Analyst @ TechCo     │    │
│  │ 2019 ● MIT Sloan MBA        │    │
│  └──────────────────────────────┘    │
│                                      │
│  Conversation Starters              │
│  ┌──────────────────────────────┐    │
│  │ "What made you decide..."    │    │
│  │ "How did you navigate..."    │    │
│  │ "What skills from..."        │    │
│  └──────────────────────────────┘    │
│                                      │
│  [Start Outreach →]                  │
└──────────────────────────────────────┘
```

### 7.4 Tracking Dashboard

```
┌──────────────────────────────────────────────┐
│  Navbar                                      │
├──────────────────────────────────────────────┤
│  Your Connections                            │
│                                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │ 12 │ │  8 │ │  5 │ │ 94%│               │
│  │Mtch│ │Sent│ │Conv│ │Best│               │
│  └────┘ └────┘ └────┘ └────┘               │
│                                              │
│  Pipeline                                    │
│  ┌────────┬────────┬────────┬────────┬─────┐│
│  │ Saved  │  Sent  │Replied │  Met   │Ongo ││
│  │ (3)    │  (4)   │  (2)   │  (1)   │ (1) ││
│  │┌─────┐│┌─────┐ │┌─────┐ │┌─────┐ │     ││
│  ││Card │││Card │ ││Card │ ││Card │ │     ││
│  │└─────┘│└─────┘ │└─────┘ │└─────┘ │     ││
│  └────────┴────────┴────────┴────────┴─────┘│
└──────────────────────────────────────────────┘
```

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Layout Change |
|---|---|---|
| **Mobile** | < 640px (`sm`) | Single column, sidebar becomes drawer, stacked cards |
| **Tablet** | 640-1024px (`md`) | 2-column cards, collapsible sidebar |
| **Desktop** | > 1024px (`lg`) | Full layout with sidebar + 3-column cards |

---

## 9. Animation & Transitions

Keep minimal to maintain professionalism:

- **Page transitions**: None (instant navigation)
- **Card hover**: `transition-shadow duration-200` — subtle shadow lift
- **Button hover**: `transition-colors duration-150`
- **Filter panel**: `transition-all duration-300` — smooth open/close
- **Score counter**: Optional count-up animation on dashboard load
- **Loading states**: Skeleton shimmer (shadcn `Skeleton` component)

---

## 10. Accessibility

- All interactive elements keyboard-navigable
- Color contrast meets WCAG AA (4.5:1 minimum)
- Focus rings visible on all inputs and buttons
- Alt text on all images/avatars
- Semantic HTML: proper heading hierarchy, landmarks, labels
- Screen reader text for badges and score indicators
