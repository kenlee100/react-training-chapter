import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

Pagination.propTypes = {
  pageInfo: PropTypes.shape({
    has_next: PropTypes.bool,
    has_pre: PropTypes.bool,
    total_pages: PropTypes.number,
    current_page: PropTypes.number,
  }),
  changePage: PropTypes.func,
};

function Pagination({ pageInfo, changePage }) {
  const dispatch = useDispatch();
  function handlePage(e, num) {
    e.preventDefault();
    dispatch(changePage({ page: num }));
  }
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className={`page-item ${!pageInfo.has_pre && "disabled"}`}>
          <a
            className="page-link"
            href="/"
            aria-label="Previous"
            onClick={(e) => handlePage(e, pageInfo.current_page - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {[...Array(pageInfo.total_pages).keys()].map((page) => {
          return (
            <li
              className={`page-item ${
                pageInfo.current_page === page + 1 && "active"
              }`}
              key={`page-${page}`}
              onClick={(e) => handlePage(e, page + 1)}
            >
              <a className="page-link" href="#">
                {page + 1}
              </a>
            </li>
          );
        })}
        <li className={`page-item ${!pageInfo.has_next && "disabled"}`}>
          <a
            className="page-link"
            href="#"
            aria-label="Next"
            onClick={(e) => handlePage(e, pageInfo.current_page + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
