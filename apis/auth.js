export function authApis(request) {
  return {
    userLogin: (data) =>
      request({
        url: "/admin/signin",
        method: "post",
        data,
      }),
    checkUserLogin: () =>
      request({
        url: "/api/user/check",
        method: "post",
      }),
  };
}
