import { Home, BookUser, MapPinned, TreePalm, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/supabase-client";

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
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await supabase.auth.signOut().catch(() => {});
    navigate("/adminlogin", { replace: true });
  };
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="text-white text-xl hover:shadow-glowing hover:bg-white transition duration-100 gap-10 mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut size={100} />
                  <span>{loggingOut ? "Tunggu..." : "Log out"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
