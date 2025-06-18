import {
  HomeIcon,

  Upload,
  File,
  Mail,
  Wallet,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
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
  {
    title: "Mail",
    url: "/dashboard/mail",
    icon: Mail,
  },
  {
    title: "Upgrade",
    url: "/dashboard/Pricing",
    icon: Wallet,
  },

  {
    title: "Teams",
    url: "/dashboard/teams",
    icon: Users,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>File Drop</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
