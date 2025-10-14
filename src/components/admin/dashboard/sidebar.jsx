import { Home, BookUser, MapPinned, TreePalm } from "lucide-react";
import { Link } from "react-router-dom";

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
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Wisata",
    url: "/dashboard/formwisata",
    icon: TreePalm,
  },
  {
    title: "Pengelola",
    url: "/dashboard/pengelola",
    icon: BookUser,
  },
  {
    title: "Kecamatan",
    url: "/dashboard/kecamatan",
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
                    className="text-white text-xl hover:shadow-glowing hover:bg-white transition duration-100 gap-10 mt-5"
                  >
                    <Link to={item.url}>
                      <item.icon size={100} />
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
