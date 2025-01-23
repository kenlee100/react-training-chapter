import { useState } from "react";
import { createRequestInstance } from "@utils/request";
import { authApis } from "@apis/auth";

import axios from "axios";

import { useAuth } from "@/hooks/useAuth";
export default function LoginPage() {
  const request = createRequestInstance(axios);
  const { userLogin, checkUserLogin } = authApis(request);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuth, verifyAuth } = useAuth(checkUserLogin, setIsLoading);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
  return (
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
            <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">
              登入
            </button>
          </form>
        </div>
      </div>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
}
