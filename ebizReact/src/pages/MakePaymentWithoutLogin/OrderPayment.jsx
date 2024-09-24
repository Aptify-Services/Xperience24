import { Panel } from "primereact/panel";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

import { _get } from "@api/APIClient.js";
import { ValidPaymentPanels } from "@components/molecules";

const OrderPayment = () => {
  const location = useLocation();
  const { orderId, personId } = location.state || {};
  const [orderDetails, setOrderDetails] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrderDetails = async () => {
    await _get(
      "v1/OrderDetails/{id}/{orderId}".replace("{id}", personId).replace("{orderId}", orderId),
      {
        withCredentials: true
      }
    )
      .then((orderDetailsData) => {
        setOrderDetails(orderDetailsData.data);
      })
      .catch((error) => {
        console.error("Error in fetching Order details", error);
      });
  };

  const orderDateTemplate = (orderDate) => {
    return new Date(orderDate).toLocaleDateString();
  };

  const navigateToOrderConfirmation = () => {
    navigate("/makePayment/order-confirmation?orderid=" + orderId, {
      state: { orderId, personId }
    });
  };

  const ccPaymentOptions = {
    paymentByCCURL: "v1/OrderDetails/{id}/{orderId}/MakePayment/CreditCard"
      .replace("{id}", personId)
      .replace("{orderId}", orderId),
    paymentFunction: "makeMyPaymentWithoutLogin",
    handleOnPayment: navigateToOrderConfirmation,
    cardDetailsSchema: {
      cardNumberKey: "cardNumber",
      expirationMonthKey: "expirationMonth",
      expirationYearKey: "expirationYear",
      saveForFutureUseKey: "saveForFutureUse",
      isCreditCard: true
    }
  };

  const achPaymentOptions = {
    paymentByACHURL: "v1/OrderDetails/{id}/{orderId}/MakePayment/ACH"
      .replace("{id}", personId)
      .replace("{orderId}", orderId),
    paymentFunction: "makeMyPaymentWithoutLoginACH",
    handleOnPayment: navigateToOrderConfirmation
  };

  const bluepayHostedPaymentOptions = {
    getRemotePaymentRequestURL:
      "/v1/OrderDetails/{id}/{orderId}/MakePayment/GetRemotePaymentRequest"
        .replace("{id}", personId)
        .replace("{orderId}", orderId),
    processBluepayResponseURL: "/v1/OrderDetails/{id}/{orderId}/MakePayment/ProcessRemoteResponse"
      .replace("{id}", personId)
      .replace("{orderId}", orderId),
    handleOnPayment: navigateToOrderConfirmation
  };

  const hostedIframeTokenizerOptions = {
    payByCreditCardTokenizerURL: "/v1/OrderDetails/{id}/{orderId}/MakePayment/CreditCard"
      .replace("{id}", personId)
      .replace("{orderId}", orderId),
    payByACHTokenizerURL: "/v1/OrderDetails/{id}/{orderId}/MakePayment/ACHTokenizer"
      .replace("{id}", personId)
      .replace("{orderId}", orderId),
    paymentFunction: "makePaymentWithoutLoginByHostediFrameTokenizer",
    handleOnPayment: navigateToOrderConfirmation,
    cardDetailsSchema: {
      cardNumberKey: "cardNumber",
      expirationMonthKey: "expirationMonth",
      expirationYearKey: "expirationYear",
      saveForFutureUseKey: "saveForFutureUse"
    },
    achDetailsSchema: {
      accountNumberKey: "accountNumber",
      accountNameKey: "accountName",
      bankKey: "bank",
      abaKey: "aba",
      saveForFutureUseKey: "saveForFutureUse"
    }
  };

  const gPayPaymentOptions = {
    paymentURL: "/v1/OrderDetails/{id}/{orderId}/MakePayment/GPay"
      .replace("{id}", personId)
      .replace("{orderId}", orderId),
    paymentFunction: "makePaymentByGPayWithoutLogin",
    handleOnPayment: navigateToOrderConfirmation,
    totalPriceToPay: orderDetails?.amountDue
  };

  const ValidPaymentOptions = {
    bluepayHostedPaymentOptions: bluepayHostedPaymentOptions,
    achPaymentOptions: achPaymentOptions,
    ccPaymentOptions: ccPaymentOptions,
    hostedIframeTokenizerOptions: hostedIframeTokenizerOptions,
    gPayPaymentOptions: gPayPaymentOptions,
    isMakePaymentWithoutLogin: true,
    personId: personId,
    orderId: orderId
  };

  return (
    <>
      {orderDetails && (
        <div className="eb-container">
          <section>
            <h2 className="my-3">Make Payment</h2>
          </section>
          <section>
            <div className="grid">
              <div className="col-12 md:col-4">
                {orderDetails && (
                  <Panel header="Order Summary" className="md:mb-4">
                    <p className="m-0">
                      <b>Order ID: </b>
                      {orderId}
                    </p>
                    <p className="m-0">
                      <b>Order Date: </b>
                      {orderDateTemplate(orderDetails.orderDate)}
                    </p>
                    <p className="m-0">
                      <b>Amount Due: </b>
                      {orderDetails.currencySymbol.trim() + orderDetails.amountDue}
                    </p>
                  </Panel>
                )}
              </div>
              <div className="col-12 md:col-8">
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <Panel header="Shipping Information" className="text-900 border-round-xl">
                      <p className="m-0">
                        <b>Ship To Name: </b>
                        {orderDetails.shipToName}
                      </p>
                      <p className="m-0">{orderDetails.shipToLine1}</p>
                      <p className="m-0">{orderDetails.shipToLine2}</p>
                      <p className="m-0">
                        {orderDetails.shipToCity !== "" ? orderDetails.shipToCity + ", " : ""}
                        {orderDetails.shipToState} {orderDetails.shipToZipCode}
                      </p>
                      <p className="m-0">{orderDetails.shipToCountry}</p>
                    </Panel>
                  </div>
                  <div className="col-12 md:col-6">
                    <Panel header="Billing Information" className="text-900 border-round-xl">
                      <p className="m-0">
                        <b>Bill To Name: </b>
                        {orderDetails.billToName}
                      </p>
                      <p className="m-0">{orderDetails.billToLine1}</p>
                      <p className="m-0">{orderDetails.billToLine2}</p>
                      <p className="m-0">
                        {orderDetails.billToCity !== "" ? orderDetails.billToCity + ", " : ""}
                        {orderDetails.billToState} {orderDetails.billToZipCode}
                      </p>
                      <p className="m-0">{orderDetails.billToCountry}</p>
                    </Panel>
                  </div>
                </div>
                <ValidPaymentPanels options={ValidPaymentOptions} />
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default OrderPayment;
