import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./dashboard/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-third p-6">
        <SidebarTrigger />
        {children ?? <Outlet />}
      </main>
    </SidebarProvider>
  );
}
