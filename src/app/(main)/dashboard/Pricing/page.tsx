import { PricingTable } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-start flex-col">
        <h1 className="text-4xl font-bold mt-10 mb-10 xl:mb-20">Our Pricing Plans</h1>
      <PricingTable />
    </div>
  );
};

export default page;
