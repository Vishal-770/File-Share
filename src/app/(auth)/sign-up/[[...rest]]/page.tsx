import { SignUp } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, ArrowLeft, Zap, Share2, Lock } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Features & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-2xl font-bold"
            >
              <FileText className="h-8 w-8" />
              <span>File Drop</span>
            </Link>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight">
                Start Your File Sharing
                <br />
                Journey Today
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Join our secure platform for advanced file management, team collaboration,
                and seamless sharing experiences.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span className="font-semibold">End-to-End Security</span>
                </div>
                <p className="text-sm text-primary-foreground/70">
                  Your files are encrypted and protected with industry-standard
                  security
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Share2 className="h-5 w-5" />
                  <span className="font-semibold">Smart Sharing</span>
                </div>
                <p className="text-sm text-primary-foreground/70">
                  Share files with custom permissions and expiration dates
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">Team Workspaces</span>
                </div>
                <p className="text-sm text-primary-foreground/70">
                  Create dedicated spaces for your team projects
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">Lightning Fast</span>
                </div>
                <p className="text-sm text-primary-foreground/70">
                  Upload and access your files in seconds, not minutes
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-primary-foreground/20">
              <div className="text-center">
                <div className="text-2xl font-bold">50GB</div>
                <div className="text-sm text-primary-foreground/70">Free Storage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-primary-foreground/70">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-primary-foreground/70">Support</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-primary-foreground/60">
            © 2025 File Drop. Trusted by professionals worldwide.
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-primary"
          >
            <FileText className="h-6 w-6" />
            <span>File Drop</span>
          </Link>
          <div className="flex items-center space-x-2">
            <ModeToggle />
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Back to Home & Toggle for Desktop */}
            <div className="hidden lg:flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to home</span>
              </Link>
              <ModeToggle />
            </div>

            {/* Welcome Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                Create account
              </h2>
              <p className="text-muted-foreground">
                Join File Drop and start sharing securely
              </p>
            </div>

            {/* Sign Up Form */}
            <Card className="border shadow-lg">
              <CardContent className="p-6">
                <SignUp
                  appearance={{
                    variables: {
                      colorPrimary: "hsl(var(--primary))",
                      colorText: "hsl(var(--foreground))",
                      colorTextSecondary: "hsl(var(--muted-foreground))",
                      colorBackground: "hsl(var(--background))",
                      colorInputText: "hsl(var(--foreground))",
                      colorInputBackground: "hsl(var(--background))",
                      borderRadius: "0.5rem",
                    },
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-0 w-full bg-transparent",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton:
                        "border border-input hover:bg-accent hover:text-accent-foreground bg-background text-foreground",
                      formButtonPrimary:
                        "bg-primary hover:bg-primary/90 text-primary-foreground",
                      footerActionLink: "text-primary hover:text-primary/90",
                      formFieldInput:
                        "border-input bg-background text-foreground",
                      formFieldLabel: "text-foreground",
                      dividerLine: "bg-border",
                      dividerText: "text-muted-foreground",
                      identityPreviewText: "text-foreground",
                      identityPreviewEditButton:
                        "text-primary hover:text-primary/90",
                      formFieldErrorText: "text-destructive",
                      alertClerkError: "text-destructive",
                      formFieldSuccessText:
                        "text-green-600 dark:text-green-400",
                      formFieldInputShowPasswordButton:
                        "text-muted-foreground hover:text-foreground",
                      formFieldHintText: "text-muted-foreground",
                      formHeaderTitle: "text-foreground",
                      formHeaderSubtitle: "text-muted-foreground",
                    },
                  }}
                />
              </CardContent>
            </Card>

            {/* Sign In Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                href="/sign-in"
                className="font-medium text-primary hover:text-primary/90 transition-colors"
              >
                Sign in
              </Link>
            </div>

            {/* Mobile Back to Home */}
            <div className="lg:hidden text-center">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
