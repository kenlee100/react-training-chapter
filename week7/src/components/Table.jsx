import { memo } from "react";
import PropTypes from "prop-types";

Table.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      category: PropTypes.string,
      description: PropTypes.string,
      imageUrl: PropTypes.string,
      imagesUrl: PropTypes.arrayOf(PropTypes.string),
      is_enabled: PropTypes.number,
      origin_price: PropTypes.number,
      price: PropTypes.number,
      title: PropTypes.string,
      unit: PropTypes.string,
      num: PropTypes.number,
    })
  ),
  openProductModal: PropTypes.func,
};

function Table({ products, openProductModal }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>no</th>
          <th>產品名稱</th>
          <th>原價</th>
          <th>售價</th>
          <th>是否啟用</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {products && products.length > 0 ? (
          products.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.origin_price}</td>
              <td>{item.price}</td>
              <td>
                <span
                  className={
                    item.is_enabled ? "text-success" : "text-secondary"
                  }
                >
                  {item.is_enabled ? "啟用" : "未啟用"}
                </span>
              </td>
              <td>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => openProductModal(item, "edit")}
                  >
                    編輯
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => openProductModal(item, "delete")}
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">尚無產品資料</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default memo(Table);
