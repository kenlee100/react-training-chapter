import { Outlet } from "react-router-dom";
export default function AdminLayout() {
  return (
    <div className="container-fluid">
      <h1>Products</h1>
      <Outlet />
    </div>
  );
}
