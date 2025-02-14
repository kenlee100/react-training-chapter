import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { AdminLayoutProvider } from "@/components/admin/AdminLayoutContext";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

import { createRequestInstance } from "@utils/request";
import { authApis } from "@apis/auth";

import axios from "axios";
const request = createRequestInstance(axios);
const { checkUserLogin } = authApis(request);
const linkList = [
  {
    path: "/",
    title: "前台",
  },
  {
    path: "/admin/products",
    title: "產品列表",
  },
  {
    path: "/admin/cart",
    title: "購物車",
  },
];

function AdminLayout() {
  return (
    <AdminLayoutProvider>
      <AdminLayoutContent />
    </AdminLayoutProvider>
  );
}
function AdminLayoutContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuth, verifyAuth } = useAuth(checkUserLogin, setIsLoading);
  useEffect(() => {
    verifyAuth();
  }, []);
  return (
    <div className="container">
      <Navbar linkList={linkList} />
      <Outlet />
    </div>
  );
}

export default AdminLayout;
