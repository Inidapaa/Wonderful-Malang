import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import NotFound from "../pages/notfound";
import TambahWisata from "../pages/tambahwisata";
import LoginPage from "../pages/login";
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
    path: "/adminlogin",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <HomeDashboard /> },
      { path: "formwisata", element: <CreateWisata /> },
      { path: "pengelola", element: <CreatePengelola /> },
      { path: "kecamatan", element: <CreateKecamatan /> },
      { path: "edit/:id", element: <WisataEdit /> },
    ],
  },
  // optional legacy route, keep if needed
  { path: "/formwisata", element: <TambahWisata /> },
  {
    path: "*",
    element: <NotFound />,
  },
]);
