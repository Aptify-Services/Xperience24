import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import EmptyCartImage from "@assets/images/generic/emptyCart.png";
import EmptyOrdersImage from "@assets/images/generic/emptyOrders.png";
import EmptyProductList from "@assets/images/generic/emptyProductList.png";
import EmptyUnPaidOrdersImage from "@assets/images/generic/unPaidOrders.png";
import AddressNotAvailable from "@assets/images/generic/AddressNotAvailable.png";
import { LABEL_OPTIONS } from "@constants";
import SimpleButton from "@components/atoms/Buttons/SimpleButton";

function EmptyListComponent(props) {
  const [imageURL, setImageURL] = useState(null);
  const [showNavigationButton, setShowNavigationButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.label === LABEL_OPTIONS.EMPTY_CART) {
      setImageURL(EmptyCartImage);
      setShowNavigationButton(true);
    } else if (props.label === LABEL_OPTIONS.EMPTY_ORDER_LIST) {
      setImageURL(EmptyOrdersImage);
      setShowNavigationButton(true);
    } else if (props.label === LABEL_OPTIONS.UNPAID_ORDERS) {
      setImageURL(EmptyUnPaidOrdersImage);
      setShowNavigationButton(false);
    } else if (props.label === LABEL_OPTIONS.NO_PRODUCT_FOUND) {
      setImageURL(EmptyProductList);
      setShowNavigationButton(false);
    } else if (props.label === LABEL_OPTIONS.NO_ADDRESS_AVAILABLE) {
      setImageURL(AddressNotAvailable);
      setShowNavigationButton(false);
    }
  }, [props?.label]);

  function navigateOnButton() {
    navigate("/product-catalog");
  }

  return (
    <div className="grid text-center justify-content-center">
      <div className="col-12">
        <img alt="emptyCart" className="w-5 h-5" src={imageURL} />
      </div>
      <div className="col-12 pt-0">
        <h2>{props.msgDisplay}</h2>
      </div>
      <div className="col-12 md:w-3">
        {showNavigationButton && (
          <SimpleButton text label={props.btnLabel} onClick={() => navigateOnButton()} />
        )}
      </div>
    </div>
  );
}

EmptyListComponent.propTypes = {
  label: PropTypes.oneOf(["EmptyCart", "EmptyOrderList", "unPaidOrders", "NoProductFound"])
    .isRequired,
  msgDisplay: PropTypes.string.isRequired,
  btnLabel: PropTypes.string.isRequired
};

export default EmptyListComponent;
