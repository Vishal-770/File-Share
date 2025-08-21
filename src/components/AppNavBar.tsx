import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";

const AppNavBar = () => {
  return (
    <header className="  w-full bg-background border-b shadow-sm px-4 py-2">
      <div className=" mx-auto flex items-center justify-between">
        {/* Left: Sidebar / Logo */}
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <span className="font-base text-lg font-semibold tracking-tight text-foreground">
            FileDrop
          </span>
        </div>

        {/* Right: Theme toggle + User */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};

export default AppNavBar;
