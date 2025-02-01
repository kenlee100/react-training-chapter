const { VITE_PATH } = import.meta.env;

export function userOrderApis(request) {
  return {
    sendOrder: (data) =>
      request({
        url: `/api/${VITE_PATH}/order`,
        method: "post",
        data,
      }),
  };
}
