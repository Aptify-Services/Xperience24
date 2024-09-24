import { InputNumber } from "primereact/inputnumber";
import PropTypes from "prop-types";
import React from "react";

function CustomInputNumberIncDec(props) {
  return (
    <div>
      <div className="p-inputgroup flex-1">
        <InputNumber
          {...props}
          inputId={props.inputId || "horizontal-buttons"}
          aria-labelledby="cart increment and decrement button"
          aria-label="cart increment and decrement button"
        />
      </div>
    </div>
  );
}

CustomInputNumberIncDec.propTypes = {
  inputId: PropTypes.string
};

export default CustomInputNumberIncDec;
