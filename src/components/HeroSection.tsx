import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Folder,
  Eye,
  RefreshCw,
  Users,
  Upload,
  Key,
  Share2,
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
            🚀 Secure File Sharing Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Share, Manage & Collaborate on Files{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Without Compromise
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful file management with team collaboration, password
            protection, and public sharing options in one secure platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                <Folder className="w-5 h-5" />
                My Files
              </Button>
            </Link>
            <Link href="/dashboard/teams">
              <Button variant="outline" size="lg" className="gap-2">
                <Users className="w-5 h-5" />
                Team Collaboration
              </Button>
            </Link>
            <Link href="/public">
              <Button variant="secondary" size="lg" className="gap-2">
                <Upload className="w-5 h-5" />
                Public Upload
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                All Your Needs
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Whether you&#39;re working alone, with a team, or sharing publicly
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* File Management */}
            <Link href="/dashboard">
              <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Folder className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">File Management</h3>
                </div>
                <p className="text-muted-foreground">
                  Upload, organize, rename, and delete files with full control
                  over your personal storage.
                </p>
              </div>
            </Link>

            {/* Team Collaboration */}
            <Link href="/dashboard/teams">
              <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Team Collaboration</h3>
                </div>
                <p className="text-muted-foreground">
                  Create or join teams, share files with members, and manage
                  access permissions.
                </p>
              </div>
            </Link>

            {/* Public Sharing */}
            <Link href="/public">
              <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Public Sharing</h3>
                </div>
                <p className="text-muted-foreground">
                  Share files instantly without login. Generate QR codes for
                  easy access on any device.
                </p>
              </div>
            </Link>

            {/* Password Protection */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Password Protection</h3>
              </div>
              <p className="text-muted-foreground">
                Secure sensitive files with password protection and access
                controls.
              </p>
            </div>

            {/* Real-Time Updates */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Real-Time Sync</h3>
              </div>
              <p className="text-muted-foreground">
                Changes sync instantly across all devices and team members.
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
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
            Ready to transform your file sharing?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get started today with our secure platform for personal, team, and
            public file sharing.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 px-8">
                <Folder className="w-5 h-5" />
                My Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/teams">
              <Button variant="outline" size="lg" className="gap-2 px-8">
                <Users className="w-5 h-5" />
                Create Team
              </Button>
            </Link>
            <Link href="/public">
              <Button variant="secondary" size="lg" className="gap-2 px-8">
                <Upload className="w-5 h-5" />
                Public Upload
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
