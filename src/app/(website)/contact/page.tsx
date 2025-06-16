import React from "react";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";

const ContactPage = () => {
  return (
    <section className="bg-background">
      {/* Hero Section */}
      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <Badge
            variant="outline"
            className="px-4 py-1.5 rounded-full border-primary/30 bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20"
          >
            📬 Get In Touch
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            We&#39;d Love to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Hear From You
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our file sharing platform? Our team is here to
            help you with any inquiries.
          </p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Email Card */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Email Us</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Send us an email and we&#39;ll get back to you within 24 hours.
              </p>
              <div className="text-primary font-medium">
                support@fileshare.com
              </div>
              <Button variant="outline" className="mt-4 gap-2 w-full">
                <Send className="w-4 h-4" />
                Compose Email
              </Button>
            </div>

            {/* Phone Card */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Call Us</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Available Monday to Friday from 9am to 5pm EST.
              </p>
              <div className="text-primary font-medium">+1 (555) 123-4567</div>
              <Button variant="outline" className="mt-4 gap-2 w-full">
                <Phone className="w-4 h-4" />
                Call Now
              </Button>
            </div>

            {/* Live Chat Card */}
            <div className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Live Chat</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Chat with our support team in real-time for instant help.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Online now
              </div>
              <Button className="mt-4 gap-2 w-full">
                <MessageSquare className="w-4 h-4" />
                Start Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form + Info */}
      <div className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <div className="lg:w-1/2">
              <div className="bg-muted/50 border rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
                  Send Us a Message
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first-name"
                        className="w-full px-4 py-2 rounded-lg border border-muted-foreground/30 bg-background text-foreground focus:ring-primary focus:border-primary"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last-name"
                        className="w-full px-4 py-2 rounded-lg border border-muted-foreground/30 bg-background text-foreground focus:ring-primary focus:border-primary"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 rounded-lg border border-muted-foreground/30 bg-background text-foreground focus:ring-primary focus:border-primary"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      className="w-full px-4 py-2 rounded-lg border border-muted-foreground/30 bg-background text-foreground focus:ring-primary focus:border-primary"
                    >
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Billing Question</option>
                      <option>Feature Request</option>
                      <option>Partnership</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-muted-foreground/30 bg-background text-foreground focus:ring-primary focus:border-primary"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:w-1/2">
              <Badge
                variant="outline"
                className="px-3 py-1 rounded-full border-primary/30 bg-primary/10 text-primary font-medium text-sm mb-4"
              >
                Our Office
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
                Contact Information
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We&#39;re here to help you with any questions about our file
                sharing platform.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Headquarters
                    </h3>
                    <p className="text-muted-foreground">
                      123 Tech Park Avenue
                      <br />
                      San Francisco, CA 94107
                      <br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Phone Numbers
                    </h3>
                    <p className="text-muted-foreground">
                      Sales: +1 (555) 123-4567
                      <br />
                      Support: +1 (555) 765-4321
                      <br />
                      Fax: +1 (555) 987-6543
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary mt-1">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Business Hours
                    </h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM EST
                      <br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  {["Twitter", "LinkedIn", "Facebook", "Instagram"].map(
                    (social) => (
                      <Button key={social} variant="outline" size="icon">
                        <span className="sr-only">{social}</span>
                        <div className="w-5 h-5 bg-muted-foreground/50 rounded-full"></div>
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Can&#39;t find what you&#39;re looking for? Contact our support
              team.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question:
                  "How secure is my data with your file sharing platform?",
                answer:
                  "We use end-to-end encryption (AES-256) for all file transfers and storage. Your data is protected with the same security standards used by banks and government agencies.",
              },
              {
                question: "What file types can I share with your platform?",
                answer:
                  "Our platform supports all common file types including documents, images, videos, and compressed files. There are no restrictions on file types.",
              },
              {
                question: "Is there a limit to file size I can upload?",
                answer:
                  "Our free plan allows uploads up to 2GB per file. Paid plans support up to 10GB per file with options for even larger files for enterprise customers.",
              },
              {
                question: "How long are my shared files available?",
                answer:
                  "Files remain available as long as your account is active. You can set expiration dates for individual shares if needed.",
              },
              {
                question: "Can I track who accesses my shared files?",
                answer:
                  "Yes, our dashboard provides detailed analytics on who accessed your files, when, and from where. You'll also receive notifications for downloads.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-background p-6 rounded-xl shadow-sm border"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {faq.question}
                </h3>
                <p className="mt-2 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
