const { VITE_PATH } = import.meta.env;
export function productApis(request) {
  return {
    getProducts: (query) =>
      request({
        url: `/api/${VITE_PATH}/admin/products`,
        method: "get",
        query,
      }),
    // getProductsAll: () =>
    //   request({
    //     url: `/api/${VITE_PATH}/admin/products/all`,
    //     method: "get",
    //   }),
    addProducts: (data) => {
      console.log('add addProducts', data)
      return request({
        url: `/api/${VITE_PATH}/admin/product`,
        method: "post",
        data,
      })
    }
      ,

    updateProduct: (data, id) => {
      console.log('update updateProduct', data, id)
      return request({
        url: `/api/${VITE_PATH}/admin/product/${id}`,
        method: "put",
        data,
      })
    }
      ,
    deleteProduct: (id) =>
      request({
        url: `/api/${VITE_PATH}/admin/product/${id}`,
        method: "delete",
      }),
  };
}
