import { NavbarDemo } from "@/components/NavBar";
import React, { ReactNode } from "react";

const WebsiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div className="sticky w-full top-0 left-0">
        <NavbarDemo />
      </div>
      {children}
    </div>
  );
};

export default WebsiteLayout;
