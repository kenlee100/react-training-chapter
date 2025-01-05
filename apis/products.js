const { VITE_PATH } = import.meta.env;
export function productApis(request) {
  return {
    getProducts: () =>
      request({
        url: `/api/${VITE_PATH}/admin/products`,
        method: "get",
      }),
  };
}
