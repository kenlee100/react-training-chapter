import { useContext } from "react";
import { AdminLayoutContext } from "@/contexts/AdminLayoutContext";

export function useAdminLayoutContext() {
  const context = useContext(AdminLayoutContext);
  return context;
}
