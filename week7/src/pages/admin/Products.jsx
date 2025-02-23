import { useState, useEffect, useRef, useCallback, memo } from "react";

import axios from "axios";
import { createRequestInstance } from "@utils/request";
import { authApis } from "@apis/auth";

import { Modal } from "bootstrap";
import Table from "@/components/Table";
import ProductModal from "@/components/admin/ProductModal";
import Pagination from "@/components/Pagination";

import { useAuth } from "@/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";

import {
  selectProducts,
  selectPageInfo,
  asyncProductsData,
  setIsLoading,
} from "@/redux/adminSlice";

const placeholderImage = "https://placehold.co/640x480?text=No+Photo";

const request = createRequestInstance(axios);
const { checkUserLogin } = authApis(request);
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
  imagesUrl: [placeholderImage], // 預設值塞值，避免新增時傳到後端導致 imagesUrl 欄位消失
};

function ProductsPage() {
  const dispatch = useDispatch();

  const { isAuth } = useAuth(checkUserLogin, setIsLoading);

  const [tempProduct, setTempProduct] = useState(productDefault);

  const [modalType, setModalType] = useState("");

  const productModalRef = useRef(null);
  const productModalEl = useRef(null);

  const products = useSelector(selectProducts);
  const pageInfo = useSelector(selectPageInfo);

  useEffect(() => {
    dispatch(
      asyncProductsData({
        page: 1,
      })
    );
  }, [isAuth]);

  useEffect(() => {
    if (productModalRef.current) {
      productModalEl.current = new Modal(productModalRef.current, {
        backdrop: "static",
        keyboard: false,
      });
    }
  }, [productModalRef.current]);

  const openProductModal = useCallback(function (product, type) {
    setTempProduct({
      id: product?.id || "",
      title: product?.title || "",
      imageUrl: product?.imageUrl || placeholderImage,
      category: product?.category || "",
      description: product?.description || "",
      content: product?.content || "",
      origin_price: parseInt(product?.origin_price) || 0,
      price: parseInt(product?.price) || 0,
      is_enabled: product?.is_enabled || 0,
      unit: product?.unit || "",
      imagesUrl: product?.imagesUrl || [placeholderImage], // 預設值塞值，避免新增時傳到後端導致 imagesUrl 欄位消失,
    });

    productModalEl.current.show();
    setModalType(type);
  }, []);

  const closeProductModal = useCallback(function () {
    productModalEl.current.hide();
    setTempProduct(productDefault);
  }, []);

  return (
    <>
      <div className="mt-3">
        <div className="d-flex align-items-center justify-content-between">
          <h2>後台產品列表</h2>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openProductModal(tempProduct, "new")}
          >
            新增產品
          </button>
        </div>
        <Table products={products} openProductModal={openProductModal} />
        {products && products.length > 0 && (
          <div className="d-flex justify-content-center py-3">
            <Pagination pageInfo={pageInfo} changePage={asyncProductsData} />
          </div>
        )}
      </div>
      <ProductModal
        ref={productModalRef}
        tempProduct={tempProduct}
        closeProductModal={closeProductModal}
        modalType={modalType}
        placeholderImage={placeholderImage}
      />
    </>
  );
}

export default memo(ProductsPage);
