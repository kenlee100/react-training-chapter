import { useState, useEffect, useRef } from "react";

import { createRequestInstance } from "@utils/request";
import { authApis } from "@apis/auth";
import { productApis } from "@apis/products";

import axios from "axios";
import { Modal } from "bootstrap";

import Loading from "@/components/Loading";

import ProductModal from "@/components/ProductModal";

import { useAuth } from "@/hooks/useAuth";

const placeholderImage = "https://placehold.co/640x480?text=No+Photo";

function App() {
  const request = createRequestInstance(axios);
  const { userLogin, checkUserLogin } = authApis(request);
  const { getProducts, addProducts, updateProduct, deleteProduct } =
    productApis(request);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuth, setIsAuth, verifyAuth } = useAuth(
    checkUserLogin,
    setIsLoading
  );

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
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
  const [tempProduct, setTempProduct] = useState(productDefault);

  const [products, setProducts] = useState([]);

  const [modalType, setModalType] = useState("");

  const productModalRef = useRef(null);
  const productModalEl = useRef(null);
  useEffect(() => {
    if (isAuth) {
      getProductsData();
    }
  }, [isAuth]);
  
  useEffect(() => {
    if (productModalRef.current) {
      productModalEl.current = new Modal(productModalRef.current, {
        backdrop: "static",
        keyboard: false,
      });
    }
  }, [productModalRef.current]);

  function handleImageChange(e, index) {
    const { value } = e.target;
    setTempProduct((prev) => {
      const imagesArr = [...prev.imagesUrl];
      imagesArr[index] = value;
      return {
        ...prev,
        imagesUrl: imagesArr,
      };
    });
  }
  function handleModalInputChange(e) {
    const { id, value, checked, type } = e.target;
    setTempProduct((prev) => {
      return {
        ...prev,
        [id]: type === "checkbox" ? checked : value,
      };
    });
  }

  function handleModalSubmit(e) {
    e.preventDefault();
  }

  function handleAddImage() {
    setTempProduct((prev) => {
      return {
        ...prev,
        imagesUrl: [...prev.imagesUrl, placeholderImage],
      };
    });
  }
  function handleRemoveImage(index) {
    setTempProduct((prev) => {
      const updatedImagesUrl = prev.imagesUrl.filter((item, i) => i !== index);
      return {
        ...prev,
        imagesUrl: updatedImagesUrl,
      };
    });
  }

  function openProductModal(product, type) {
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
      imagesUrl: product?.imagesUrl || [],
    });
    
    productModalEl.current.show();
    setModalType(type);
  }

  function closeProductModal() {
    productModalEl.current.hide();
    setTempProduct(productDefault);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function updateProductsData() {
    const callApi = {
      edit: updateProduct,
      new: addProducts,
      delete: deleteProductData,
    };
    setIsLoading(true);
    const productData = {
      data: {
        ...tempProduct,
        origin_price: parseInt(tempProduct.origin_price),
        price: parseInt(tempProduct.price),
        imagesUrl: [...tempProduct.imagesUrl],
        is_enabled: tempProduct.is_enabled ? 1 : 0,
      },
    };

    try {
      let response = null;
      switch (modalType) {
        case "edit":
          response = await callApi[modalType](productData, productData.data.id);
          console.log(response?.message);
          break;
        case "new":
          productData.data.imageUrl = placeholderImage;
          response = await callApi[modalType](productData);
          console.log(response?.message);
          break;
        case "delete":
          productData.data.imageUrl = placeholderImage;
          response = await callApi[modalType](productData.data.id);
          console.log(response?.message);
          break;
      }
      await getProductsData();
      closeProductModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteProductData(id) {
    setIsLoading(true);
    try {
      const res = await deleteProduct(id);
      const { message } = res;
      console.log(message);
      await getProductsData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await userLogin(formData);
      console.log("登入成功");
      const { token, expired } = res;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      await verifyAuth();
    } catch (error) {
      console.error(error);
    }
  }

  async function getProductsData(params) {
    setIsLoading(true);
    try {
      const res = await getProducts(params);
      const { products } = res;
      setProducts(products);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isAuth ? (
        <>
          <div className="container">
            <div className="py-3">
            </div>
            <div className="mt-3">
              <div className="d-flex align-items-center justify-content-between">
                <h2>產品列表</h2>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => openProductModal(tempProduct, "new")}
                >
                  新增產品
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>no</th>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td>
                          <span
                            className={
                              item.is_enabled
                                ? "text-success"
                                : "text-secondary"
                            }
                          >
                            {item.is_enabled ? "啟用" : "未啟用"}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => openProductModal(item, "edit")}
                            >
                              編輯
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => openProductModal(item, "delete")}
                            >
                              刪除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">尚無產品資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <ProductModal
              ref={productModalRef}
              tempProduct={tempProduct}
              closeProductModal={closeProductModal}
              modalType={modalType}
              handleModalSubmit={handleModalSubmit}
              handleModalInputChange={handleModalInputChange}
              handleImageChange={handleImageChange}
              handleRemoveImage={handleRemoveImage}
              handleAddImage={handleAddImage}
              updateProductsData={updateProductsData}
            />
            <Loading isLoading={isLoading} />
          </div>
        </>
      ) : (
        <div className="container text-center p-4">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    name="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  );
}

export default App;
