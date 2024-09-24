import { Dropdown } from "primereact/dropdown";
import * as PropTypes from "prop-types";
import React from "react";

function CustomDropdown(props) {
  return (
    <div>
      <Dropdown
        onChange={props.onChange}
        options={props.options}
        optionLabel="name"
        className="w-full md:w-14rem"
        aria-label={props?.name}
        name={props?.name}
        id={props?.name}
        {...props}
      />
    </div>
  );
}

CustomDropdown.propTypes = {
  value: PropTypes.any, // Selected value from the dropdown
  onChange: PropTypes.func, // Function to handle dropdown value change
  options: PropTypes.arrayOf(
    PropTypes.shape({
      // Array of objects representing dropdown options
      name: PropTypes.string.isRequired, // Name of the option to be displayed
      value: PropTypes.any // Value of the option
    })
  ).isRequired,
  name: PropTypes.string
};

export default CustomDropdown;
