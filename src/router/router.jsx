import { createBrowserRouter } from "react-router";
import Home from "../pages/home";
import NotFound from "../pages/notfound";
import TambahWisata from "../pages/tambahwisata";
import LoginPage from "../pages/login";
import Dashboard from "../pages/dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/formwisata",
    element: <TambahWisata />,
  },
  {
    path: "/adminlogin",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
