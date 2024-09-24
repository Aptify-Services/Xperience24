import { InputText } from "primereact/inputtext";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";

const CustomInputField = forwardRef((props, ref) => {
  return (
    <div>
      {props.label && (
        <label htmlFor={props.id ?? props.label} className={`${props?.isRequired && "required"}`}>
          {props.label}
        </label>
      )}
      <div className="p-inputgroup flex-1">
        {!!props?.isIconpresent && (
          <span className="p-inputgroup-addon">
            <i className={props.icon} />
          </span>
        )}
        <InputText
          {...props}
          id={props.id ?? props.label}
          className={props.classStyle}
          name={props?.name ?? props?.label}
          aria-label={props?.label}
          ref={ref}
        />
      </div>
    </div>
  );
});

CustomInputField.displayName = "CustomInputField";

CustomInputField.propTypes = {
  icon: PropTypes.string, // Icon class name
  isIconpresent: PropTypes.bool, //Icon class name
  label: PropTypes.string, // Label for the input field
  classStyle: PropTypes.string, // Custom class name for styling the input field
  id: PropTypes.string, // Id for the input field
  name: PropTypes.string,
  isRequired: PropTypes.bool
};

export default CustomInputField;
