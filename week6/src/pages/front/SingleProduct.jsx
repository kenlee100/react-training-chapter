import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import { FrontLayoutContext } from "@/contexts/FrontLayoutContext";

import { createRequestInstance } from "@utils/request";
import axios from "axios";
import { userProductApis } from "@apis/userProducts";

import useCartAction from "@/hooks/useCartAction";

const request = createRequestInstance(axios);
const { getProductItem } = userProductApis(request);

export default function SingleProduct() {
  const { setIsLoading } = useContext(FrontLayoutContext);
  const { productId } = useParams();
  const navigate = useNavigate();

  const [productContent, setProductContent] = useState({});
  const [currentViewImage, setCurrentViewImage] = useState("");

  const [qtySelect, setQtySelect] = useState(1);

  const { handleAddToCart, isProductLoading } = useCartAction();

  function handleCurrentView(img) {
    setCurrentViewImage(img);
  }
  useEffect(() => {
    async function getProductItemData() {
      setIsLoading(true);
      try {
        const res = await getProductItem(productId);
        const { product } = res;
        setProductContent(product);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    getProductItemData();
  }, []);

  // 初始選取第一張大圖
  useEffect(() => {
    if (productContent.imageUrl) {
      setCurrentViewImage(productContent.imageUrl);
    }
  }, [productContent]);

  // 開啟後購買數量變成預設
  useEffect(() => {
    setQtySelect(1);
  }, [productContent]);
  return (
    <div className="mx-auto" style={{ maxWidth: "600px" }}>
      <h1 className="fs-5">{productContent.title}</h1>
      <div>
        <img
          src={currentViewImage}
          alt={productContent.title}
          style={{ width: "600px", height: "600px" }}
          className="img-fluid pb-3 object-fit-cover"
        />
        <div className="d-flex flex-wrap gap-3 mb-3">
          <img
            src={productContent.imageUrl}
            alt={productContent.title}
            className="thumbnail img-fluid object-fit-cover"
            onClick={() => handleCurrentView(productContent.imageUrl)}
          />
          {productContent.imagesUrl?.map((tempImg, index) => {
            return (
              <img
                key={index}
                src={tempImg}
                className="thumbnail img-fluid object-fit-cover"
                onClick={() => handleCurrentView(tempImg)}
              />
            );
          })}
        </div>
        <p>內容：{productContent.content}</p>
        <p>描述：{productContent.description}</p>
        <p>
          原價：<del>{productContent.origin_price}</del>
        </p>
        <p>售價：{productContent.price} 元</p>
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <label htmlFor="qtySelect">數量：</label>
          </div>
          <div className="col-sm-4">
            <select
              value={qtySelect}
              onChange={(e) => setQtySelect(Number(e.target.value))}
              id="qtySelect"
              className="form-select"
            >
              {Array.from({ length: 20 }).map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="py-3">
        <div className="row">
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                handleAddToCart({
                  product_id: productContent.id,
                  qty: Number(qtySelect),
                });
              }}
              disabled={isProductLoading(productContent.id)}
            >
              {isProductLoading(productContent.id) && (
                <div
                  className="me-2 spinner-border spinner-border-sm"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
              加入購物車
            </button>
          </div>
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              返回上頁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
