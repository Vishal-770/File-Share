import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, LineChart, Lock, Send, Mail, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-background">
      {/* Hero Banner */}
      <div className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <Badge className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
            🚀 Empower Your File Sharing
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Secure & Insightful <span className="text-primary">File Sharing</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share files instantly, monitor user interactions, and gain insights into engagement with our intuitive, secure, and efficient file-sharing dashboard.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg">Get Started</Button>
            </Link>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <Send className="text-primary w-6 h-6" />
                <h3 className="text-xl font-semibold">One-Click File Sharing</h3>
              </div>
              <p className="text-muted-foreground">
                Share your files with a unique link. No logins or complex setups required. Just upload, copy, and send.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-primary w-6 h-6" />
                <h3 className="text-xl font-semibold">Bank-Grade Security</h3>
              </div>
              <p className="text-muted-foreground">
                All your data is encrypted at rest and in transit, ensuring maximum security for your files and your users.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <LineChart className="text-primary w-6 h-6" />
                <h3 className="text-xl font-semibold">Detailed Analytics</h3>
              </div>
              <p className="text-muted-foreground">
                See exactly when and how your files are accessed. Track engagement, downloads, and delivery success.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-primary w-6 h-6" />
                <h3 className="text-xl font-semibold">Team Collaboration</h3>
              </div>
              <p className="text-muted-foreground">
                Invite team members, assign roles, and collaborate on file sharing and monitoring in a unified dashboard.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-primary w-6 h-6" />
                <h3 className="text-xl font-semibold">Confirmation & Verification</h3>
              </div>
              <p className="text-muted-foreground">
                Recipients get professional email confirmations and a simple interface to download the files you send.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-primary w-6 h-6" />
                <h3 className="text-xl font-semibold">Smart Email Integration</h3>
              </div>
              <p className="text-muted-foreground">
                Send file links via built-in email integration. Easily confirm delivery and resend with one click.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16 text-center bg-background">
        <h2 className="text-3xl font-bold text-foreground">
          Ready to elevate your file sharing?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Sign up today and take full control of how you share, track, and secure your files.
        </p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button size="lg">Start Sharing Now</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
