import { useContext } from "react";
import { FrontLayoutContext } from "@/contexts/FrontLayoutContext";

export function useFrontLayoutContext() {
  const context = useContext(FrontLayoutContext);
  return context;
}
