import { Checkbox } from "primereact/checkbox";
import PropTypes from "prop-types";
import React from "react";

function CheckBoxGroup(props) {
  return (
    <div>
      {props.options.map((option) => {
        return (
          <div key={option.value} className="flex align-items-center mb-3">
            <Checkbox
              inputId={option.value}
              name="option"
              value={option.value}
              onChange={props.onChange}
              checked={!!props?.value?.find((item) => item?.value === option?.value)?.checked}
            />
            <label htmlFor={option.value} className="ml-2">
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}

CheckBoxGroup.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      // Array of objects representing checkbox options
      label: PropTypes.string.isRequired, // Unique key for each checkbox option
      value: PropTypes.string.isRequired // Name of the checkbox option
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired, // Function to handle checkbox value change
  value: PropTypes.arrayOf(
    PropTypes.shape({
      // Array of objects representing checkbox options
      label: PropTypes.string.isRequired, // Unique key for each checkbox option
      value: PropTypes.string.isRequired, // Name of the checkbox option
      checked: PropTypes.bool.isRequired // Name of the checkbox option
    })
  )
};

export default CheckBoxGroup;
