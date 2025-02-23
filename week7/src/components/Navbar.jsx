import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

Navbar.propTypes = {
  linkList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      path: PropTypes.string,
    })
  ),
  children: PropTypes.node
};
export default function Navbar({ linkList, children }) {
  return (
    <nav className="sticky-top navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <ul className="navbar-nav">
          {linkList.map((item) => {
            return (
              <li className="nav-item" key={item.title}>
                <NavLink
                  className={({ isActive }) => {
                    return `nav-link ${isActive ? "active" : ""}`;
                  }}
                  to={item.path}
                >
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
        {children}
      </div>
    </nav>
  );
}
