# ZeroHero — AI-Powered Progress Tracker

> Go from Zero to Hero. Track daily tasks, crush long-term goals, and receive AI mentorship that adapts to your real data.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-green)

---

## ✨ Features

### 📋 Smart Task Management
- Create, edit, and track daily tasks with priorities (low → urgent)
- Due dates, completion tracking, and automatic progress calculation
- Link tasks to long-term goals for structured progress

### 🎯 Goal Architecture
- Set long-term goals with descriptions, deadlines, and color coding
- Track progress with visual progress bars
- Status management (active, completed, paused, abandoned)
- Click into any goal for full detail view with task breakdown

### 📊 Visual Analytics
- Daily completion rate charts (area + bar)
- Weekly progress tracking with averages
- 90-day GitHub-style activity heatmap with hover tooltips
- Streak tracking (current & best)

### 🧠 AI Mentor — "Zero"
- **General Coaching**: Daily feedback, suggestions, motivation, goal reviews
- **Per-Goal Coaching**: Each goal has its own AI coach with full context
- Chat-style interface with conversation history
- Quick prompts: "What should I work on next?", "Am I on track?", etc.
- All coaching conversations saved and persistent

### ⌨️ Power User Features
- `⌘K` command palette for instant navigation
- Suspense loading skeletons on every page
- Responsive sidebar (collapsible)
- Custom sign-out with profile display

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + Shadcn/ui |
| Database | PostgreSQL (Neon serverless) |
| ORM | Drizzle ORM |
| Auth | Clerk |
| AI | OpenAI GPT-4o-mini |
| State | Jotai (client atoms) |
| Charts | Recharts |
| Validation | Zod |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)
- [Clerk account](https://clerk.com) (free tier works)
- [Neon database](https://neon.tech) (free tier works)
- [OpenAI API key](https://platform.openai.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zerohero.git
cd zerohero

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your credentials
# (Clerk keys, Neon database URL, OpenAI key)

# Push database schema
pnpm drizzle-kit push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up to get started.

---

## 📁 Project Structure

```
app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout (SEO, fonts, providers)
├── dashboard/
│   ├── page.tsx                # Dashboard (stats, tasks, chart, AI)
│   ├── tasks/page.tsx          # Task management
│   ├── goals/
│   │   ├── page.tsx            # Goals list
│   │   └── [id]/page.tsx       # Goal detail + AI Coach
│   ├── analytics/page.tsx      # Charts & heatmap
│   ├── mentor/page.tsx         # General AI mentor
│   └── settings/page.tsx       # Profile & preferences
components/
├── ai/                         # AI mentor + goal coach panels
├── charts/                     # Progress chart + heatmap
├── goals/                      # Goal cards, forms
├── tasks/                      # Task items, forms
├── layout/                     # Sidebar, page container
└── ui/                         # Shadcn + custom components
lib/
├── actions/                    # Server actions (tasks, goals, AI, analytics)
├── db/                         # Drizzle schema + connection
├── services/                   # User service (cached)
├── store/                      # Jotai atoms
├── utils.ts                    # Shared utilities
└── validations/                # Zod schemas
```

---

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm drizzle-kit push` | Push schema changes to database |
| `pnpm drizzle-kit studio` | Open Drizzle Studio (DB GUI) |

---

## 📄 License

MIT — feel free to use this project however you'd like.
