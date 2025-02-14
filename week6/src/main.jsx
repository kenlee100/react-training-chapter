import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import routes from "@/routes";
import "@/assets/index.scss";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={routes} />
);
