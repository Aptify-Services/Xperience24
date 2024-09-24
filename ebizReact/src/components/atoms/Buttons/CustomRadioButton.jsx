import { RadioButton } from "primereact/radiobutton";
import PropTypes from "prop-types";
import React from "react";

function CustomRadioButton(props) {
  const RadioButtonList = props.RadioList;
  const selectedRadio = props.selectedRadioButton;

  return (
    <div className="card flex justify-content-center">
      <div className="flex flex-column gap-3">
        {RadioButtonList.map((field) => {
          return (
            <div key={field.key} className="flex align-items-center">
              <RadioButton
                inputId={field.key}
                name="category"
                value={field}
                onChange={(e) => props.filterFunction(e.value)}
                checked={selectedRadio === field}
              />
              <label htmlFor={field.key} className="ml-2">
                {field.field}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

CustomRadioButton.propTypes = {
  RadioList: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired, // Unique key for the radio button
      field: PropTypes.string.isRequired // Label for the radio button
    })
  ).isRequired,
  selectedRadioButton: PropTypes.object, // Currently selected radio button
  filterFunction: PropTypes.func.isRequired // Function to be called when a radio button is selected
};

export default CustomRadioButton;
