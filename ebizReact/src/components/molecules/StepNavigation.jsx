// import React, { useState } from "react";
import { Steps } from "primereact/steps";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StepNavigation(props) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(props.pageNumber || 0);
  const items = [
    {
      label: "Address",
      command: (event) => {
        if (activeIndex > event.index) {
          navigate("/billing-shipping");
        }
      }
    },
    {
      label: "Review",
      command: (event) => {
        if (activeIndex > event.index) {
          navigate("/review-order");
        }
      }
    },
    {
      label: "Payment",
      command: (event) => {
        if (activeIndex > event.index) {
          navigate("/checkout");
        }
      }
    },
    {
      label: "Confirmation"
    }
  ];

  const handleClick = (e) => {
    if (activeIndex > e.index) {
      setActiveIndex(e.index);
    }
  };

  const isClickable = (index) => {
    return index === activeIndex || (!props.disablePreviousSteps && index < activeIndex);
  };

  useEffect(() => {}, []);

  return (
    <div>
      <Steps
        {...props}
        model={items.map((item, index) => ({
          ...item,
          disabled: !isClickable(index)
        }))}
        activeIndex={activeIndex}
        className="mb-2 p-3 border-round-2xl border-2 border-100 text-sm"
        onSelect={(e) => handleClick(e)}
        readOnly={false}
      />
    </div>
  );
}

StepNavigation.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  disablePreviousSteps: PropTypes.bool
};

export default StepNavigation;
