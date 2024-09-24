import PropTypes from "prop-types";

const Loader = ({ className }) => {
  return (
    <div className={`eb-loader-wrapper ${className}`}>
      <div className="eb-loader" />
      <div className="loading-text">Loading...</div>
    </div>
  );
};

Loader.propTypes = {
  className: PropTypes.string
};

export default Loader;
