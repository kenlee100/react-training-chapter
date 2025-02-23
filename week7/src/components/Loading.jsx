import { useEffect } from "react";
import PropTypes from 'prop-types'

Loading.propTypes = {
  isLoading: PropTypes.bool
}
export default function Loading({ isLoading }) {
  useEffect(() => {
    const body = document.querySelector("body");
    if (isLoading) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }
  }, [isLoading]);
  return (
    <div className={`loading ${isLoading ? "-show" : ""}`}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
