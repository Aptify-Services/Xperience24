import { Calendar } from "primereact/calendar";
import PropTypes from "prop-types";
import React from "react";

function CommonDatePicker(props) {
  return (
    <div>
      <Calendar
        {...props}
        ariaLabel={props?.name}
        ariaLabelledBy={props?.name}
        name={props?.name}
      />
    </div>
  );
}

CommonDatePicker.propTypes = {
  dateFormat: PropTypes.string.isRequired, // Date format for the date picker
  showIcon: PropTypes.bool.isRequired, // Whether to show the calendar icon
  name: PropTypes.string.isRequired
};

export default CommonDatePicker;
