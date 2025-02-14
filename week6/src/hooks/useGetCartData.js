import { useContext } from "react";
import { FrontLayoutContext } from "@/contexts/FrontLayoutContext";
import axios from "axios";
import { createRequestInstance } from "@utils/request";
import { userCartApis } from "@apis/userCart";
const request = createRequestInstance(axios);
const { getCart } = userCartApis(request);

export default function useGetCartData(setCartList) {
  const { setIsLoading } = useContext(FrontLayoutContext);
  async function getCartData() {
    setIsLoading(true);
    try {
      const res = await getCart();
      const { data } = res;
      setCartList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return {
    getCartData,
  };
}
