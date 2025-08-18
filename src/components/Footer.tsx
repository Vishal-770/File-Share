"use client";

import { FileText, Github, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Public Uploads", href: "/public" },
      { name: "Pricing", href: "/dashboard/Pricing" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api-docs" },
      { name: "Status", href: "/status" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/filedrop", icon: Twitter },
    { name: "GitHub", href: "https://github.com/filedrop", icon: Github },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/filedrop",
      icon: Linkedin,
    },
    { name: "Email", href: "mailto:contact@filedrop.com", icon: Mail },
  ];

  return (
    <footer
      ref={footerRef}
      className={`bg-background border-t border-border/50 backdrop-blur-sm transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div
            className={`col-span-2 space-y-6 transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <Link href="/" className="group flex items-center space-x-3">
              <div className="relative">
                <FileText className="h-9 w-9 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                File Drop
              </span>
            </Link>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm font-medium">
              Secure file sharing made simple. Upload, share, and collaborate
              with advanced security features and team collaboration tools.
            </p>

            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="group relative p-3 rounded-full bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <social.icon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 rounded-full border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(
            ([category, links], categoryIndex) => (
              <div
                key={category}
                className={`space-y-5 transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${(categoryIndex + 2) * 150}ms` }}
              >
                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest relative group hover:text-foreground/70 cursor-pointer" >
                  {category}
                  {/* <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" /> */}
                </h3>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group relative text-sm text-muted-foreground hover:text-primary transition-all duration-300 inline-block"
                        style={{ animationDelay: `${linkIndex * 50}ms` }}
                      >
                        <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary/60 transition-all duration-300 group-hover:w-full" />
                        <div className="absolute inset-0 bg-primary/5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        <div
          className={`mt-16 pt-8 border-t border-border/60 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-sm text-muted-foreground font-medium">
            © {currentYear} File Drop. All rights reserved.
          </p>
          <div className="flex items-center space-x-8">
            {[
              { name: "Privacy", href: "/privacy" },
              { name: "Terms", href: "/terms" },
              { name: "Cookies", href: "/cookies" },
            ].map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="group relative text-sm text-muted-foreground hover:text-primary transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="group-hover:translate-y-[-1px] transition-transform duration-300 inline-block">
                  {link.name}
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
