import { Password } from "primereact/password";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";

import useMutationObserver from "@hooks/useMutationObserver";
import { makeFocusableElementsNonFocusable } from "@utils/accessibilty";

const CustomPasswordField = forwardRef((props, ref) => {
  const { isIconPresent } = props;
  useMutationObserver(makeFocusableElementsNonFocusable, []);

  return (
    <div>
      {props.label && <label htmlFor={props.label}>{props.label}</label>}
      <div className="p-inputgroup flex-1">
        {isIconPresent && (
          <span className="p-inputgroup-addon">
            <i className={isIconPresent} />
          </span>
        )}
        <Password
          className={props.classStyle}
          id={props.label}
          name={props?.label}
          aria-label={props?.label}
          ref={ref}
          {...props}
        />
      </div>
    </div>
  );
});

CustomPasswordField.displayName = "CustomPasswordField";

CustomPasswordField.propTypes = {
  isIconPresent: PropTypes.bool, // Icon class name
  classStyle: PropTypes.string, // Custom class name for styling
  label: PropTypes.string // Label for the input field
};

export default CustomPasswordField;
