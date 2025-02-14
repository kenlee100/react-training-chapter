import { useEffect, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import { FrontLayoutContext } from "@/contexts/FrontLayoutContext";

import axios from "axios";
import { createRequestInstance } from "@utils/request";

import { userCartApis } from "@apis/userCart";

import useCartAction from "@/hooks/useCartAction";
import useGetCartData from "@/hooks/useGetCartData";
import useUpdateCart from "@/hooks/useUpdateCartItem";

const request = createRequestInstance(axios);
const { deleteCartItem, deleteAllCart } = userCartApis(request);

export default function CartPage() {
  const { setIsLoading, setCartList } = useContext(FrontLayoutContext);

  const { modifyCartList } = useCartAction();
  const { getCartData } = useGetCartData(setCartList);
  const { updateCartItemData } = useUpdateCart(getCartData);

  async function deleteCartItemData(id, product) {
    if (window.confirm(`是否刪除 ${product.title} ?`)) {
      setIsLoading(true);
      try {
        await deleteCartItem(id);
        await getCartData();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }
  async function deleteAllCartData() {
    if (window.confirm("是否要清空購物車?")) {
      setIsLoading(true);
      try {
        const res = await deleteAllCart();
        const { message } = res;
        alert(message);
        await getCartData();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const cartTotal = useMemo(() => {
    return (modifyCartList?.carts || []).reduce((acc, cur) => {
      return acc + cur.total;
    }, 0);
  }, [modifyCartList?.carts]);

  useEffect(() => {
    getCartData();
  }, []);
  return (
    <>
      <h2>購物車</h2>
      <div>
        {modifyCartList?.carts && modifyCartList?.carts.length > 0 ? (
          <>
            <div className="text-end">
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={deleteAllCartData}
              >
                清空購物車
              </button>
            </div>
            <table className="table align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>品名</th>
                  <th style={{ width: "150px" }}>數量/單位</th>
                  <th>單價</th>
                  <th>加總</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {modifyCartList?.carts.map(
                  ({ product, qty, id, total, product_id }) => {
                    return (
                      <tr key={id}>
                        <td></td>
                        <td>{product.title}</td>
                        <td>
                          <div className="row g-2 flex-nowrap  align-items-center">
                            <div className="col-auto">
                              <div className="btn-group" role="group">
                                <button
                                  type="button"
                                  className="btn btn-outline-dark btn-sm"
                                  onClick={() =>
                                    updateCartItemData(
                                      {
                                        product_id,
                                        qty: qty - 1,
                                      },
                                      id
                                    )
                                  }
                                  disabled={qty === 1}
                                >
                                  -
                                </button>
                                <span
                                  className="btn border border-dark"
                                  style={{ width: "50px", cursor: "auto" }}
                                >
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-outline-dark btn-sm"
                                  onClick={() =>
                                    updateCartItemData(
                                      {
                                        product_id,
                                        qty: qty + 1,
                                      },
                                      id
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="col-auto">
                              <div className="text-nowrap ml-2">
                                / {product.unit}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-end">{product.price}</td>
                        <td className="text-end">{total}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => deleteCartItemData(id, product)}
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="text-end">
                    總計： ${cartTotal}
                  </td>
                  <td className="text-end"></td>
                </tr>
                {modifyCartList.total !== modifyCartList.final_total && (
                  <tr>
                    <td colSpan="5" className="text-end text-success">
                      折扣價
                    </td>
                    <td className="text-end text-success"></td>
                  </tr>
                )}
              </tfoot>
            </table>
          </>
        ) : (
          <div className="d-flex justify-content-center flex-column align-items-center">
            <p>購物車沒有任何商品</p>
            <Link to={"/products"}>去購物吧</Link>
          </div>
        )}
        <Link className="btn btn-outline-secondary" to={"/order"}>
          前往結賬
        </Link>
      </div>
    </>
  );
}
