# LeadPulse CRM

A production-grade **CRM Lead Management Dashboard** built with Next.js, React, and Tailwind CSS. Dark-by-default, fully accessible, with real-time search, filtering, pagination, analytics charts, and full CRUD operations on an in-memory mock API.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## Features

- **Dashboard** — 7 metric cards (total, new, contacted, qualified, converted, lost, conversion rate) with trend indicators
- **Lead Table** — Sortable by date, paginated (8 per page), with debounced search and multi-filter (status + source)
- **Lead CRUD** — Create via modal or dedicated page, edit inline, delete with confirmation dialog
- **Lead Detail** — Full profile card, activity timeline, quick status changer
- **Analytics** — 4 interactive charts: Leads Over Time (area), Leads by Status (donut), Leads by Source (bar), Conversion Funnel
- **Dark / Light Mode** — Toggle with persistence, dark by default
- **Fully Responsive** — Mobile sidebar drawer, responsive grid layouts
- **Accessible** — WCAG 2.2 AA: skip-to-content, focus-visible rings, aria labels, keyboard navigation, screen-reader text
- **Mock API** — 23 seed leads, artificial 200-400ms delays, in-memory CRUD with automatic timeline events

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS v4, CSS custom properties |
| Forms | react-hook-form + zod |
| Data Fetching | SWR |
| Charts | Recharts (dynamic import, no SSR) |
| Icons | lucide-react |
| Variants | class-variance-authority (CVA) |
| Utilities | clsx, tailwind-merge |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Clone
git clone <repository-url>
cd machine-coding-task-yusuf-ansari

# Install dependencies
npm install

# Copy env
cp .env.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the dashboard.

### Build for Production

```bash
npm run build
npm start
```

## Authentication

LeadPulse uses a scratch JWT authentication system (no NextAuth, Clerk, or Auth0):

- **JWT Secret**: Generate with `openssl rand -base64 32` and set `JWT_SECRET` in `.env.local`
- **Cookie**: `crm_token` (httpOnly, sameSite=lax, secure in production, 7-day expiry)
- **Registration**: `/register` — password must be ≥8 chars with 1 uppercase, 1 number, 1 special char (`!@#$%^&*`)
- **Login**: `/login` — timing-safe verification, generic error message
- **Protected Routes**: `/dashboard/*` protected via Edge middleware (`src/middleware.ts`) and server-side layout checks
- **Per-User Ownership**: Leads filtered by `{ $or: [{ createdBy: userId }, { assignedTo: userId }] }`; creators can delete; reassign allowed via assigned user dropdown

### MongoDB Setup

```bash
# 1. Create a MongoDB Atlas cluster (or local MongoDB)
# 2. Copy .env.example -> .env.local and set MONGODB_URI
cp .env.example .env.local

# 3. Start the app
npm run dev
```

### Seeding

Run `npm run seed` (if available) or manually create users via `/api/auth/register` to begin using the CRM.

---

## Project Structure

```
src/
├── app/
│   ├── api/leads/           # Mock REST API (GET, POST, PUT, DELETE)
│   ├── dashboard/
│   │   ├── analytics/       # Analytics page with 4 charts
│   │   ├── leads/
│   │   │   ├── [id]/        # Lead detail page
│   │   │   └── new/         # New lead page
│   │   ├── layout.tsx       # Dashboard shell layout
│   │   └── page.tsx         # Main dashboard
│   ├── globals.css          # Design tokens + Tailwind v4 config
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Redirect to /dashboard
├── components/
│   ├── dashboard/           # MetricCard, MetricsGrid, charts
│   ├── layout/              # Sidebar, Topbar, DashboardShell
│   ├── leads/               # LeadTable, LeadForm, LeadModal, etc.
│   ├── shared/              # SkipToContent, EmptyState, ErrorState, etc.
│   └── ui/                  # Button, Badge, Card, Input, Select, etc.
├── hooks/                   # useLeads, useLead, useDebounce, useToast, etc.
├── lib/                     # utils, constants, validations, fonts, metadata, db
└── types/                   # TypeScript interfaces
```

## Design System

The app uses **CSS custom properties** for theming, mapped to Tailwind utilities via `@theme inline {}`. All tokens are defined in `src/app/globals.css`:

- **Colors**: Navy base, sky-blue accent (dark) / white base, slate accent (light)
- **Typography**: Inter font, 6 sizes from `--text-xs` to `--text-2xl`
- **Spacing & Radius**: Consistent tokens for padding, margins, border radius
- **Shadows**: 3 elevation levels
- **Transitions**: `--duration-fast` (150ms), `--duration-base` (200ms), `--duration-slow` (300ms)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | List leads (search, status, source, sortDir, page, pageSize) |
| POST | `/api/leads` | Create a lead |
| GET | `/api/leads/[id]` | Get lead by ID |
| PUT | `/api/leads/[id]` | Update lead |
| DELETE | `/api/leads/[id]` | Delete lead |

All responses include a simulated 200-400ms network delay.

## License

MIT
