import { useState, useEffect, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FrontLayoutContext } from "@/contexts/FrontLayoutContext";

import { useForm } from "react-hook-form";
import twzipcode from "@utils/twzipcode";
import axios from "axios";
import { createRequestInstance } from "@utils/request";

import { userOrderApis } from "@apis/userOrder";

import useCartAction from "@/hooks/useCartAction";
import useGetCartData from "@/hooks/useGetCartData";

const request = createRequestInstance(axios);

const { sendOrder } = userOrderApis(request);
export default function OrderPage() {
  const { setIsLoading, setCartList } = useContext(FrontLayoutContext);

  const { modifyCartList } = useCartAction();
  const { getCartData } = useGetCartData(setCartList);


  const navigate = useNavigate()

  const cartTotal = useMemo(() => {
    return (modifyCartList?.carts || []).reduce((acc, cur) => {
      return acc + cur.total;
    }, 0);
  }, [modifyCartList?.carts]);

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
    mode: "onTouched",
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
      await getCartData();
      navigate(`/checkout/${res?.orderId}`, {
        state: {
          orderId: res?.orderId,
        }
      })
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

  useEffect(() => {
    getCartData();
  }, []);
  return (
    <>
      <h2>結帳</h2>
      <div>
        {modifyCartList?.carts && modifyCartList?.carts.length > 0 ? (
          <>
            
            <table className="table align-middle mb-3">
              <thead>
                <tr>
                  <th></th>
                  <th>品名</th>
                  <th style={{ width: "150px" }}>數量/單位</th>
                  <th className="text-end">單價</th>
                  <th className="text-end">加總</th>
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
                              {qty}
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
            <Link className="btn btn-outline-secondary" to={'/cart'}>返回上一步</Link>
          </>
        ) : (
          <div className="d-flex justify-content-center flex-column align-items-center">
            <p>購物車沒有任何商品</p>
            <Link to={"/products"}>去購物吧</Link>
          </div>
        )}
        {modifyCartList?.carts && modifyCartList?.carts.length > 0 && (
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
                  type="tel"
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
                      className={`form-control ${
                        errors?.county && "is-invalid"
                      }`}
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
        )}
        
      </div>
    </>
  );
}
