import { createHashRouter } from "react-router-dom";
import App from "@/App";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminProducts from "@/pages/admin/Products";
import AdminCart from "@/pages/admin/CartPage";

import FrontLayout from "@/pages/front/FrontLayout";
import Login from "@/pages/admin/Login";
import Home from "@/pages/front/Home";
import FrontProducts from "@/pages/front/Products";
import FrontSingleProduct from "@/pages/front/SingleProduct";
import FrontCart from "@/pages/front/CartPage";
import FrontOrder from "@/pages/front/OrderPage";
import FrontCheckout from "@/pages/front/CheckoutPage";
import NotFound from "@/pages/front/NotFound";

const routes = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <FrontLayout />,
        children: [
          {
            path: "",
            element: <Home />,
          },
          {
            path: "products",
            element: <FrontProducts />,
          },
          {
            path: "product/:productId",
            element: <FrontSingleProduct />,
          },
          {
            path: "cart",
            element: <FrontCart />,
          },
          {
            path: "order",
            element: <FrontOrder />,
          },
          {
            path: "/checkout/:orderId",
            element: <FrontCheckout />,
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
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
