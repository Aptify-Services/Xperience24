import { Checkbox } from "primereact/checkbox";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

function CustomCheckBox(props) {
  const ref = useRef();
  const _id = props?.id ?? props?.label;

  useEffect(() => {
    const inputElem = ref.current.getInput();
    //set id
    inputElem.id = _id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id, ref.current]);

  return (
    <div className="flex gap-2 text-center">
      <Checkbox
        ref={ref}
        {...props}
        checked={props.checked}
        className="w-auto"
        label={props?.label}
        aria-label={props?.label}
        name={props?.id}
        id={null}
      />
      <label className={props.className} htmlFor={_id}>
        {props.label}
      </label>
    </div>
  );
}

CustomCheckBox.propTypes = {
  checked: PropTypes.bool.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default CustomCheckBox;
