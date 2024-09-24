import { Button } from "primereact/button";
import PropTypes from "prop-types";
import { useState } from "react";

import "@css/ButtonStyle.scss";

function SimpleButton({ ...props }) {
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleOnclick = async (e) => {
    try {
      if (props.onClick) {
        const isPromiseObject = isAsyncFunction(props.onClick);

        if (isPromiseObject) {
          setDisabled(true);
          setLoading(true);
          props.onClick(e).then(() => {
            setDisabled(false);
            setLoading(false);
          });
        } else {
          props.onClick(e);
          setLoading(false);
        }
      }
    } catch (error) {
      setDisabled(false);
    }
  };

  const isAsyncFunction = (v) => Object.prototype.toString.call(v) === "[object AsyncFunction]";

  return (
    <>
      <Button
        {...props}
        className={`${props.className || "simpleButtonStyle"}`}
        type={props.type || "button"}
        onClick={handleOnclick}
        disabled={props.disabled || disabled}
        loading={isLoading || !!props?.loading}
      />
    </>
  );
}

SimpleButton.propTypes = {
  onClick: PropTypes.func, // Function to be called when the button is clicked
  className: PropTypes.string, // CSS class name for styling the button
  type: PropTypes.oneOf(["button", "submit", "reset"]), // Type of the button
  disabled: PropTypes.bool, // Whether the button is disabled or not
  loading: PropTypes.bool
};

export default SimpleButton;
