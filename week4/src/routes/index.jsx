import { createHashRouter } from "react-router-dom";
import App from "@/App";
import AdminLayout from "@/pages/AdminLayout";
import Login from "@/pages/Login";
import Products from "@/pages/Products";

const routes = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "/",
        element: <AdminLayout />,
        children: [
          {
            path: "products",
            element: <Products />,
          },
        ],
      },
    ],
  },
]);
export default routes;
