import { useState } from "react";
import PropTypes from "prop-types";
import { AdminLayoutContext } from "@/contexts/AdminLayoutContext";

AdminLayoutProvider.propTypes = {
  children: PropTypes.node,
};
export function AdminLayoutProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const contextValue = {
    isLoading,
    setIsLoading,
  };
  return (
    <AdminLayoutContext.Provider value={contextValue}>
      {children}
    </AdminLayoutContext.Provider>
  );
}
