import { Home, BookUser, MapPinned, TreePalm } from "lucide-react";

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
    url: "#",
    icon: Home,
  },
  {
    title: "Wisata",
    url: "#",
    icon: TreePalm,
  },
  {
    title: "Pengelola",
    url: "#",
    icon: BookUser,
  },
  {
    title: "Alamat",
    url: "#",
    icon: MapPinned,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="font-display">
      <SidebarContent className=" bg-primary">
        <div className="h-20 w-full flex items-center bg-third">
          <h1 className="text-3xl pl-4 font-bold text-white">Dashboard</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-white hover:shadow-glowing hover:bg-white transition duration-100 hover:-translate-y-1.5 gap-10"
                  >
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
