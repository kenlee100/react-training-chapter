const { VITE_PATH } = import.meta.env;
export function adminProducts(request) {
  return {
    getProducts: (query) => {
      const searchParams = new URLSearchParams(query);
      return request({
        url: `/api/${VITE_PATH}/admin/products?${searchParams.toString()}`,
        method: "get",
      });
    },
    // getProductsAll: () =>
    //   request({
    //     url: `/api/${VITE_PATH}/admin/products/all`,
    //     method: "get",
    //   }),
    addProducts: (data) => {
      return request({
        url: `/api/${VITE_PATH}/admin/product`,
        method: "post",
        data,
      });
    },
    updateProduct: (data, id) => {
      return request({
        url: `/api/${VITE_PATH}/admin/product/${id}`,
        method: "put",
        data,
      });
    },
    deleteProduct: (id) =>
      request({
        url: `/api/${VITE_PATH}/admin/product/${id}`,
        method: "delete",
      }),
    uploadImage: (data) => {
      return request({
        url: `/api/${VITE_PATH}/admin/upload`,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data,
      });
    },
  };
}
