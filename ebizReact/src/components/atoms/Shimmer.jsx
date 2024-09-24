import PropTypes from "prop-types";
import React from "react";

import "@css/Shimmer.scss";

const ShimmerWrapper = ({ children, border = "noround", className }) => (
  <div className={`${className} shimmer-wrapper`}>
    <div className={`shimmer ${border === "circle" ? "border-circle" : "border-round-" + border}`}>
      {children}
    </div>
  </div>
);

ShimmerWrapper.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.node.isRequired,
  border: PropTypes.oneOf(["noround", "md", "lg", "xs", "2xl", "circle"]),
  className: PropTypes.string
};

export default ShimmerWrapper;
