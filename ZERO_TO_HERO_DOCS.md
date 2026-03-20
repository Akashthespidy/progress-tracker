# Zero to Hero — Progress Tracker System

A production-grade self-improvement operating system built with Next.js App Router, Clerk, Neon PostgreSQL, Jotai, and OpenAI.

---

## 1. Folder Structure
The application follows a clean architecture pattern utilizing the Next.js App Router:

```text
progress-tracker/
├── app/                      # Next.js App Router (pages and layouts)
│   ├── dashboard/            # Protected routes (Tasks, Goals, Analytics, AI)
│   ├── sign-in/ & sign-up/   # Clerk Auth pages
│   ├── globals.css           # Tailwind + Custom Design Tokens
│   └── page.tsx              # Beautiful Landing Page
├── components/               # React Components
│   ├── ai/                   # AI Mentor Panel
│   ├── charts/               # Recharts components & Heatmaps
│   ├── goals/                # Goal cards & creation forms
│   ├── layout/               # Sidebar & Page Containers
│   ├── tasks/                # Task items & forms
│   ├── ui/                   # Reusable UI (Modals, Progress bars, Stat cards)
│   └── providers.tsx         # Global Providers (Clerk, Jotai)
├── lib/                      # Core Logic & Services
│   ├── actions/              # Server Actions (Tasks, Goals, Analytics, AI)
│   ├── db/                   # Neon DB Connection & Drizzle Schema
│   ├── services/             # Background services (User sync)
│   ├── store/                # Jotai Atoms for State Management
│   ├── validations/          # Zod validation schemas
│   └── utils.ts              # Helper functions (colors, dates, clsx)
├── middleware.ts             # Clerk Edge Middleware
└── drizzle.config.ts         # Drizzle Studio Configuration
```

---

## 2. Database Schema (Drizzle)
We use the `drizzle-orm` for strict type-safety. The schema includes 5 main tables with proper cascading constraints:
- **`users`**: Synced with Clerk, tracks current/longest streak and last active date.
- **`goals`**: Long-term objectives with colors, statuses, and deadlines.
- **`tasks`**: Daily actionable items, optionally linked to goals via `goalId`.
- **`progress_logs`**: Upserted daily to record completion rates, tasks completed, and total tasks. Powers the analytics heatmap.
- **`ai_logs`**: Stores the interactions with "Zero" the AI mentor for the history dashboard.

Run `pnpm drizzle-kit push` to migrate this schema to your Neon DB.

---

## 3. Clerk Setup
We use `@clerk/nextjs` for robust authentication.
- **Middleware**: Blocks unauthenticated access to `/dashboard/*` but allows `/` and `/sign-in`.
- **User Sync**: A `getOrCreateUser` function runs on server actions to silently sync Clerk users into our `users` table upon their first interaction.
- **Providers**: Configured in `<Providers>` using Clerk's `dark` theme heavily customized to match our deep indigo/violet color palette.

---

## 4. Neon Connection
Serverless connection initialized in `lib/db/index.ts`:
```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```
This is fully edge-compatible, keeping our server actions extremely fast without connection pooling limits.

---

## 5. API / Server Actions
All data mutation and fetching uses Next.js Server Actions to avoid building separate API routes:
- **`actions/tasks.ts`**: Handles CRUD, toggling completions, and updating the user's consecutive day streak efficiently.
- **`actions/goals.ts`**: Manages goal lifecycle. When a goal is deleted, associated tasks are cleanly unlinked (set to `null`) instead of deleted.
- **`actions/analytics.ts`**: Aggregates `progress_logs` into formats required by Recharts (Daily, Weekly Stats, and Heatmap formats).
- **`actions/ai.ts`**: Generates complex dynamic prompts using real data metrics to send to OpenAI.

---

## 6. UI Components
Designed to look like Linear or Vercel:
- **Glassmorphism**: Leverages Tailwind backdrop blur and subtle box-shadow glows.
- **Interactive**: Sidebar handles collapsible states visually, modals use pure CSS animations (`scale-in`).
- **Charts**: Customized `recharts` implementations for Area and Bar charts utilizing SVG linear gradients instead of flat colors.

---

## 7. State Management (Jotai)
Jotai is used for client-side ephemeral state. 
Located in `lib/store/atoms.ts`, we track:
- Sidebar state (`sidebarCollapsedAtom`)
- Task and Goal filters (`taskFilterAtom`, `goalStatusFilterAtom`)
- Modals (`createTaskModalAtom`, `createGoalModalAtom`)
This cleanly separates server-state (handled by Next.js cache and React Server Components) from UI interaction states.

---

## 8. AI Integration (OpenAI)
The **"Zero" AI Mentor** is not a generic chatbot. 
When queried, the server action `getAIMentorResponse` fetches:
1. The user's progress logs over the last 10 days.
2. Formats all tasks (completed vs pending).
3. Injects their current/longest streak.
4. Generates a strict, structured system prompt for `gpt-4o-mini`.
The response is returned and immediately saved into `ai_logs` to build a historical track record of mentorship.

---

## 9. Deployment Steps (Vercel)

1. **Commit to GitHub**: Ensure all code is pushed to a repository.
2. **Import to Vercel**: Create a new project in your Vercel dashboard and import the repository.
3. **Set Environment Variables**: In your Vercel project settings, add the following variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (From Clerk Dashboard)
   - `CLERK_SECRET_KEY` (From Clerk Dashboard)
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
   - `DATABASE_URL` (From Neon Dashboard)
   - `OPENAI_API_KEY` (From OpenAI Platform)
4. **Deploy**: Vercel will automatically detect the Next.js framework, run `pnpm build`, and successfully deploy the project.
5. **Set up Webhooks (Optional but Recommended)**: Setup a Clerk Webhook to ping your database whenever a user signs up instead of relying wholly on `getOrCreateUser` falling back.
