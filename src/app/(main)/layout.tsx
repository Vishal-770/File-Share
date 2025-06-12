import AppSideBar from "@/components/App-SideBar";
import AppNavBar from "@/components/AppNavBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import { cookies } from "next/headers";
const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSideBar />

      <main className="w-full">
        <AppNavBar />
        <div className="px-4"> {children}</div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
