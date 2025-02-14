import { Outlet, Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { FrontLayoutProvider } from "@/components/front/FrontLayoutContext";
import { FrontLayoutContext } from "@/contexts/FrontLayoutContext";

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";

import useGetCartData from "@/hooks/useGetCartData";

const linkList = [
  {
    path: "/",
    title: "首頁",
  },
  {
    path: "/products",
    title: "產品列表",
  },
  {
    path: "/admin/products",
    title: "後台",
  },
];

function FrontLayout() {
  return (
    <FrontLayoutProvider>
      <FrontLayoutContent />
    </FrontLayoutProvider>
  );
}

function FrontLayoutContent() {
  const { isLoading, cartList, setCartList } = useContext(FrontLayoutContext);
  const { getCartData } = useGetCartData(setCartList);

  useEffect(() => {
    getCartData();
  }, []);

  return (
    <>
      <Navbar linkList={linkList}>
        <Link
          to={"/cart"}
          className="btn btn-outline-secondary position-relative"
        >
          購物車
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
            {cartList?.carts?.length}
          </span>
        </Link>
      </Navbar>
      <div className="container">
        <div className="py-3">
          <Outlet />
        </div>
      </div>
      <Loading isLoading={isLoading} />
    </>
  );
}

export default FrontLayout;
