import { useState } from "react";
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
      navigate("/login");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      await checkUserLogin();
      setIsAuth(true);
      navigate("/admin/products");
    } catch (error) {
      console.error("驗證錯誤:", error);
      setIsAuth(false);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }

  return { isAuth, setIsAuth, verifyAuth };
};
