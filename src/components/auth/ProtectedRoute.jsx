import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/supabase-client";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!mounted) return;
      setAuthed(!!userData?.user);
      setChecking(false);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAuthed(!!session?.user);
    });
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  if (checking) return null;
  return authed ? children : <Navigate to="/adminlogin" replace />;
}


