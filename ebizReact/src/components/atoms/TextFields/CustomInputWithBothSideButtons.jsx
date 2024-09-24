import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import PropTypes from "prop-types";
import React from "react";

function CustomInputWithBothSideButtons(props) {
  return (
    <div>
      <div className="p-inputgroup flex-1">
        <Button icon={props.icon1} className={props.classDetails1} onClick={props.onClick1} />
        <InputText placeholder={props.label} />
        <Button icon={props.icon2} className={props.classDetails2} onClick={props.onClick2} />
      </div>
    </div>
  );
}

CustomInputWithBothSideButtons.propTypes = {
  icon1: PropTypes.string.isRequired, // Icon class name for the first button
  classDetails1: PropTypes.string, // Custom class name for styling the first button
  onClick1: PropTypes.func, // Click handler for the first button
  icon2: PropTypes.string.isRequired, // Icon class name for the second button
  classDetails2: PropTypes.string, // Custom class name for styling the second button
  onClick2: PropTypes.func, // Click handler for the second button
  label: PropTypes.string // Placeholder text for the input field
};

export default CustomInputWithBothSideButtons;
