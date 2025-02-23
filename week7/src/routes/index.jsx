import { createHashRouter } from "react-router-dom";
import App from "@/App";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminProducts from "@/pages/admin/Products";
import AdminCart from "@/pages/admin/CartPage";
import Login from "@/pages/admin/Login";

import NotFound from "@/pages/NotFound";

const routes = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "cart",
        element: <AdminCart />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
export default routes;
