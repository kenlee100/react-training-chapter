import { useState } from "react";
import { createRequestInstance } from "@utils/request";
import { authApis } from "@apis/auth";

import axios from "axios";
import { useForm } from "react-hook-form";

import { useAuth } from "@/hooks/useAuth";
export default function LoginPage() {
  const request = createRequestInstance(axios);
  const { userLogin, checkUserLogin } = authApis(request);
  const [isLoading, setIsLoading] = useState(true);
  const { verifyAuth } = useAuth(checkUserLogin, setIsLoading);

  async function formSubmit(data) {
    const { email, password } = data;
    try {
      const res = await userLogin({
        username: email,
        password,
      });
      console.log("登入成功");
      const { token, expired } = res;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      await verifyAuth();
    } catch (error) {
      console.error(error);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
  });
  return (
    <div className="container p-4">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal text-center ">請先登入</h1>
        <div className="col-8">
          <form className="form-signin" onSubmit={handleSubmit(formSubmit)}>
            <div className="mb-3">
              <div className={`form-floating ${errors?.email && "is-invalid"}`}>
                <input
                  type="email"
                  className={`form-control ${errors?.email && "is-invalid"}`}
                  id="username"
                  name="username"
                  placeholder="name@example.com"
                  {...register("email", {
                    required: "Email 為必填",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Email 格式不正確",
                    },
                  })}
                  required
                  autoFocus
                />
                <label htmlFor="username">Email address</label>
              </div>
              {errors?.email && (
                <div className="pt-1 invalid-feedback">
                  {errors?.email?.message}
                </div>
              )}
            </div>
            <div className="mb-2">
              <div
                className={`form-floating ${errors?.password && "is-invalid"}`}
              >
                <input
                  type="password"
                  className={`form-control ${errors?.password && "is-invalid"}`}
                  id="password"
                  name="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "密碼為必填",
                    minLength: {
                      value: 6,
                      message: "至少 6 個字元",
                    },
                  })}
                />
                <label htmlFor="password">Password</label>
              </div>
              {errors?.password && (
                <div className="pt-1 invalid-feedback">
                  {errors?.password?.message}
                </div>
              )}
            </div>
            <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">
              登入
            </button>
          </form>
        </div>
      </div>
      <p className="mt-5 mb-3 text-muted text-center">
        &copy; 2024~∞ - 六角學院
      </p>
    </div>
  );
}
