import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import axios from "axios";
import { createRequestInstance } from "@utils/request";
import { authApis } from "@apis/auth";
import { useAuth } from "@/hooks/useAuth";

import { useSelector, useDispatch } from "react-redux";
import { selectLoading, setIsLoading } from "@/redux/adminSlice";
import { pushMessage } from "@/redux/toastSlice";

import { AdminLayoutProvider } from "@/components/admin/AdminLayoutContext";
import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import Loading from "@/components/Loading";

const linkList = [
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const request = createRequestInstance(axios);
  const { checkUserLogin, userLogout } = authApis(request);
  const isLoading = useSelector(selectLoading);
  const { isAuth, verifyAuth } = useAuth(checkUserLogin, setIsLoading);

  useEffect(() => {
    verifyAuth();
  }, []);

  async function handleLogout() {
    setIsLoading(true);
    try {
      const res = await userLogout();
      const { message } = res;
      dispatch(pushMessage({ text: message, status: "success" }));
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="container">
        <Navbar linkList={linkList}>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleLogout}
            >
              登出
            </button>
          </div>
        </Navbar>
        <Outlet />
      </div>
      <Loading isLoading={isLoading} />
      <Toast />
    </>
  );
}

export default AdminLayout;
