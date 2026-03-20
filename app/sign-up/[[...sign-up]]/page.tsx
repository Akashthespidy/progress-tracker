import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
      </div>
      <div className="relative z-10">
        <SignUp
          routing="hash"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
