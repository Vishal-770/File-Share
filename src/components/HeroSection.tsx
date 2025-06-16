import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Folder,
  Lock,
  Mail,
  Eye,
  RefreshCw,
  Shield,
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
            🚀 Next-Gen File Sharing Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Secure, Smart & Simple{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              File Management
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Enterprise-grade file sharing with advanced security, real-time
            analytics, and seamless collaboration tools for teams and
            individuals.
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

      {/* Logo Cloud - You can add your trusted partners or tech stack here */}
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
                Secure Sharing
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to share files securely and track their usage
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Drag & Drop Upload</h3>
              </div>
              <p className="text-muted-foreground">
                Easily upload files of any type with our intuitive interface.
                Supports bulk uploads and automatic organization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Password Protection</h3>
              </div>
              <p className="text-muted-foreground">
                Add passwords to sensitive files. Only recipients with the
                password can access your shared content.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Folder className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">File Management</h3>
              </div>
              <p className="text-muted-foreground">
                Organize files in folders, add tags, and quickly find what you
                need with advanced search capabilities.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Email Integration</h3>
              </div>
              <p className="text-muted-foreground">
                Send files directly via email with customizable messages and
                delivery confirmations.
              </p>
            </div>

            {/* Feature 5 */}
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

            {/* Feature 6 */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Real-Time Updates</h3>
              </div>
              <p className="text-muted-foreground">
                Get instant notifications when files are accessed, downloaded,
                or shared further.
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
                Enterprise Security
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
                Military-Grade Protection for Your Files
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We use the same security standards as banks and government
                agencies to keep your data safe at all times.
              </p>
              <div className="space-y-4">
                {[
                  "End-to-end encryption (AES-256)",
                  "Two-factor authentication",
                  "Automatic virus scanning",
                  "Expiring download links",
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
                      security-dashboard
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-background p-4 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">
                          File Access Logs
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Updated 2s ago
                        </div>
                      </div>
                      <div className="mt-3 space-y-3">
                        {[
                          {
                            user: "john@company.com",
                            action: "Downloaded",
                            file: "Q4-Report.pdf",
                            time: "Just now",
                          },
                          {
                            user: "sarah@client.com",
                            action: "Viewed",
                            file: "Proposal.docx",
                            time: "2 mins ago",
                          },
                          {
                            user: "mike@partner.com",
                            action: "Shared",
                            file: "Contract.pdf",
                            time: "5 mins ago",
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
                        Security Status
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div>All systems secure</div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        {[
                          "Encryption",
                          "Firewall",
                          "2FA",
                          "Virus Scan",
                          "Backups",
                          "Audit Logs",
                        ].map((item) => (
                          <div
                            key={item}
                            className="bg-muted/50 p-2 rounded text-center"
                          >
                            {item} ✓
                          </div>
                        ))}
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
            Ready to transform your file sharing?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of professionals who trust our platform for secure,
            efficient file management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8">
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2 px-8">
              Schedule Demo
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
