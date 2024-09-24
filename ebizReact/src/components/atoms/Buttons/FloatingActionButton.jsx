import PropTypes from "prop-types";
import { Button } from "primereact/button";

import "@css/ButtonStyle.scss";

const FloatingActionButton = (props) => {
  //postion
  const position = props.position ?? "right";
  //classes for positions
  const positionClass = {
    left: "floating-button--left",
    right: "floating-button--right"
  };

  return (
    <Button
      icon={`pi ${props?.icon ?? "pi-dollar"}`}
      aria-label="Filter"
      className={`shadow-8 fixed floating-button ${positionClass[position]} ${props?.className}`}
      {...props}
    />
  );
};

FloatingActionButton.propTypes = {
  position: PropTypes.oneOf(["left", "right"]),
  className: PropTypes.string,
  icon: PropTypes.string
};

export default FloatingActionButton;
