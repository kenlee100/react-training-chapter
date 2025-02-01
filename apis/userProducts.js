const { VITE_PATH } = import.meta.env;
export function userProductApis(request) {
  return {
    getProducts: (query) => {
      const searchParams = new URLSearchParams(query);
      return request({
        url: `/api/${VITE_PATH}/products?${searchParams.toString()}`,
        method: "get",
      });
    },
  };
}
