import { useState, useCallback, useContext } from "react";
import { FrontLayoutContext } from "@/contexts/FrontLayoutContext";
import { createRequestInstance } from "@utils/request";
import axios from "axios";
import { userCartApis } from "@apis/userCart";

import useUpdateCart from "@/hooks/useUpdateCartItem";
import useGetCartData from "@/hooks/useGetCartData";
const request = createRequestInstance(axios);
const { addToCart } = userCartApis(request);

// 自定義 Hook 管理購物車加入狀態
function useCartAction() {
  const { cartList, setCartList } = useContext(FrontLayoutContext);
  const { getCartData } = useGetCartData(setCartList);
  const { updateCartItemData } = useUpdateCart(getCartData);
  // 管理loading狀態的 Map
  const [cartLoadingStatus, setCartLoadingStatus] = useState([]);

  // 開始加載
  const startLoading = useCallback((productId) => {
    setCartLoadingStatus((prev) => {
      return [...prev, productId];
    });
  }, []);

  // 結束加載
  const stopLoading = useCallback((productId) => {
    setCartLoadingStatus((prev) => {
      return prev.filter((state) => state.id === productId);
    });
  }, []);

  // 處理加入購物車的主要邏輯
  const handleAddToCart = useCallback(
    async (data) => {
      // 開始讀取
      startLoading(data.product_id);

      try {
        const findCartItem = cartList?.carts?.find((item) => {
          return data?.product_id === item?.product_id;
        });

        if (findCartItem) {
          // 已存在於購物車，更新數量
          await updateCartItemData(
            {
              product_id: data.product_id,
              qty: findCartItem.qty + data.qty,
            },
            findCartItem.id
          );
        } else {
          // 首次加入購物車
          await addToCart({ data });
          await getCartData();
        }
      } catch (error) {
        console.error(error);
      } finally {
        // 結束讀取
        stopLoading(data.product_id);
      }
    },
    [
      cartList,
      updateCartItemData,
      getCartData,
      startLoading,
      stopLoading,
    ]
  );

  // 檢查特定商品是否正在讀取
  const isProductLoading = useCallback(
    (productId) => {
      return cartLoadingStatus?.find((state) => state === productId);
    },
    [cartLoadingStatus]
  );
  
  const modifyCartList = cartList;
  return {
    handleAddToCart,
    isProductLoading,
    modifyCartList,
  };
}
export default useCartAction;
