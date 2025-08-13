import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - File Drop",
  description: "Sign in to your File Drop account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
