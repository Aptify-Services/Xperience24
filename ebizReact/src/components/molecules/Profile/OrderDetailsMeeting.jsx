import { Panel } from "primereact/panel";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import { _get } from "@api/APIClient.js";
import { useStateUser } from "@hooks/useStateUser.js";
import { ebConfig } from "@configuration/ebConfig";

function OrderDetailsMeeting(props) {
  const [orderIdDetails, setOrderIdDetails] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const user = useStateUser({});
  const UserId = user.LinkId;
  const currencySymbol = props.currencySymbol;
  const selectedOrderId = props.selectedOrderId;
  const loadDefaultImage = ebConfig.loadDefaultImage;

  useEffect(() => {
    // API Call for just Meeting Products
    const fetchOrderIdItems = async () => {
      const _orderIdDetails = await _get(
        "v1/ProfilePersons/" + UserId + "/OrderHistory/" + selectedOrderId + "/Items/EventProduct",
        {
          withCredentials: true
        }
      );
      const orderIdDetailsResponse = _orderIdDetails.data;
      setOrderIdDetails(orderIdDetailsResponse);
      if (orderIdDetailsResponse) {
        setOrderIdDetails(orderIdDetailsResponse);
        if (orderIdDetailsResponse[0] !== null && orderIdDetailsResponse[0] !== undefined) {
          setOrderDetails(orderIdDetailsResponse[0]);
        }
      }
    };
    fetchOrderIdItems();
  }, [UserId, selectedOrderId]);

  return (
    <>
      {orderDetails !== null && orderDetails.length !== 0 && (
        <div className="col-7 md:col-12 grid my-2 md:mx-1 eb-border-gray">
          <div className="hidden md:block col-3">
            <img style={{ height: 100, width: 100 }} src={""} alt={orderDetails.productName} />
          </div>
          <div className="block md:hidden col-3">
            <img
              style={{ height: 80, width: 80 }}
              src={
                loadDefaultImage
                  ? `${ebConfig.thumbnailImageURL}/coming-soon.png`
                  : `${ebConfig.thumbnailImageURL}/${orderDetails?.productId}${ebConfig.imageExtension}`
              }
              onError={(e) => {
                e.target.src = `${ebConfig.thumbnailImageURL}/coming-soon.png`;
              }}
              alt={orderDetails.productName}
            />
          </div>
          <div className="col-5 md:col-4 p-0 text-sm md:text-base md:pl-0 text-center md:text-left align-content-evenly">
            {orderDetails.productName}
          </div>
          <div className="col-2 p-0 md:col-2 text-sm md:text-base md:pl-0 text-center  md:text-left align-content-evenly">
            {currencySymbol}
            {parseFloat(orderDetails.price).toFixed(ebConfig.roundOffDigitsAfterDecimal || 2)}
          </div>
          <div className="col-2 p-0 text-sm md:text-base md:pl-0 text-center md:text-center align-content-evenly">
            {orderDetails.quantity}
          </div>
        </div>
      )}
      <Panel
        className="md:mx-1 col-7 md:col-12 "
        header={"Currently Attending"}
        toggleable
        collapsed
      >
        {orderIdDetails.map((orderItem) => (
          <div className="grid border-y-1 border-gray-100" key={orderItem?.id}>
            <div className="col-9 text-sm md:text-base">
              {orderItem.description} - {orderItem.webName}
            </div>
            <div className="col-3 text-sm md:text-base">
              {currencySymbol}
              {parseFloat(orderItem.price).toFixed(ebConfig.roundOffDigitsAfterDecimal || 2)}
            </div>
          </div>
        ))}
      </Panel>
    </>
  );
}

OrderDetailsMeeting.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
  selectedOrderId: PropTypes.string.isRequired
};

export default OrderDetailsMeeting;
