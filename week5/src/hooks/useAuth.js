/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
export const useAuth = (checkUserLogin, setIsLoading) => {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  async function verifyAuth() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!token) {
      setIsAuth(false);
      navigate("/")
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      await checkUserLogin();
      setIsAuth(true);
      navigate("/products")
    } catch (error) {
      console.error("驗證錯誤:", error);
      setIsAuth(false);
      navigate("/")
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    verifyAuth();
  }, []);

  return { isAuth, setIsAuth, verifyAuth };
};
