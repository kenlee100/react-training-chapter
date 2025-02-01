import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";

import { createRequestInstance } from "@utils/request";
import { userProductApis } from "@apis/userProducts";
import { cartApis } from "@apis/cart";
import { orderApis } from "@apis/order";

import ReactLoading from "react-loading";
import Pagination from "@/components/Pagination";
import ProductModal from "@/components/ProductModal";

import twzipcode from "@utils/twzipcode";
const request = createRequestInstance(axios);

const { getProducts } = userProductApis(request);
const { addToCart, getCart, deleteCartItem, deleteAllCart, updateCartItem } =
  cartApis(request);
const { sendOrder } = orderApis(request);

const productDefault = {
  title: "",
  imageUrl: "",
  category: "",
  description: "",
  content: "",
  origin_price: 0,
  price: 0,
  is_enabled: 0,
  unit: "",
  imagesUrl: [],
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(productDefault);
  const [pageInfo, setPageInfo] = useState({
    total_pages: 1,
    current_page: 1,
    has_pre: false,
    has_next: true,
    category: "",
  });

  const productModalRef = useRef(null);
  const productModalEl = useRef(null);
  useEffect(() => {
    productModalEl.current = new Modal(productModalRef.current, {
      backdrop: "static",
      keyboard: false,
    });
  }, []);

  const openProductModal = useCallback(function (product) {
    setTempProduct({
      id: product?.id || "",
      title: product?.title || "",
      imageUrl: product?.imageUrl || "",
      category: product?.category || "",
      description: product?.description || "",
      content: product?.content || "",
      origin_price: parseInt(product?.origin_price) || 0,
      price: parseInt(product?.price) || 0,
      is_enabled: product?.is_enabled || 0,
      unit: product?.unit || "",
      imagesUrl: product?.imagesUrl || [],
    });

    productModalEl.current.show();
  }, []);

  const closeProductModal = useCallback(function () {
    productModalEl.current.hide();
  }, []);

  const [cartListStatus, setCartListStatus] = useState([]);

  useEffect(() => {
    getProductsData({
      page: 1,
    });
    getCartData();
  }, []);

  const getProductsData = useCallback(async function (params) {
    setIsLoading(true);
    try {
      const res = await getProducts(params);

      const { products, pagination } = res;
      setProducts(products);
      setPageInfo(pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function handleAddToCart(data) {
    // 紀錄每個 加入購物車按鈕 讀取狀態
    setCartListStatus((prevState) => {
      return [...prevState, data];
    });
    const findCartItem = cartList?.carts.find(
      (item) => data?.product_id === item?.product_id
    );
    try {
      // 該商品初次加入購物車時，如果 findCartItem 結果是 undefined，表示未曾加入購物車，就走 addToCart 新增購物車
      // 否則走 updateCartItemData 更新商品數量
      if (findCartItem) {
        await updateCartItemData(
          {
            product_id: data.product_id,
            qty: findCartItem.qty + data.qty,
          },
          findCartItem.id
        );
      } else {
        await addToCart({ data });
        await getCartData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      // 清除按鈕讀取狀態
      setCartListStatus((prevState) => {
        return prevState.filter((state) => state.id === data.product_id);
      });
    }
  }

  const checkCartListStatus = useCallback(
    (cart) => {
      return cartListStatus.find((state) => state.product_id === cart.id);
    },
    [cartListStatus]
  );

  const [cartList, setCartList] = useState({});
  async function getCartData() {
    try {
      const res = await getCart();
      const { data } = res;
      setCartList(data);
    } catch (error) {
      console.error(error);
    }
  }

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

  async function updateCartItemData(data, id) {
    setIsLoading(true);
    const findProduct = products?.find((item) => data.product_id === item.id);
    try {
      await updateCartItem({ data }, id);
      await getCartData();
      alert(`已更新 ${findProduct.title || ""} 商品數量`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const cartTotal = useMemo(() => {
    return (cartList?.carts || []).reduce((acc, cur) => {
      return acc + cur.total;
    }, 0);
  }, [cartList?.carts]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      tel: "",
      county: "",
      district: "",
      address: "",
      message: "",
    },
    mode: "onChange",
  });

  const [selectCounty, setSelectCounty] = useState({});

  // 選擇 county 時，自動選擇第一個 district
  useEffect(() => {
    setValue("district", Object.keys(selectCounty)[0]);
  }, [selectCounty]);

  async function sendOrderData(data) {
    setIsLoading(true);
    try {
      const res = await sendOrder({ data });
      const { message } = res;
      alert(message);
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  function formSubmit(data) {
    const { address, county, district, email, name, tel, message } = data;
    const form = {
      user: {
        name,
        email,
        tel,
        county,
        district,
        address,
      },
      message,
    };

    sendOrderData(form);
  }

  return (
    <>
      <div className="container">
        <div className="mt-4">
          <ProductModal
            ref={productModalRef}
            tempProduct={tempProduct}
            getCartData={getCartData}
            checkCartListStatus={checkCartListStatus}
            closeProductModal={closeProductModal}
            handleAddToCart={handleAddToCart}
          />
          <table className="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => {
                return (
                  <tr key={item.id}>
                    <td style={{ width: "200px" }}>
                      <div
                        style={{
                          height: "100px",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundImage: `url(${item.imageUrl})`,
                        }}
                      ></div>
                    </td>
                    <td>{item.title}</td>
                    <td>
                      <div className="h5">
                        原價：
                        <del className="h6">${item.origin_price}</del>
                      </div>
                      <div className="h5">售價：${item.price}</div>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => openProductModal(item)}
                        >
                          <i className="fas fa-spinner fa-pulse"></i>
                          查看更多
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary d-flex align-items-center "
                          onClick={() =>
                            handleAddToCart({
                              product_id: item.id,
                              qty: 1,
                            })
                          }
                          disabled={checkCartListStatus(item)}
                        >
                          {checkCartListStatus(item) && (
                            <div
                              className="me-2 spinner-border spinner-border-sm"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          )}
                          加到購物車
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination pageInfo={pageInfo} changePage={getProductsData} />
          {cartList?.carts && cartList?.carts.length > 0 && (
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
                  {cartList?.carts.map(
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
                  {cartList.total !== cartList.final_total && (
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
          )}
        </div>
        <div className="my-5 row justify-content-center">
          <form className="col-md-6" onSubmit={handleSubmit(formSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-control ${errors?.email && "is-invalid"}`}
                placeholder="請輸入 Email"
                {...register("email", {
                  required: "Email 為必填",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email 格式不正確",
                  },
                })}
              />
              {errors?.email && (
                <div className="pt-1 invalid-feedback">
                  {errors?.email?.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-control ${errors?.name && "is-invalid"}`}
                placeholder="請輸入姓名"
                {...register("name", {
                  required: "姓名為必填",
                  maxLength: {
                    value: 6,
                    message: "長度不可超過 6 個字元",
                  },
                })}
              />
              {errors?.name && (
                <div className="pt-1 invalid-feedback">
                  {errors?.name?.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                id="tel"
                name="tel"
                type="text"
                className={`form-control ${errors?.tel && "is-invalid"}`}
                placeholder="請輸入手機號碼"
                {...register("tel", {
                  required: "手機為必填",
                  pattern: {
                    value: /^09[0-9]{8}$/,
                    message: "手機格式不正確",
                  },
                })}
              />
              {errors?.tel && (
                <div className="pt-1 invalid-feedback">
                  {errors?.tel?.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="county" className="form-label">
                    縣市
                  </label>
                  <select
                    className={`form-control ${errors?.county && "is-invalid"}`}
                    name="county"
                    id="county"
                    {...register("county", {
                      onChange: (e) => {
                        setSelectCounty(twzipcode[e.target.value]);
                      },
                      required: "請選擇縣市",
                    })}
                  >
                    <option value="" disabled>
                      請選擇縣市
                    </option>
                    ;
                    {Object.keys(twzipcode).map((county) => {
                      return <option key={county}>{county}</option>;
                    })}
                  </select>
                  {errors?.county && (
                    <div className="pt-1 invalid-feedback">
                      {errors?.county?.message}
                    </div>
                  )}
                </div>
                <div className="col-6">
                  <label htmlFor="district" className="form-label">
                    地區
                  </label>
                  <select
                    className={`form-control ${
                      errors?.district && "is-invalid"
                    }`}
                    name="district"
                    id="district"
                    {...register("district", {
                      required: "請選擇地區",
                    })}
                  >
                    <option value="" disabled>
                      請選擇地區
                    </option>
                    {Object.keys(selectCounty).map((district) => {
                      return (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      );
                    })}
                  </select>
                  {errors?.district && (
                    <div className="pt-1 invalid-feedback">
                      {errors?.district?.message}
                    </div>
                  )}
                </div>
                <div className="col-12">
                  <div className="mt-2">
                    <label htmlFor="address" className="form-label">
                      地址
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className={`form-control ${
                        errors?.address && "is-invalid"
                      }`}
                      placeholder="請輸入地址"
                      {...register("address", {
                        required: "地址必填",
                      })}
                    />
                    {errors?.address && (
                      <div className="pt-1 invalid-feedback">
                        {errors?.address?.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                id="message"
                className="form-control"
                cols="30"
                rows="10"
                {...register("message")}
              ></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">
                送出訂單
              </button>
            </div>
          </form>
        </div>
      </div>
      {isLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 999,
          }}
        >
          <ReactLoading type="bubbles" color="grey" width="4rem" height="4rem" />
        </div>
      )}
    </>
  );
}

export default App;
