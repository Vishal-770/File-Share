import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Folder,
  Lock,
  Eye,
  RefreshCw,
  Shield,
  Users,
  GitBranch,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-background">
      {/* Hero Banner */}
      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <Badge
            variant="outline"
            className="px-4 py-1.5 rounded-full border-primary/30 bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20"
          >
            🚀 Team File Sharing Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Collaborate Securely with{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Your Team
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Enterprise-grade file sharing with team collaboration, advanced
            security, and real-time updates for seamless teamwork.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Get Started - It&#39;s Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Logo Cloud */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-sm uppercase tracking-wider text-muted-foreground mb-6">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 opacity-70">
          {["Microsoft", "Google", "Amazon", "Stripe", "Slack", "Zoom"].map(
            (company) => (
              <div
                key={company}
                className="text-lg font-medium text-foreground/80"
              >
                {company}
              </div>
            )
          )}
        </div>
      </div>

      {/* Features */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Teams
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything your team needs for secure file collaboration
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Team Workspaces */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Team Workspaces</h3>
              </div>
              <p className="text-muted-foreground">
                Create shared spaces for your team with controlled access and
                centralized file management.
              </p>
            </div>

            {/* File Versioning */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <GitBranch className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">File Versioning</h3>
              </div>
              <p className="text-muted-foreground">
                Track changes and revert to previous versions with our built-in
                version history.
              </p>
            </div>

            {/* Secure Sharing */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Secure Sharing</h3>
              </div>
              <p className="text-muted-foreground">
                Control access with passwords, expiration dates, and download
                limits for each file.
              </p>
            </div>

            {/* File Management */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Folder className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">File Management</h3>
              </div>
              <p className="text-muted-foreground">
                Organize team files with folders, tags, and advanced search
                capabilities.
              </p>
            </div>

            {/* Real-Time Updates */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Real-Time Updates</h3>
              </div>
              <p className="text-muted-foreground">
                Get instant notifications when team members access or modify
                shared files.
              </p>
            </div>

            {/* File Previews */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">File Previews</h3>
              </div>
              <p className="text-muted-foreground">
                Preview documents, images, and videos without downloading.
                Supports 100+ file types.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <Badge
                variant="outline"
                className="px-3 py-1 rounded-full border-primary/30 bg-primary/10 text-primary font-medium text-sm mb-4"
              >
                Team Security
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
                Secure Collaboration for Your Team
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Bank-level security measures to protect your team&#39;s files
                and communications.
              </p>
              <div className="space-y-4">
                {[
                  "End-to-end encryption (AES-256)",
                  "Role-based access control",
                  "Two-factor authentication",
                  "Activity audit logs",
                  "IP address restrictions",
                  "SOC 2 Type II compliant",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 mt-10 lg:mt-0">
              <div className="bg-muted/50 border rounded-xl p-8 shadow-sm">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                      <div className="w-3 h-3 rounded-full bg-primary/10"></div>
                    </div>
                    <div className="text-sm font-medium text-primary">
                      team-dashboard
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-background p-4 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">
                          Recent Team Activity
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Updated just now
                        </div>
                      </div>
                      <div className="mt-3 space-y-3">
                        {[
                          {
                            user: "alex@team.com",
                            action: "Uploaded",
                            file: "Project-Brief.pdf",
                            time: "2 mins ago",
                          },
                          {
                            user: "sam@team.com",
                            action: "Edited",
                            file: "Design-Specs.docx",
                            time: "15 mins ago",
                          },
                          {
                            user: "jane@team.com",
                            action: "Shared",
                            file: "Budget.xlsx",
                            time: "1 hour ago",
                          },
                        ].map((log, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 text-sm"
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${i === 0 ? "bg-green-500" : "bg-blue-500"}`}
                            ></div>
                            <div className="flex-1 truncate">
                              <span className="font-medium">{log.user}</span>{" "}
                              {log.action}{" "}
                              <span className="text-primary">{log.file}</span>
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {log.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-background p-4 rounded-lg border">
                      <div className="text-sm font-medium mb-2">
                        Team Storage
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>15.2 GB of 25 GB used</span>
                        <span>65%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
            Ready to upgrade your team&#39;s file sharing?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get started with FileDrop today and experience seamless team
            collaboration with enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 px-8">
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2 px-8">
              Contact Sales
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
