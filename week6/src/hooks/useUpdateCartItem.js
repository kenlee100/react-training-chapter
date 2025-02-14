import { createRequestInstance } from "@utils/request";
import axios from "axios";
import { userCartApis } from "@apis/userCart";
const request = createRequestInstance(axios);
const { updateCartItem } = userCartApis(request);
export default function useUpdateCart(getCartData, setIsLoading, products) {
  async function updateCartItemData(data, id) {
    const findProduct = products?.find((item) => data.product_id === item.id);
    try {
      await updateCartItem({ data }, id);
      await getCartData();
      alert(`已更新 ${findProduct?.title || ""} 商品數量`);
    } catch (error) {
      console.error(error);
    }
  }
  return {
    updateCartItemData,
  };
}
