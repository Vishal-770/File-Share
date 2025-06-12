import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="bg-background lg:grid lg:min-h-[80vh] lg:place-content-center">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-prose text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Understand user flow and{" "}
              <span className="text-primary">increase</span> conversions
            </h1>

            <p className="text-lg text-muted-foreground">
              Optimize your customer journey with data-driven insights that
              reveal exactly where your users engage and where they drop off.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href={"/dashboard"}>
              {" "}
              <Button size="lg">Get Started</Button>
            </Link>
            <Button variant={"secondary"} size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
