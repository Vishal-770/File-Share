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
  Share2,
  Users,
  Folder,
  Zap,
  Eye,
  Lock,
  Star,
  ArrowRight,
  FileText,
  ImageIcon,
  Video,
  Music,
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

// Marquee Component
function Marquee({
  children,
  className = "",
  reverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`flex overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-4 whitespace-nowrap"
        animate={{
          x: reverse ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
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
  // const { theme } = useTheme();
  const [dotsPositions, setDotsPositions] = useState<
    { left: number; top: number; duration: number; delay: number }[]
  >([]);

  // Generate random positions on client side only to prevent hydration mismatch
  useEffect(() => {
    const positions = [...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setDotsPositions(positions);
  }, []);

  const features = [
    {
      icon: Folder,
      title: "File Management",
      description:
        "Organize, search, and manage your files with intelligent categorization and tagging.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Work together seamlessly with real-time editing, comments, and version control.",
    },
    {
      icon: Share2,
      title: "Public Sharing",
      description:
        "Share files publicly with customizable permissions and expiration dates.",
    },
    {
      icon: Lock,
      title: "Password Protection",
      description:
        "Secure your sensitive files with advanced encryption and password protection.",
    },
    {
      icon: Zap,
      title: "Real-Time Sync",
      description:
        "Keep your files synchronized across all devices with lightning-fast updates.",
    },
    {
      icon: Eye,
      title: "File Previews",
      description:
        "Preview documents, images, and videos without downloading them first.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager at TechCorp",
      avatar: "/professional-woman-diverse.png",
      quote:
        "File Drop transformed how our team collaborates. The real-time sync is incredible!",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Creative Director",
      avatar: "/creative-professional-man.png",
      quote:
        "Finally, a file sharing platform that doesn't compromise on security or speed.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Startup Founder",
      avatar: "/entrepreneur-woman.png",
      quote:
        "The public upload feature is a game-changer for collecting client assets.",
      rating: 5,
    },
  ];

  const partnerLogos = [
    "TechCorp",
    "InnovateLab",
    "DesignStudio",
    "StartupHub",
    "CreativeAgency",
    "DataFlow",
  ];

  return (
    <div className="w-full bg-background text-foreground flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {dotsPositions.map((dot, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${dot.left}%`,
                top: `${dot.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: dot.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: dot.delay,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 xl:gap-16 items-center relative z-10">
          {/* Left side - Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left px-4 lg:px-0"
          >
            <Badge variant="secondary" className="w-fit mx-auto lg:mx-0">
              🚀 The Future of File Sharing
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-tight">
              Drop. Share. Collaborate — Without Limits.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Powerful file management with public uploads, team collaboration,
              and real-time sync in one secure platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href={"/dashboard"}>
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Explore Features
              </Button>
              <Link href={"/public"}>
                <Button size="lg" variant="secondary" className="group">
                  <Upload className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Public Uploads
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right side - Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative px-4 lg:px-0"
          >
            <Card className="backdrop-blur-sm bg-card/50 border-border/50 shadow-2xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Recent Files</h3>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <Avatar
                          key={i}
                          className="w-6 h-6 border-2 border-background"
                        >
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
                          <AvatarFallback></AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        name: "Project Proposal.pdf",
                        size: "2.4 MB",
                        icon: FileText,
                      },
                      {
                        name: "Design Assets.zip",
                        size: "15.7 MB",
                        icon: ImageIcon,
                      },
                      { name: "Demo Video.mp4", size: "45.2 MB", icon: Video },
                      { name: "Soundtrack.mp3", size: "8.1 MB", icon: Music },
                    ].map((file, i) => (
                      <motion.div
                        key={file.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <file.icon className="h-4 w-4 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {file.size}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating icons */}
            {[
              { icon: Folder, position: "top-4 -right-4" },
              { icon: Users, position: "bottom-4 -left-4" },
              { icon: Upload, position: "-top-2 left-1/2" },
              { icon: Share2, position: "-bottom-2 right-1/3" },
            ].map(({ icon: Icon, position }, i) => (
              <motion.div
                key={i}
                className={`absolute ${position} w-12 h-12 bg-primary/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/20`}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                }}
              >
                <Icon className="h-5 w-5 text-primary" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Marquee */}
      <section className="py-12 bg-muted/50 overflow-hidden">
        <Marquee className="py-4">
          {[
            "🔒 End-to-End Encryption",
            "👥 Real-Time Collaboration",
            "📊 Live Analytics",
            "🌐 Public & Private Sharing",
            "⚡ Lightning-Fast Uploads",
            "📱 Mobile Optimized",
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50 hover:scale-105 transition-transform cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm font-medium whitespace-nowrap">
                {feature}
              </span>
            </motion.div>
          ))}
        </Marquee>
      </section>

      {/* Feature Grid */}
      <section className="py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Everything You Need to Share Files Securely
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From simple file sharing to complex team collaboration, File Drop
              has all the tools you need.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full backdrop-blur-sm bg-card/50 border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Panel */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-muted/30 to-primary/5 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Real-Time Analytics & Insights
            </h2>
            <p className="text-lg text-muted-foreground">
              Track your file sharing performance with detailed analytics
            </p>
          </motion.div>

          <Card className="max-w-4xl mx-auto backdrop-blur-sm bg-card/50 border-border/50">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Upload Activity
                    </h3>
                    <LineChart />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        <AnimatedCounter end={4521} />
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Files Shared Today
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        <AnimatedCounter end={1247} />
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Active Users
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Storage Usage</h3>
                      <p className="text-sm text-muted-foreground">
                        7.2 GB of 10 GB used
                      </p>
                    </div>
                    <DonutChart />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        Documents
                      </span>
                      <span>3.2 GB</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                        Images
                      </span>
                      <span>2.8 GB</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
                        Videos
                      </span>
                      <span>1.2 GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-semibold mb-2">
              Trusted by Teams Worldwide
            </h2>
            <p className="text-muted-foreground">
              Join thousands of companies using File Drop
            </p>
          </motion.div>

          <Marquee className="py-8">
            {partnerLogos.map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center h-16 px-8 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 hover:bg-background/80 transition-colors"
              >
                <span className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  {logo}
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              What Our Users Say
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Don&apos;t just take our word for it
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full backdrop-blur-sm bg-card/50 border-border/50">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <Avatar>
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
                        <p className="font-semibold">{testimonial.name}</p>
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
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary to-primary/70 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8 lg:space-y-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
              Ready to Drop Your Files the Smart Way?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Join thousands of teams who trust File Drop for secure, fast, and
              collaborative file sharing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" className="group">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Contact Sales
              </Button>
              <Button size="lg" variant="secondary" className="group">
                <Upload className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Public Uploads
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
