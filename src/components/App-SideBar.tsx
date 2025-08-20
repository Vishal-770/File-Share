import {
  HomeIcon,
  Upload,
  File,
  Mail,
  Wallet,
  Users,
  FileText,
  User,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const mainItems = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Upload",
    url: "/dashboard",
    icon: Upload,
  },
  {
    title: "Files",
    url: "/dashboard/files",
    icon: File,
  },
];

const collaborationItems = [
  {
    title: "Mail",
    url: "/dashboard/mail",
    icon: Mail,
  },
  {
    title: "Teams",
    url: "/dashboard/teams",
    icon: Users,
  },
  {
    title: "Public Teams",
    url: "/dashboard/public-teams",
    icon: Users,
  },
];

const accountItems = [
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Upgrade",
    url: "/dashboard/Pricing",
    icon: Wallet,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Sidebar Header with Brand */}
      <SidebarHeader className="border-b border-sidebar-border">
        {/* Expanded Header */}
        <div className="flex items-center gap-3 px-3 py-2 group-data-[collapsible=icon]:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-semibold text-sidebar-foreground text-sm">
              File Drop
            </span>
            <span className="truncate text-sidebar-foreground/70 text-xs">
              Secure File Sharing
            </span>
          </div>
        </div>

        {/* Collapsed Header - Only Icon */}
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Collaboration */}
        <SidebarGroup>
          <SidebarGroupLabel>Collaboration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collaborationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
