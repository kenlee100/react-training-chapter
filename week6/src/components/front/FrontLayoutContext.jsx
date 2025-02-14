import { useState } from "react";
import PropTypes from "prop-types";
import { FrontLayoutContext } from "@/contexts/FrontLayoutContext";


FrontLayoutProvider.propTypes = {
  children: PropTypes.node
};
export function FrontLayoutProvider({ children }) {
  const [cartList, setCartList] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  
  const contextValue = {
    cartList,
    setCartList,
    isLoading,
    setIsLoading,
  };
  return (
    <FrontLayoutContext.Provider value={contextValue}>
      {children}
    </FrontLayoutContext.Provider>
  );
}
