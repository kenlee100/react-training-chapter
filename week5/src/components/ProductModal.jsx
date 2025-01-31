import { forwardRef, useState, useEffect, memo } from "react";
import PropTypes from "prop-types";

import axios from "axios";
import { createRequestInstance } from "@utils/request";
import { cartApis } from "@apis/cart";

const request = createRequestInstance(axios);
const { addToCart } = cartApis(request);
function ProductModalComponent(
  { tempProduct, closeProductModal, getCartData },
  ref
) {
  const [qtySelect, setQtySelect] = useState(1);

  // 開啟後購買數量變成預設
  useEffect(() => {
    setQtySelect(1);
  }, [tempProduct]);

  async function handleModalAddToCart(data) {
    try {
      await addToCart({ data });
      await getCartData();
    } catch (error) {
      console.error(error);
    } finally {
      closeProductModal();
    }
  }

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref={ref}
    >
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">產品名稱：{tempProduct.title}</h1>
            <button
              type="button"
              className="btn-close"
              onClick={closeProductModal}
            ></button>
          </div>
          <div className="modal-body">
            <img
              src={tempProduct.imageUrl}
              alt={tempProduct.title}
              className="img-fluid pb-3"
            />
            <p>內容：{tempProduct.content}</p>
            <p>描述：{tempProduct.description}</p>
            <p>
              原價：<del>{tempProduct.origin_price}</del>
            </p>
            <p>售價：{tempProduct.price} 元</p>
            <div className="row g-2 align-items-center">
              <div className="col-auto">
                <label htmlFor="qtySelect">數量：</label>
              </div>
              <div className="col-sm-4">
                <select
                  value={qtySelect}
                  onChange={(e) => setQtySelect(e.target.value)}
                  id="qtySelect"
                  className="form-select"
                >
                  {Array.from({ length: 10 }).map((_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeProductModal}
            >
              關閉
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                handleModalAddToCart({
                  product_id: tempProduct.id,
                  qty: Number(qtySelect),
                });
              }}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductModal = forwardRef(ProductModalComponent);
ProductModalComponent.propTypes = {
  tempProduct: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    imagesUrl: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    unit: PropTypes.string,
    description: PropTypes.string,
    content: PropTypes.string,
    origin_price: PropTypes.number,
    price: PropTypes.number,
    is_enabled: PropTypes.bool,
  }),
  closeProductModal: PropTypes.func,
  handleModalAddToCart: PropTypes.func,
  getCartData: PropTypes.func,
};

export default memo(ProductModal);
