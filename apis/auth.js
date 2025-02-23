export function authApis(request) {
  return {
    userLogin: (data) =>
      request({
        url: "/admin/signin",
        method: "post",
        data,
      }),
    userLogout: () =>
      request({
        url: "/logout",
        method: "post",
      }),
    checkUserLogin: () =>
      request({
        url: "/api/user/check",
        method: "post",
      }),
  };
}
