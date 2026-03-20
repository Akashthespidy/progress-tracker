import Link from "next/link";
import {
  Target,
  BarChart3,
  Brain,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-600/3 blur-[150px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Zero<span className="text-indigo-400">Hero</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="btn btn-ghost text-sm"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="btn btn-primary text-sm"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
            <Sparkles className="w-3 h-3" />
            AI-Powered Self-Improvement System
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Go from{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Zero
            </span>{" "}
            to{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Hero
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Track daily tasks, crush long-term goals, and receive AI mentorship
            that adapts to your real progress. Not just a tracker —{" "}
            <span className="text-[var(--text-primary)] font-medium">
              your personal operating system for growth.
            </span>
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="btn btn-primary text-base px-8 py-3"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="btn btn-secondary text-base px-8 py-3"
            >
              See Features
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Tasks Tracked", value: "∞", icon: CheckCircle2 },
            { label: "AI Insights", value: "Real-time", icon: Brain },
            { label: "Goal Success", value: "Data-driven", icon: Target },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card p-6 text-center animate-slide-up"
            >
              <stat.icon className="w-5 h-5 text-indigo-400 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-[var(--text-secondary)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 max-w-6xl mx-auto px-6 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              level up
            </span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            A complete system designed for real progress, not just checkboxes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              icon: CheckCircle2,
              title: "Smart Task Management",
              description:
                "Track daily tasks with priorities, due dates, and automatic progress calculation. Link tasks to long-term goals.",
              color: "from-emerald-500 to-teal-500",
            },
            {
              icon: Target,
              title: "Goal Architecture",
              description:
                "Design long-term goals with deadlines and progress tracking. Every task moves you closer to your vision.",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: BarChart3,
              title: "Visual Analytics",
              description:
                "Daily completion charts, weekly progress, streak tracking, and completion heatmaps — see your growth in real-time.",
              color: "from-violet-500 to-purple-500",
            },
            {
              icon: Brain,
              title: "AI Mentor — Zero",
              description:
                "Your personal AI coach analyzes your real data and gives daily feedback, suggestions, and motivation. No generic advice.",
              color: "from-amber-500 to-orange-500",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="card card-interactive p-7 group"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="card p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-violet-600/10" />
          <div className="relative">
            <h2 className="text-3xl font-bold mb-4">
              Ready to transform your life?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
              Start tracking today. Your AI mentor is waiting.
            </p>
            <Link
              href="/sign-up"
              className="btn btn-primary text-base px-10 py-3"
            >
              Begin Now — It&apos;s Free
              <Zap className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-[var(--text-tertiary)] border-t border-[var(--border-primary)]">
        <p>
          Built with precision. Powered by AI.{" "}
          <span className="text-indigo-400">Zero</span>Hero © 2026
        </p>
      </footer>
    </div>
  );
}
