import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./dashboard/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      const hasUser = !!data?.user;
      setAuthed(hasUser);
      if (!hasUser) navigate("/adminlogin", { replace: true });
      setChecking(false);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const hasUser = !!session?.user;
      setAuthed(hasUser);
      if (!hasUser) navigate("/adminlogin", { replace: true });
    });
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [navigate]);

  if (checking || !authed) return null;

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
