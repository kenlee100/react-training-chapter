/* eslint-disable react/prop-types */
import { forwardRef } from "react";

function ProductModal(
  {
    tempProduct,
    closeProductModal,
    modalType,
    handleModalSubmit,
    handleModalInputChange,
    handleImageChange,
    handleRemoveImage,
    handleAddImage,
    updateProductsData,
  },
  ref
) {
  return (
    <div
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref={ref}
    >
      <div className="modal-dialog modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">
              {modalType === "edit" && "修改產品"}
              {modalType === "new" && "新增產品"}
              {modalType === "delete" && "刪除產品"}
            </h1>
            <button
              type="button"
              className="btn-close"
              onClick={closeProductModal}
            ></button>
          </div>
          <div className="modal-body">
            {modalType === "delete" && (
              <span>
                是否刪除 <span className="text-danger">{tempProduct?.title}</span> ?
              </span>
            )}
            {(modalType === "edit" || modalType === "new") && (
              <form onSubmit={handleModalSubmit}>
                <div className="row">
                  <div className="col-sm-4">
                    <div className="d-flex flex-grow-1 flex-column overflow-y-auto">
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          主要圖片
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control rounded-bottom-0 border-bottom-0"
                            name="imageUrl"
                            id="imageUrl"
                            value={tempProduct.imageUrl}
                            onChange={handleModalInputChange}
                            placeholder="請輸入主要圖片網址"
                          />
                        </div>
                        <img
                          src={tempProduct.imageUrl}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      {tempProduct.imagesUrl?.map((item, index) => {
                        return (
                          <div
                            className="mb-3 pt-3 border-top"
                            key={`image-${index + 1}`}
                          >
                            <label className="form-label">
                              圖片 {index + 1}
                            </label>
                            <div className="input-group">
                              <input
                                className="form-control rounded-bottom-0 border-bottom-0"
                                type="text"
                                name={`image-${index + 1}`}
                                value={item}
                                onChange={(e) => handleImageChange(e, index)}
                                id=""
                                placeholder={`請輸入圖片${index + 1}連結`}
                              />
                            </div>
                            <img className="img-fluid" src={item} alt="" />
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm d-block w-100 rounded-top-0"
                              onClick={() => handleRemoveImage(index)}
                            >
                              刪除
                            </button>
                          </div>
                        );
                      })}
                      {tempProduct.imagesUrl.length < 4 &&
                        tempProduct.imagesUrl[
                          tempProduct.imagesUrl.length - 1
                        ] !== "" && (
                          <div className="mb-3">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm d-block w-100"
                              onClick={handleAddImage}
                            >
                              新增其他圖片欄位
                            </button>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="col-sm-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        標題
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        id="title"
                        value={tempProduct.title}
                        onChange={handleModalInputChange}
                        placeholder="請輸入產品標題"
                      />
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="title" className="form-label">
                          分類
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="category"
                          id="category"
                          value={tempProduct.category}
                          onChange={handleModalInputChange}
                          placeholder="請輸入分類"
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="title" className="form-label">
                          單位
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="unit"
                          id="unit"
                          value={tempProduct.unit}
                          onChange={handleModalInputChange}
                          placeholder="請輸入單位"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        描述
                      </label>
                      <textarea
                        rows="3"
                        className="form-control"
                        name="description"
                        id="description"
                        value={tempProduct.description}
                        onChange={handleModalInputChange}
                        placeholder="請輸入描述"
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        商品內容
                      </label>
                      <textarea
                        rows="3"
                        className="form-control"
                        name="content"
                        id="content"
                        value={tempProduct.content}
                        onChange={handleModalInputChange}
                        placeholder="請輸入商品內容"
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="title" className="form-label">
                          原價
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="origin_price"
                          id="origin_price"
                          value={tempProduct.origin_price}
                          onChange={handleModalInputChange}
                          placeholder="請輸入數字"
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="title" className="form-label">
                          售價
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          id="price"
                          value={tempProduct.price}
                          onChange={handleModalInputChange}
                          placeholder="請輸入數字"
                        />
                      </div>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="is_enabled"
                        onChange={handleModalInputChange}
                        checked={tempProduct.is_enabled}
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        {tempProduct.is_enabled ? "已啟用" : "未啟用"}
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeProductModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={updateProductsData}
            >
              {modalType === "edit" && "修改產品"}
              {modalType === "new" && "新增產品"}
              {modalType === "delete" && "確定"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default forwardRef(ProductModal);
