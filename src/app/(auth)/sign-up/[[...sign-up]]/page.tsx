// app/signup/page.tsx or pages/signup.tsx (based on your router)

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
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
        {/* Optional overlay or content */}
        <div className="w-full h-full bg-black/40 flex items-center justify-center text-white p-8">
          <h1 className="text-4xl font-bold">Welcome to FileDrop!</h1>
        </div>
      </div>

      {/* SignUp Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <SignUp />
        </div>
      </div>
    </main>
  );
}
