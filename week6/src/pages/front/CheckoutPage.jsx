import { useState, useEffect, useMemo, useContext } from "react";
import { useLocation } from "react-router-dom";
import { FrontLayoutContext } from "@/contexts/FrontLayoutContext";

import axios from "axios";
import { createRequestInstance } from "@utils/request";

import { userOrderApis } from "@apis/userOrder";

const request = createRequestInstance(axios);

const { getOrder } = userOrderApis(request);
const orderDataDefault = {
  create_at: null,
  id: "",
  is_paid: false,
  products: {},
  total: null,
  user: {
    address: "",
    county: "",
    district: "",
    email: "",
    name: "",
    tel: "",
  },
  message: "",
};
export default function CheckoutPage() {
  const { setIsLoading } = useContext(FrontLayoutContext);
  const location = useLocation()
  const [orderData, setOrderData] = useState(orderDataDefault);

  
  useEffect(() => {
    async function getOrderData(id) {
      setIsLoading(true);
      try {
        const res = await getOrder(id);
        setOrderData(res?.order || orderDataDefault);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    getOrderData(location?.state?.orderId);
  }, []);
  

  

  // 處理訂單內的產品資料
  const orderDataList = useMemo(() => {
    return Object.keys(orderData?.products).map((item) => {
      return orderData?.products[item];
    });
  }, [orderData]);

  function convertTime(timestamp) {
    const time = timestamp * 1000;
    const date = new Date(time);
    return date.toLocaleString();
  }
  return (
    <>
      <h2>成功建立訂單 - 訂單明細</h2>
      <table className="table align-middle">
        <thead>
          <tr>
            <th>品名</th>
            <th style={{ width: "150px" }}>數量/單位</th>
            <th className="text-end">單價</th>
            <th className="text-end">加總</th>
          </tr>
        </thead>
        <tbody>
          {orderDataList.map(({ product, qty, id, total }) => {
            return (
              <tr key={id}>
                <td>{product.title}</td>
                <td>
                  <div className="row g-2 flex-nowrap  align-items-center">
                    <div className="col-auto">
                      <span>{qty}</span>
                    </div>
                    <div className="col-auto">
                      <div className="text-nowrap ml-2">/ {product.unit}</div>
                    </div>
                  </div>
                </td>
                <td className="text-end">{product.price}</td>
                <td className="text-end">{total}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="text-end">
              總計： ${orderData.total}
            </td>
          </tr>
        </tfoot>
      </table>
      <div
        className="d-flex justify-content-center mx-auto"
        style={{
          maxWidth: "600px",
        }}
      >
        <ul className="list-group w-100">
          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">ID</div>
              {orderData?.id}
            </div>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">訂單成立時間</div>
              {convertTime(orderData?.create_at)}
            </div>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">姓名</div>
              {orderData?.user?.name}
            </div>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">信箱</div>
              {orderData?.user?.email}
            </div>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">電話</div>
              {orderData?.user?.tel}
            </div>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">地址</div>
              {orderData?.user?.county} {orderData?.user?.district}{" "}
              {orderData?.user?.address}
            </div>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">訊息</div>
              {orderData?.message}
            </div>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">是否付款</div>
              {orderData?.is_paid ? (
                <div className="text-success">已付款</div>
              ) : (
                <div className="text-danger">尚未付款</div>
              )}
            </div>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">金額</div>${orderData?.total}
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
