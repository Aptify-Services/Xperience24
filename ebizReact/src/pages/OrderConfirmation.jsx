import { Panel } from "primereact/panel";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import { _get } from "@api/APIClient.js";
import { getCart } from "@store/CartSlice";
import { ebConfig } from "@configuration/ebConfig";
import {
  ViewCartCard,
  ViewCartKitItems,
  PaymentSummary,
  SendEmailConfirmation,
  StepNavigation
} from "@components/molecules";
import { useStateUser } from "@hooks/useStateUser.js";
import "@css/Cart.scss";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({});

  const user = useStateUser({});

  const [, setQueryParams] = useState({});
  const [, setCartData] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [paymentSummaryProps, setPaymentSummaryProps] = useState({
    checkoutLabel: "Proceed to Payment",
    navigateToBilling: () => {
      navigate("/Payment");
    },
    hideProceedButton: true,
    cart: {}
  });

  const viewCartCardAdditionalProps = {
    hideButtons: true
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    setQueryParams(params);
    const personId = user.LinkId; //user.LinkId
    const getOrderDetails = async () => {
      const resOrderConfirmation = await _get(
        "/v1/ProfilePersons/" + personId + "/OrderHistory/" + params["orderid"],
        {
          withCredentials: true
        }
      );
      setOrderDetails({ ...resOrderConfirmation.data });
      setCartData({ ...resOrderConfirmation.data });

      const resOrderItemsDetails = await _get(
        "/v1/ProfilePersons/" + personId + "/OrderHistory/" + params["orderid"] + "/items",
        {
          withCredentials: true
        }
      );
      setCartItems(resOrderItemsDetails.data);

      setPaymentSummaryProps({
        ...paymentSummaryProps,
        cart: { ...resOrderConfirmation.data }
      });
      //get cart again to fetch updated/empty cart so that count is displayed correctly on cart icon
      dispatch(getCart());
      setLoading(false);
    };
    getOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.LinkId]);

  function datepublished(_datepublished) {
    const date = new Date(_datepublished);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return formattedDate;
  }

  const sendConfirmationEmailOptions = {
    serviceURL: "v1/ProfilePersons/{id}/OrderHistory/{orderId}/SendConfirmationEmail"
      .replace("{id}", user.LinkId)
      .replace("{orderId}", orderDetails.id)
  };

  return (
    <>
      {!loading && (
        <>
          <div className="eb-container">
            <section>
              <h2 className="my-3">Order Confirmation</h2>
            </section>
            <div className="grid mx-1 md:mx-0">
              <div className="col-12 block md:hidden">
                <StepNavigation pageNumber={3} className="m-0" />
              </div>
              <div className="col-12 md:col-8 eb-border-gray my-2 p-0">
                <div className="eb-border-gray border-noround-bottom p-3">
                  <div className="text-xl font-normal">Thanks,</div>
                  <div className="text-3xl font-semibold">Your Order has been Placed.</div>
                  <div className="text-lg font-normal ">
                    An email confirmation has been sent on your email :{" "}
                    <span className="text-primary">{user.Email}</span>
                  </div>
                </div>
                <div className="grid p-3">
                  <div className="col-12">
                    <div className="grid">
                      <div className="col-12 md:col-6 font-semibold text-xl">
                        Order Number : <span className="text-primary">{orderDetails.id}</span>
                      </div>
                      <div className="col-12 md:col-6 font-semibold text-xl">
                        Order Date:{" "}
                        <span className="text-primary">
                          {datepublished(orderDetails.orderDate)}
                        </span>
                      </div>
                    </div>
                    <div className="font-normal text-md  py-1 text-color-secondary">
                      Customer Number : <span className="font-semibold">{user.LinkId}</span>
                    </div>
                    <div className="font-normal text-md  py-1 text-color-secondary">
                      Payment Type :{" "}
                      <span className="font-semibold">{orderDetails.paymentType}</span>
                    </div>
                    <div className="font-normal text-md  py-1 text-color-secondary">
                      Order Type : <span className="font-semibold">{orderDetails.orderType}</span>
                    </div>
                    <div className="font-normal text-md  py-1 text-color-secondary">
                      Status : <span className="font-semibold">{orderDetails.orderStatus}</span>
                    </div>
                    <div className="font-normal text-md  py-1 text-color-secondary">
                      Shipment Method:{" "}
                      <span className="font-semibold">{orderDetails.shipmentMethod}</span>
                    </div>
                    <div className="font-semibold text-xl my-3">
                      Grand Total :{" "}
                      <span className="text-primary">
                        {orderDetails.currencySymbol}
                        {parseFloat(orderDetails.subTotal).toFixed(
                          ebConfig.roundOffDigitsAfterDecimal || 2
                        )}
                      </span>
                    </div>
                    <div className="grid py-3 pr-1">
                      <div className="col-12 lg:col-6 eb-address-card md:mb-0">
                        <div className="border-100 border-2 border-round-2xl p-3 h-full w-full">
                          <div className="text-lg font-medium mb-2">Billing Address</div>
                          <label className="text-base eb-profile-text-color">
                            {orderDetails.billToName} , {orderDetails.billToLine1},{" "}
                            {orderDetails.billToLine2}, {orderDetails.billToCity},{" "}
                            {orderDetails.billToZipCode}, {orderDetails.billToState},{" "}
                            {orderDetails.billToCountry}
                          </label>
                        </div>
                      </div>
                      <div className="col-12 lg:col-6 eb-address-card  md:mb-0">
                        <div className="border-100 border-2 border-round-2xl p-3 h-full w-full">
                          <div className="text-lg font-medium mb-2">Shipping Address</div>
                          <label className="text-base eb-profile-text-color">
                            {orderDetails.shipToName} , {orderDetails.shipToLine1},{" "}
                            {orderDetails.shipToLine2}, {orderDetails.shipToCity},{" "}
                            {orderDetails.shipToZipCode}, {orderDetails.shipToState},{" "}
                            {orderDetails.shipToCountry}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 p-3">
                    <h3 className="mb-2">Purchased Items</h3>
                    <div>
                      {cartItems
                        .filter((parentitems) => {
                          return parentitems.parentId === -1;
                        })
                        .map((item) => {
                          return (
                            <Panel className="mb-2" key={item?.id}>
                              <ViewCartCard
                                item={item}
                                additionalProps={viewCartCardAdditionalProps}
                              />
                              {cartItems.filter((childitem) => {
                                return childitem.parentId === item.id;
                              }).length > 0 ? (
                                <Panel
                                  header={
                                    "Products Included in Kit (" +
                                    cartItems.filter((childitem) => {
                                      return childitem.parentId === item.id;
                                    }).length +
                                    ")"
                                  }
                                  toggleable
                                  collapsed
                                >
                                  {cartItems
                                    .filter((childitem) => {
                                      return childitem.parentId === item.id;
                                    })
                                    .map((linkitem) => {
                                      return (
                                        <ViewCartKitItems
                                          key={linkitem?.id}
                                          item={linkitem}
                                          fromCart
                                        />
                                      );
                                    })}
                                </Panel>
                              ) : (
                                <></>
                              )}
                            </Panel>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <SendEmailConfirmation options={sendConfirmationEmailOptions} />
              </div>

              <div className="col-12 md:col-4">
                <div className="hidden md:block">
                  <StepNavigation pageNumber={3} className="m-0" disablePreviousSteps />
                </div>
                <PaymentSummary data={paymentSummaryProps} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
