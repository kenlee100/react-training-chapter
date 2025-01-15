/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
export const useAuth = (checkUserLogin, setIsLoading) => {
  // 接收 checkUserLogin 作為參數
  const [isAuth, setIsAuth] = useState(false);

  async function verifyAuth() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!token) {
      setIsAuth(false);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      await checkUserLogin(); // 使用傳入的 checkUserLogin 方法
      setIsAuth(true);
    } catch (error) {
      console.error("驗證錯誤:", error);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    verifyAuth();
  }, []);

  return { isAuth, setIsAuth, verifyAuth };
};
