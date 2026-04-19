# ZeroHero — AI-Powered Progress Tracker

> Go from Zero to Hero. Track daily tasks, crush long-term goals, and receive AI mentorship that adapts to your real data.

A modern **Next.js 16** + **React 19** application showcasing production-grade patterns for building full-stack SaaS applications.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-green)
![OpenAI API](https://img.shields.io/badge/OpenAI-GPT--4o-green)

---

This project demonstrates **modern Next.js best practices** for building full-stack applications:

✅ **Server-First Architecture** - React Server Components for optimal performance  
✅ **Data Mutations** - Server Actions as a replacement for traditional API routes  
✅ **Caching Strategies** - React's `cache()` for request deduplication  
✅ **Real-Time State** - Jotai for ephemeral client-state management  
✅ **Type Safety** - Zod validation + TypeScript throughout  
✅ **Authentication** - Clerk for production-grade auth  
✅ **Database ORM** - Drizzle with Neon PostgreSQL (serverless)  
✅ **AI Integration** - OpenAI API for contextual mentorship  
✅ **Performance** - Suspense boundaries, streaming, optimistic updates

---

## ✨ Features

### 📋 Smart Task Management

- **Create & Track**: Daily tasks with priorities (Low → Urgent)
- **Due Dates**: Set deadlines and track overdue items
- **Progress Tracking**: Auto-calculated completion rates
- **Goal Linking**: Associate tasks with long-term goals
- **Quick Toggle**: One-click task completion with streak tracking

### 🎯 Goal Architecture

- **Structured Goals**: Long-term objectives with descriptions and deadlines
- **Color Coding**: Visual goal categorization for better organization
- **Progress Bars**: Real-time progress visualization
- **Status Management**: Active, Completed, Paused, Abandoned states
- **Detail Views**: Click into goals to see full context, linked tasks, and coaching history

### 📊 Visual Analytics

- **Daily Charts**: Area + bar charts showing completion trends
- **Weekly Insights**: Average completion rates and weekly progress
- **GitHub-Style Heatmap**: 90-day activity visualization with tooltips
- **Streak Tracking**: Current streak + personal best
- **Real-Time Metrics**: Instant updates as you complete tasks

### 🧠 AI Mentorship (Zero)

- **General Coaching**: Daily feedback, suggestions, motivation, goal reviews
- **Per-Goal Coaching**: Individual AI coach for each goal with full context
- **Chat Interface**: Persistent conversation history for every goal
- **Quick Prompts**: Pre-built suggestions like "What should I work on?"
- **Data-Driven**: All coaching based on your real progress data
- **Saved History**: All conversations stored for future reference

### ⌨️ Power User Features

- **Command Palette**: Press `⌘K` (Mac) / `Ctrl+K` (Windows) for instant navigation
- **Loading States**: Suspense skeletons on every page for smooth UX
- **Responsive Design**: Collapsible sidebar adapts to all screen sizes
- **Profile Display**: Custom authentication UI with Clerk

---

## 🛠️ Tech Stack

| Layer          | Technology               | Purpose                                      |
| -------------- | ------------------------ | -------------------------------------------- |
| **Framework**  | Next.js 16 (App Router)  | React server components, streaming           |
| **Language**   | TypeScript 5             | Type safety across the stack                 |
| **Styling**    | Tailwind CSS 4           | Utility-first CSS with custom tokens         |
| **Components** | React 19                 | Modern React with server/client distinction  |
| **Database**   | Drizzle ORM + Neon       | Serverless PostgreSQL with type-safe queries |
| **Auth**       | Clerk                    | Production authentication & user management  |
| **State**      | Jotai                    | Minimal, composable state management         |
| **Validation** | Zod                      | Runtime type checking and parsing            |
| **Charts**     | Recharts                 | React charting library with animations       |
| **AI**         | OpenAI API (GPT-4o-mini) | Context-aware coaching & mentorship          |
| **Icons**      | Lucide React             | Beautiful, minimal icon library              |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (check with `node --version`)
- **pnpm** (install with `npm i -g pnpm`)
- **Clerk Account** (free tier: [clerk.com](https://clerk.com))
- **Neon Account** (free tier: [neon.tech](https://neon.tech))
- **OpenAI API Key** (free trial: [platform.openai.com](https://platform.openai.com))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/zerohero.git
   cd zerohero
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables** (see [Environment Variables](#-environment-variables) below)

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Run database migrations**

   ```bash
   pnpm exec drizzle-kit push
   ```

5. **Start development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Environment Variables

Create a `.env.local` file in the project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@project.neon.tech/dbname

# OpenAI API
OPENAI_API_KEY=sk-proj-...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting Your API Keys

**Clerk:**

1. Sign up at [clerk.com](https://clerk.com)
2. Create an application
3. Copy `Publishable Key` and `Secret Key` to `.env.local`
4. Setup webhook in Clerk dashboard for user sync (optional but recommended)

**Neon PostgreSQL:**

1. Sign up at [neon.tech](https://neon.tech)
2. Create a project and database
3. Copy connection string to `DATABASE_URL`

**OpenAI:**

1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Create API key in the dashboard
3. Copy to `OPENAI_API_KEY`

---

## 📁 Project Structure

```
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth routes group
│   ├── dashboard/                    # Protected routes
│   │   ├── tasks/
│   │   ├── goals/
│   │   ├── analytics/
│   │   ├── mentor/
│   │   └── settings/
│   ├── layout.tsx                    # Root layout with metadata
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Tailwind + design tokens
│   └── robots.ts & sitemap.ts        # SEO
│
├── components/                       # React Components
│   ├── ai/                           # AI mentor panels
│   ├── charts/                       # Recharts visualizations
│   ├── goals/                        # Goal components
│   ├── layout/                       # Sidebar, page container
│   ├── tasks/                        # Task components
│   ├── ui/                           # Reusable UI primitives
│   └── providers.tsx                 # Clerk + Jotai providers
│
├── lib/                              # Core logic
│   ├── actions/                      # Server Actions
│   │   ├── ai.ts                     # AI mentor logic
│   │   ├── analytics.ts              # Analytics aggregation
│   │   ├── goal-coaching.ts          # Per-goal AI coaching
│   │   ├── goals.ts                  # Goal CRUD
│   │   └── tasks.ts                  # Task CRUD
│   ├── db/
│   │   ├── index.ts                  # DB connection
│   │   └── schema.ts                 # Drizzle schema
│   ├── services/
│   │   └── user.ts                   # User service (cached)
│   ├── store/
│   │   └── atoms.ts                  # Jotai atoms
│   ├── validations/
│   │   └── index.ts                  # Zod schemas
│   └── utils.ts                      # Helper functions
│
├── middleware.ts                     # Clerk auth middleware
├── next.config.ts                    # Next.js config
├── tsconfig.json                     # TypeScript config
└── drizzle.config.ts                 # Drizzle Studio config
```

---

## 🏗️ Architecture Deep Dive

### Server Components vs Client Components

**Server Components** (default):

- Run only on the server
- Can access databases directly
- **Use for**: Data fetching, server actions, protected logic
- **Example**: `app/dashboard/tasks/page.tsx`

```tsx
// ✅ Server Component - can fetch data directly
async function TasksPage() {
  const tasks = await getTasks(); // Direct DB access
  return <TasksClient tasks={tasks} />;
}
```

**Client Components**:

- Run in the browser
- Can use hooks (useState, useEffect)
- Can interact with user (clicks, forms)
- **Use for**: Interactivity, state management, event handling
- **Example**: `components/tasks/tasks-client.tsx`

```tsx
// ✅ Client Component - handles interactivity
"use client";

export default function TasksClient({ tasks }) {
  const [completed, setCompleted] = useState(false);
  // ... UI logic
}
```

### Server Actions Pattern

**Server Actions** are type-safe functions that run on the server:

```tsx
// ✅ lib/actions/tasks.ts - Server Action
"use server";

export async function createTask(input: unknown) {
  const validated = createTaskSchema.parse(input);
  const user = await getOrCreateUser();

  await db.insert(tasks).values({
    ...validated,
    userId: user.id,
  });

  revalidatePath("/dashboard/tasks");
  return { success: true };
}
```

**Called from Client Components:**

```tsx
// ✅ components/tasks/create-task-form.tsx
"use client";

export function CreateTaskForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      await createTask(formData); // Type-safe server call!
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Caching Strategy

**React's `cache()`** deduplicates function calls within a single request:

```tsx
// ✅ lib/services/user.ts
import { cache } from "react";

export const getOrCreateUser = cache(async () => {
  // This function runs only ONCE per request, even if called 10 times!
  const clerkUser = await currentUser();
  // ... DB lookup
  return user;
});
```

**Revalidation** updates the cache when data changes:

```tsx
// ✅ lib/actions/tasks.ts
"use server";

export async function createTask(input) {
  // ... create task
  revalidatePath("/dashboard/tasks"); // Refresh the page automatically!
}
```

### Database Schema (Drizzle)

```tsx
// ✅ lib/db/schema.ts
import { serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
```

---

## 📊 How AI Mentorship Works

The AI coach is context-aware and data-driven:

1. **Gather Context**

   ```tsx
   const activity = await getRecentActivity(10); // Last 10 days
   const goals = await getGoals(); // All active goals
   ```

2. **Build Smart Prompt**

   ```
   System: "You are Zero, an AI productivity mentor..."
   User: "I've completed [tasks]. My streak is [N] days. My goals are [...]"
   ```

3. **Generate Response**

   ```tsx
   const response = await openai.chat.completions.create({
     model: "gpt-4o-mini",
     messages: [systemPrompt, userPrompt],
   });
   ```

4. **Save History**
   ```tsx
   await db.insert(aiLogs).values({
     userId, type, response, ...
   });
   ```

---

## 🧪 Testing & Development

### Run Linter

```bash
pnpm lint
```

### View Database (Drizzle Studio)

```bash
pnpm exec drizzle-kit studio
# Opens http://local.drizzle.studio
```

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to Vercel"
git push origin main

# 2. Go to https://vercel.com/new
# 3. Import the repository
# 4. Add environment variables (copy from .env.local)
# 5. Deploy!
```

### Manual Deployment Steps

1. **Build the application**

   ```bash
   pnpm build
   ```

2. **Run migrations on production database**

   ```bash
   ENVIRONMENT=production pnpm exec drizzle-kit push
   ```

3. **Start the production server**
   ```bash
   pnpm start
   ```

---

## 📖 Key Concepts for Learning

### 1. React Server Components

- [RFC: React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Next.js Docs: Server Components](https://nextjs.org/docs/getting-started/react-essentials#server-components)

### 2. Server Actions

- [Next.js Docs: Server Actions](https://nextjs.org/docs/guides/server-actions)
- Type-safe mutations without API routes

### 3. Suspense & Streaming

- [React Docs: Suspense](https://react.dev/reference/react/Suspense)
- [Next.js Docs: Streaming](https://nextjs.org/docs/app/building-your-application/rendering/server-components#streaming)

### 4. Drizzle ORM

- [Drizzle Docs](https://orm.drizzle.team/)
- Type-safe database queries

### 5. TypeScript Best Practices

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- Strict mode enabled for type safety

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" error after logging in

**Solution**: Check that Clerk environment variables are set correctly and the webhook is configured.

### Issue: Database connection timeout

**Solution**: Make sure `DATABASE_URL` is valid and the Neon project is active.

### Issue: AI Mentor not responding

**Solution**: Verify `OPENAI_API_KEY` is valid and your account has available credits.

### Issue: Changes not reflecting after edit

**Solution**: Server actions need `revalidatePath()` to refresh the cache. Check that it's called in the mutation function.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Style

- Follow ESLint rules: `pnpm lint`
- Use TypeScript types everywhere
- Add comments for complex logic
- Keep components focused and small

---

## 📝 Notes for Learning

### Best Files to Study

1. **`lib/services/user.ts`** - Learn about `cache()` deduplication
2. **`lib/actions/tasks.ts`** - Server Actions pattern
3. **`components/goals/goal-card.tsx`** - Client component with optimistic updates
4. **`app/dashboard/tasks/page.tsx`** - Suspense + Streaming pattern
5. **`lib/actions/ai.ts`** - AI integration with context building

### Key Patterns Used

- ✅ Server Components for data fetching
- ✅ Client Components for interactivity
- ✅ Server Actions for mutations
- ✅ Jotai for ephemeral state
- ✅ Zod for validation
- ✅ React's `cache()` for deduplication
- ✅ `revalidatePath()` for cache invalidation

---

## 📄 License

MIT — feel free to use this project however you'd like.

---

**Built with ❤️ using modern Next.js patterns**

## 📄 License

MIT — feel free to use this project however you'd like.
