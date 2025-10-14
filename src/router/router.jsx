import { createBrowserRouter, redirect } from "react-router-dom";
import { supabase } from "@/supabase-client";
import Home from "../pages/home";
import NotFound from "../pages/notfound";
import LoginPage from "../pages/login";
import DiscoveryPage from "../pages/discovery";

async function authLoader() {
  const { data } = await supabase.auth.getSession();
  if (!data?.session) {
    return redirect("/adminlogin");
  }
  return null;
}
import DashboardLayout from "@/components/admin/sidebarlayout";
import HomeDashboard from "@/components/admin/homeDashboard/homedashboard";
import CreateWisata from "@/components/admin/dashboard/wisata/formwisata";
import CreatePengelola from "@/components/admin/dashboard/pengelola/formpengelola";
import CreateKecamatan from "@/components/admin/dashboard/kecamatan/formkecamatan";
import WisataEdit from "@/components/admin/homeDashboard/wisata-edit";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/discovery",
    element: <DiscoveryPage />,
  },
  {
    path: "/adminlogin",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    loader: authLoader,
    children: [
      { index: true, element: <HomeDashboard /> },
      { path: "formwisata", element: <CreateWisata /> },
      { path: "pengelola", element: <CreatePengelola /> },
      { path: "kecamatan", element: <CreateKecamatan /> },
      { path: "edit/:id", element: <WisataEdit /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
