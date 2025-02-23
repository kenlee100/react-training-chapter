import { createRequestInstance } from "@utils/request";
import axios from "axios";
import { userCartApis } from "@apis/userCart";
const request = createRequestInstance(axios);
const { updateCartItem } = userCartApis(request);
export default function useUpdateCart(getCartData, products, setIsLoading) {
  async function updateCartItemData(data, id) {
    setIsLoading(true);
    const findProduct = products?.find(
      (item) => data.product_id === item.product_id
    );
    const { title } = findProduct.product;
    try {
      await updateCartItem({ data }, id);
      await getCartData();
      alert(`已更新 ${title || ""} 商品數量`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return {
    updateCartItemData,
  };
}
