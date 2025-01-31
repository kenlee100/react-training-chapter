const { VITE_PATH } = import.meta.env;

export function orderApis(request) {
  return {
    sendOrder: (data) =>
      request({
        url: `/api/${VITE_PATH}/order`,
        method: "post",
        data,
      }),
  };
}
