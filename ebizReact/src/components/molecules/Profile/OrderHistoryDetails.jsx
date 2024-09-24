import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { _get } from "@api/APIClient";
import { PRODUCT_TYPES } from "@constants";
import { useStateUser } from "@hooks/useStateUser";
import { ebConfig } from "@configuration/ebConfig";

import OrderHistorySubscription from "./OrderHistorySubscription";
import OrderDetailsMeeting from "./OrderDetailsMeeting";

function OrderHistoryDetails(props) {
  const [orderIdDetails, setOrderIdDetails] = useState([]);
  const [orderSubscription, setOrderSubscription] = useState([]);

  const user = useStateUser({});
  const UserId = user.LinkId;
  const loadDefaultImage = ebConfig.loadDefaultImage;
  const selectedRowDetails = props.selectedRowDetails;
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const fetchIsSubscriptionOrders = async () => {
      const orderIdItemsSub = await _get(
        "v1/ProfilePersons/" +
          UserId +
          "/OrderHistory/" +
          props.selectedOrderId +
          "/Items/SubscriptionGeneralProduct",
        {
          withCredentials: true
        }
      );
      const orderIDResponse = orderIdItemsSub.data;
      setOrderSubscription(orderIDResponse);
    };

    const fetchOrderIdItems = async () => {
      const orderIdItems = await _get(
        "v1/ProfilePersons/" + UserId + "/OrderHistory/" + props.selectedOrderId + "/Items",
        {
          withCredentials: true
        }
      );
      const orderIdDetailsResponse = orderIdItems.data;
      if (orderIdDetailsResponse) {
        setOrderIdDetails(orderIdDetailsResponse);
        if (
          orderIdDetailsResponse.length > 0 &&
          orderIdDetailsResponse[0].productCategory === PRODUCT_TYPES.MEETINGS
        ) {
          setFlag(true);
        } else {
          setFlag(false);
        }

        orderIdDetailsResponse.forEach((values) => {
          if (values.isSubscription === true) {
            fetchIsSubscriptionOrders();
            return;
          }
        });
      }
    };
    fetchOrderIdItems();
  }, [UserId, props?.selectedOrderId]);

  return (
    <section className="py-1">
      <div className="grid">
        <div className="col-12 md:col-6 lg:col-8 xl:col-8 px-3">
          <div className="hidden lg:flex grid border-bottom-2 border-100 mt-2">
            <div className="md:col-6 font-semibold">Product</div>
            <div className="md:col-2 font-semibold">Price</div>
            <div className="md:col-2 font-semibold">Quantity</div>
          </div>
          {orderIdDetails.map((orderItem) => (
            <>
              <div className="hidden md:flex grid text-center vertical-align-middle md:pt-2">
                {orderItem?.productCategory !== PRODUCT_TYPES.MEETINGS && (
                  <div className="flex grid my-2 mx-1 w-full eb-border-gray align-content-evenly">
                    <div className="col-3">
                      <img
                        className="eb-cover-image w-full h-7rem block border-round-xl"
                        src={
                          loadDefaultImage
                            ? `${ebConfig.thumbnailImageURL}/coming-soon.png`
                            : `${ebConfig.thumbnailImageURL}/${orderItem?.productId}${ebConfig.imageExtension}`
                        }
                        onError={(e) => {
                          e.target.src = `${ebConfig.thumbnailImageURL}/coming-soon.png`;
                        }}
                        alt={orderItem?.productName}
                      />
                    </div>
                    <Link
                      to={`/product-details/${orderItem?.productId}`}
                      // eslint-disable-next-line react/forbid-component-props
                      style={{ textDecoration: "none", color: "gray" }}
                      className="col-3 p-0 text-left align-content-evenly"
                    >
                      {orderItem?.productName}
                    </Link>
                    <div className="col-2 p-0 align-content-evenly">
                      {selectedRowDetails?.currencySymbol}
                      {parseFloat(orderItem?.price).toFixed(
                        ebConfig.roundOffDigitsAfterDecimal || 2
                      )}
                    </div>
                    <div className="col-1 p-0 text-right align-content-evenly">
                      {orderItem?.quantity}
                    </div>
                    <div className="col-3 p-0 pr-1 text-right align-content-evenly">
                      {orderSubscription.map(
                        (item) =>
                          orderItem?.id === item?.id && (
                            <OrderHistorySubscription orderSubscription={item} key={item?.id} />
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex grid md:hidden text-center vertical-align-middle">
                {orderItem.productCategory !== PRODUCT_TYPES.MEETINGS && (
                  <div className="grid my-2 mx-1 w-7 eb-border-gray align-content-evenly">
                    <div className="col-3">
                      <img
                        style={{ height: 80, width: 80 }}
                        src={
                          loadDefaultImage
                            ? `${ebConfig.thumbnailImageURL}/coming-soon.png`
                            : `${ebConfig.thumbnailImageURL}/${orderItem?.productId}${ebConfig.imageExtension}`
                        }
                        onError={(e) => {
                          e.target.src = `${ebConfig.thumbnailImageURL}/coming-soon.png`;
                        }}
                        alt={orderItem?.productName}
                      />
                    </div>
                    <div className="col-3 p-0 pl-3 text-xs text-left align-content-evenly">
                      {orderItem?.productName}
                    </div>
                    <div className="col-2 p-0 text-xs align-content-evenly">
                      {selectedRowDetails?.currencySymbol}
                      {parseFloat(orderItem?.price).toFixed(
                        ebConfig.roundOffDigitsAfterDecimal || 2
                      )}
                    </div>
                    <div className="col-1 p-0 text-xs text-right align-content-evenly">
                      {orderItem?.quantity}
                    </div>
                    <div className="col-3 p-0 pr-1 text-right align-content-evenly">
                      {orderSubscription.map(
                        (item) =>
                          orderItem?.id === item?.id && (
                            <OrderHistorySubscription orderSubscription={item} key={item?.id} />
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ))}
          {flag === true && (
            <OrderDetailsMeeting
              selectedOrderId={props?.selectedOrderId}
              currencySymbol={selectedRowDetails?.currencySymbol}
            />
          )}
        </div>
        <div className="col-7 ml-2 md:ml-0 md:col-6 lg:col-4 xl:col-4 pt-3 lg:pt-7 lx:pt-7">
          <div className="grid eb-border-gray">
            <div className="col-6 text-sm font-bold">Order Total</div>
            <div className="col-6 text-right text-sm">
              <span>{selectedRowDetails?.currencySymbol}</span>
              {parseFloat(selectedRowDetails?.subTotal).toFixed(
                ebConfig.roundOffDigitsAfterDecimal || 2
              )}
            </div>

            <div className="col-4 text-sm font-bold">Ship To</div>
            <div className="col-8 text-right text-sm">{selectedRowDetails?.shipToName}</div>

            <div className="col-6 text-sm font-bold">Order Type</div>
            <div className="col-6 text-right text-sm">{selectedRowDetails?.orderType}</div>

            <div className="col-4 text-sm font-bold">Tracking Number</div>
            <div className="col-6 text-right text-sm">{selectedRowDetails?.trackingNumber}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

OrderHistoryDetails.propTypes = {
  selectedRowDetails: PropTypes.shape({
    currencySymbol: PropTypes.string.isRequired,
    subTotal: PropTypes.number.isRequired,
    shipToName: PropTypes.string.isRequired,
    orderType: PropTypes.string.isRequired,
    trackingNumber: PropTypes.string.isRequired
  }).isRequired,
  selectedOrderId: PropTypes.string.isRequired
};

export default OrderHistoryDetails;
