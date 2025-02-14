import { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import { createRequestInstance } from "@utils/request";
import { userProductApis } from "@apis/userProducts";

import Pagination from "@/components/Pagination";

import { FrontLayoutContext } from "@/contexts/FrontLayoutContext";
import useCartAction from "@/hooks/useCartAction";

const request = createRequestInstance(axios);

const { getProducts } = userProductApis(request);

export default function Products() {
  const { setIsLoading } = useContext(FrontLayoutContext);
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    total_pages: 1,
    current_page: 1,
    has_pre: false,
    has_next: true,
    category: "",
  });
  const { handleAddToCart, isProductLoading } = useCartAction();

  useEffect(() => {
    getProductsData({
      page: 1,
    });
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

  return (
    <>
      <h2>產品列表</h2>
      <div className="mt-4">
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
                      <Link
                        className="btn btn-outline-secondary"
                        to={`/product/${item.id}`}
                      >
                        <i className="fas fa-spinner fa-pulse"></i>
                        查看更多
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-primary d-flex align-items-center "
                        onClick={() =>
                          handleAddToCart({
                            product_id: item.id,
                            qty: 1,
                          })
                        }
                        disabled={isProductLoading(item.id)}
                      >
                        {isProductLoading(item.id) && (
                          <div
                            className="me-2 spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
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
      </div>
    </>
  );
}
