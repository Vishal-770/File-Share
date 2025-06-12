// app/sign-in/page.tsx (App Router) OR pages/signin.tsx (Pages Router)

"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left image section */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="w-full h-full bg-black/40 flex items-center justify-center text-white p-8">
          <h1 className="text-4xl font-bold">Welcome to FileDrop!</h1>
        </div>
      </div>

      {/* SignIn Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <SignIn />
        </div>
      </div>
    </main>
  );
}
