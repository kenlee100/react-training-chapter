
const { VITE_PATH } = import.meta.env;
export function cartApis(request) {
    return {
      addToCart: (data) => {
        return request({
          url: `/api/${VITE_PATH}/cart`,
          method: "post",
          data,
        });
      },
      getCart: () =>
        request({
          url: `/api/${VITE_PATH}/cart`,
          method: "get",
        }),
      deleteCartItem: (id) =>
        request({
          url: `/api/${VITE_PATH}/cart/${id}`,
          method: "delete",
        }),
      deleteAllCart: () =>
        request({
          url: `/api/${VITE_PATH}/carts`,
          method: "delete",
        }),
      updateCartItem: (data, id) =>
        request({
          url: `/api/${VITE_PATH}/cart/${id}`,
          method: "put",
          data,
        }),
    };
  }