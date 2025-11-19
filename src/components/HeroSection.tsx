"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Upload,
  Users,
  Star,
  ArrowRight,
  FileText,
  Video,
  Shield,
  Cloud,
  Download,
  Globe2,
  UserPlus,
  Settings,
  BarChart3,
  Archive,
  Mail,
  QrCode,
  Smartphone,
  Search,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

// Animated Counter Component
function AnimatedCounter({
  end,
  duration = 2000,
}: {
  end: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

// Chart Components
function LineChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by using consistent values until mounted
  const isDark = mounted ? theme === "dark" : false;

  const points = [
    { x: 0, y: 80 },
    { x: 20, y: 60 },
    { x: 40, y: 90 },
    { x: 60, y: 70 },
    { x: 80, y: 95 },
    { x: 100, y: 85 },
  ];

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="h-32 w-full relative">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              stopColor={isDark ? "white" : "hsl(var(--primary))"}
            />
            <stop
              offset="100%"
              stopColor={
                isDark
                  ? "rgba(255, 255, 255, 0.3)"
                  : "hsl(var(--primary) / 0.3)"
              }
            />
          </linearGradient>
        </defs>
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

function DonutChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by using consistent values until mounted
  const isDark = mounted ? theme === "dark" : false;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference * 0.7} ${circumference}`;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={isDark ? "rgba(255, 255, 255, 0.2)" : "hsl(var(--muted))"}
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={isDark ? "white" : "hsl(var(--primary))"}
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * 0.3 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold">70%</span>
      </div>
    </div>
  );
}

export default function FileDropLanding() {
  // Generate random positions on client side only to prevent hydration mismatch

  const mainFeatures = [
    {
      icon: Upload,
      title: "Drag & Drop Upload",
      description:
        "Upload multiple files instantly with our intuitive drag & drop interface. Support for all file types with real-time progress tracking.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Create teams, add members, and collaborate in real-time. Share files within teams with granular permission controls.",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: Globe2,
      title: "Public Sharing",
      description:
        "Share files publicly with password protection, expiration dates, and QR codes for easy access on any device.",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "End-to-end encryption, password protection, and secure file storage with Clerk authentication integration.",
      color: "bg-primary/10 text-primary",
    },
  ];

  const advancedFeatures = [
    {
      icon: Archive,
      title: "Bulk Operations",
      description:
        "Select multiple files and perform bulk downloads as ZIP archives or bulk deletions with confirmation dialogs.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track storage usage, file type distribution, and team activity with beautiful charts and insights.",
    },
    {
      icon: QrCode,
      title: "QR Code Sharing",
      description:
        "Generate QR codes for instant file sharing. Perfect for mobile access and cross-device transfers.",
    },
    {
      icon: Search,
      title: "Smart Search",
      description:
        "Find files instantly with powerful search filters by name, type, date, and team across your entire library.",
    },
    {
      icon: Mail,
      title: "Email Integration",
      description:
        "Send files directly via email with custom templates. Recipients get secure download links automatically.",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description:
        "Fully responsive design works perfectly on desktop, tablet, and mobile with touch-friendly interactions.",
    },
  ];

  const teamFeatures = [
    {
      icon: UserPlus,
      title: "Public Team Discovery",
      description:
        "Browse and join public teams or keep your team private. Search through hundreds of open collaboration spaces.",
    },
    {
      icon: Settings,
      title: "Granular Permissions",
      description:
        "Team leaders control who can upload, download, and delete files. Individual file ownership ensures security.",
    },
    {
      icon: Cloud,
      title: "Real-time Sync",
      description:
        "All team members see file updates instantly. No refresh needed - everything syncs in real-time across devices.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager at TechCorp",
      avatar: "/professional-woman-diverse.png",
      quote:
        "File Drop transformed how our remote team collaborates. The real-time sync and team features are incredible!",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Creative Director",
      avatar: "/creative-professional-man.png",
      quote:
        "Finally, a file sharing platform that doesn't compromise on security or speed. The bulk operations save hours.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Startup Founder",
      avatar: "/entrepreneur-woman.png",
      quote:
        "The public upload feature is a game-changer for collecting client assets. QR codes make mobile sharing effortless.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "10,000+", label: "Files Shared Daily" },
    { number: "500+", label: "Active Teams" },
    { number: "99.9%", label: "Uptime" },
    { number: "256-bit", label: "Encryption" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="w-full bg-background text-foreground flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Animated background particles */}

        {/* Glassmorphism background blobs */}

        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 xl:gap-16 items-center relative z-10">
          {/* Left side - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-4">
                🚀 The Future of File Sharing
              </Badge>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-7xl font-extrabold tracking-tight text-primary leading-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Secure File
              <br />
              <span className="text-foreground">Collaboration</span>
              <br />
              <span className="text-muted-foreground text-4xl md:text-5xl">
                Made Simple
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Upload, share, and collaborate on files with advanced security,
              real-time team collaboration, and powerful analytics. Join
              thousands of teams who trust File Drop for their file management
              needs.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/dashboard">
                <Button size="lg" className="group px-8 py-6 text-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/public">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-6 text-lg font-semibold gap-2"
                >
                  <Upload className="h-5 w-5" />
                  Try Public Upload
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-primary">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Card className="bg-background/80 backdrop-blur-md border-border/50 shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-foreground">
                      Recent Activity
                    </h3>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                        >
                          <Avatar className="w-8 h-8 border-2 border-background">
                            <AvatarImage
                              src={
                                i === 1
                                  ? "/professional-woman-diverse.png"
                                  : i === 2
                                  ? "/creative-professional-man.png"
                                  : "/entrepreneur-woman.png"
                              }
                              alt={`User ${i}`}
                            />
                            <AvatarFallback className="text-xs">
                              U{i}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        name: "Project Proposal.pdf",
                        size: "2.4 MB",
                        icon: FileText,
                        time: "2m ago",
                      },
                      {
                        name: "Design Assets.zip",
                        size: "15.7 MB",
                        icon: Archive,
                        time: "5m ago",
                      },
                      {
                        name: "Demo Video.mp4",
                        size: "45.2 MB",
                        icon: Video,
                        time: "10m ago",
                      },
                      {
                        name: "Presentation.pptx",
                        size: "8.1 MB",
                        icon: FileText,
                        time: "15m ago",
                      },
                    ].map((file, i) => (
                      <motion.div
                        key={file.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
                      >
                        <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                          <file.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {file.size} • {file.time}
                          </p>
                        </div>
                        <Download className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Storage used
                      </span>
                      <span className="font-medium text-foreground">
                        7.2 GB of 10 GB
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "72%" }}
                        transition={{ delay: 1.5, duration: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating feature icons */}
            {[
              { icon: Shield, position: "top-4 -right-4", delay: 1.8 },
              { icon: Users, position: "bottom-4 -left-4", delay: 2.0 },
              { icon: Globe2, position: "-top-2 left-1/2", delay: 2.2 },
              { icon: BarChart3, position: "-bottom-2 right-1/3", delay: 2.4 },
            ].map(({ icon: Icon, position, delay }, i) => (
              <motion.div
                key={i}
                className={`absolute ${position} w-14 h-14 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-border/50 shadow-lg`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
              >
                <Icon className="h-6 w-6 text-primary" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-6">
              Everything You Need for
              <br />
              <span className="text-foreground">Secure File Management</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From simple uploads to complex team workflows, File Drop provides
              all the tools you need for modern file collaboration.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {mainFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-background/80 backdrop-blur-md border-border/50 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 space-y-6">
                    <div
                      className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-6">
              Advanced Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful tools that scale with your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <Card className="h-full bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80 transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Collaboration Showcase */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 ">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                Built for Teams
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Create private teams or join public communities. Control
                permissions, track activity, and collaborate seamlessly across
                any project.
              </p>

              <div className="space-y-6">
                {teamFeatures.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4">
                <Link href="/dashboard/teams">
                  <Button size="lg" className="group">
                    <Users className="mr-2 h-5 w-5" />
                    Create Team
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/dashboard/public-teams">
                  <Button size="lg" variant="outline">
                    <Globe2 className="mr-2 h-5 w-5" />
                    Browse Public Teams
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="bg-background/80 backdrop-blur-md border-border/50 shadow-2xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Team: Design Squad
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        <Globe2 className="w-3 h-3 mr-1" />
                        Public
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/professional-woman-diverse.png" />
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Sarah Chen uploaded
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Design System v2.0
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          2m ago
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/creative-professional-man.png" />
                          <AvatarFallback>MJ</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Marcus joined the team
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Welcome to Design Squad!
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          5m ago
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/entrepreneur-woman.png" />
                          <AvatarFallback>ER</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Elena shared via email
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Client Presentations.zip
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          10m ago
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          24 members • 156 files
                        </span>
                        <Button size="sm" variant="secondary">
                          <UserPlus className="w-4 h-4 mr-1" />
                          Join Team
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating team icons */}
              <motion.div
                className="absolute -top-4 -right-4 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-border/50 shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Settings className="h-5 w-5 text-primary" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Analytics Showcase */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-6">
              Real-Time Analytics & Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Track your file sharing performance with detailed analytics and
              beautiful visualizations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <Card className="bg-background/80 backdrop-blur-md border-border/50 shadow-2xl">
              <CardContent className="p-12">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-6">
                        Upload Activity
                      </h3>
                      <LineChart />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-6 bg-secondary/20 rounded-xl">
                        <p className="text-3xl font-bold text-primary mb-2">
                          <AnimatedCounter end={4521} />
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Files Shared Today
                        </p>
                      </div>
                      <div className="text-center p-6 bg-secondary/20 rounded-xl">
                        <p className="text-3xl font-bold text-primary mb-2">
                          <AnimatedCounter end={1247} />
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Active Users
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">
                          Storage Usage
                        </h3>
                        <p className="text-muted-foreground">
                          7.2 GB of 10 GB used
                        </p>
                      </div>
                      <DonutChart />
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          type: "Documents",
                          size: "3.2 GB",
                          color: "bg-primary",
                        },
                        {
                          type: "Images",
                          size: "2.8 GB",
                          color: "bg-secondary",
                        },
                        { type: "Videos", size: "1.2 GB", color: "bg-accent" },
                        { type: "Archives", size: "0.8 GB", color: "bg-muted" },
                      ].map((item, i) => (
                        <motion.div
                          key={item.type}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 ${item.color} rounded-full`}
                            ></div>
                            <span className="text-foreground">{item.type}</span>
                          </span>
                          <span className="text-muted-foreground">
                            {item.size}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pt-6">
                      <Link href="/dashboard/profile">
                        <Button variant="outline" className="w-full">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Full Analytics
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 ">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-6">
              Trusted by Teams Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their file
              sharing workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-background/80 backdrop-blur-md border-border/50 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="h-5 w-5 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground italic text-lg leading-relaxed">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-primary/5"
            animate={{
              background: [
                "linear-gradient(45deg, hsl(var(--primary) / 0.05), hsl(var(--secondary) / 0.05))",
                "linear-gradient(45deg, hsl(var(--secondary) / 0.05), hsl(var(--accent) / 0.05))",
                "linear-gradient(45deg, hsl(var(--accent) / 0.05), hsl(var(--primary) / 0.05))",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <div className="space-y-6">
              <h2 className="text-6xl md:text-7xl font-extrabold tracking-tight text-primary leading-none">
                Ready to Transform
                <br />
                <span className="text-foreground">Your File Workflow?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Join thousands of teams who trust File Drop for secure, fast,
                and collaborative file sharing. Start your free account today
                and experience the future of file management.
              </p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="group px-12 py-6 text-lg font-semibold"
                >
                  Start Free Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/public">
                <Button
                  size="lg"
                  variant="outline"
                  className="group px-12 py-6 text-lg"
                >
                  <Upload className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Try Public Upload
                </Button>
              </Link>
              <Link href="/dashboard/public-teams">
                <Button
                  size="lg"
                  variant="secondary"
                  className="group px-12 py-6 text-lg"
                >
                  <Globe2 className="mr-2 h-5 w-5" />
                  Browse Teams
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
