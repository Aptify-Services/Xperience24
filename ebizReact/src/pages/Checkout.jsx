import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Panel } from "primereact/panel";

import {
  StepNavigation,
  SavedPayments,
  ValidPaymentPanels,
  PaymentSummary,
  PaymentsShimmer
} from "@components/molecules";
import { getCart } from "@store/CartSlice";
import { useStateCart } from "@hooks/useStateCart";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { cart } = useStateCart();

  const paymentSummaryProps = {
    checkoutLabel: "Proceed to Payment",
    navigateToBilling: () => {
      navigate("/Payment");
    },
    hideProceedButton: true
  };

  const navigateToOrderConfirmationHPP = (orderid) => {
    navigate("/order-confirmation?orderid=" + orderid);
  };

  const navigateToOrderConfirmation = (orderid) => {
    navigate("/order-confirmation?orderid=" + orderid);
  };

  const ccPaymentOptions = {
    paymentByCCURL: "/v1/ShoppingCarts/Checkout/CreditCard",
    paymentFunction: "checkout",
    handleOnPayment: navigateToOrderConfirmation,
    cardDetailsSchema: {
      cardNumberKey: "cardNumber",
      expirationMonthKey: "expirationMonth",
      expirationYearKey: "expirationYear",
      saveForFutureUseKey: "saveForFutureUse"
    }
  };

  const achPaymentOptions = {
    paymentByACHURL: "/v1/ShoppingCarts/Checkout/ACH",
    paymentFunction: "checkoutACH",
    handleOnPayment: navigateToOrderConfirmation
  };
  const bluepayHostedPaymentOptions = {
    getRemotePaymentRequestURL: "/v1/ShoppingCarts/Checkout/GetRemotePaymentRequest",
    processBluepayResponseURL: "/v1/ShoppingCarts/Checkout/ProcessRemotePaymentResponse",
    handleOnPayment: navigateToOrderConfirmationHPP
  };

  const hostedIframeTokenizerOptions = {
    payByCreditCardTokenizerURL: "/v1/ShoppingCarts/Checkout/CreditCard",
    payByACHTokenizerURL: "/v1/ShoppingCarts/Checkout/ACHTokenizer",
    paymentFunction: "payByHostediFrameTokenizer",
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
      saveForFutureUseKey: "saveForFutureUse"
    }
  };

  const gPayPaymentOptions = {
    paymentURL: "v1/ShoppingCarts/Checkout/GPay",
    paymentFunction: "payByGPay",
    handleOnPayment: navigateToOrderConfirmation,
    totalPriceToPay: cart?.subTotal
  };

  const poPaymentOptions = {
    paymentByPOURL: "/v1/ShoppingCarts/Checkout/PurchaseOrder",
    handleOnPayment: navigateToOrderConfirmation
  };
  useEffect(() => {
    dispatch(getCart()).then(() => {
      setLoading(false);
    });
  }, [dispatch, loading]);

  const SPMOptions = {
    renderAddPayment: false,
    paymentMethod: "PayCheckout",
    paymentUrl: "/v1/ShoppingCarts/Checkout/SavedPayment",
    handleOnPayment: navigateToOrderConfirmation,
    showSavedCard: false
  };

  const ValidPaymentOptions = {
    bluepayHostedPaymentOptions: bluepayHostedPaymentOptions,
    ccPaymentOptions: ccPaymentOptions,
    achPaymentOptions: achPaymentOptions,
    hostedIframeTokenizerOptions: hostedIframeTokenizerOptions,
    gPayPaymentOptions: gPayPaymentOptions,
    poPaymentOptions: poPaymentOptions
  };

  return (
    <>
      <>
        <div className="eb-container">
          <section>
            <h2 className="my-3">Payment</h2>
          </section>
          <div className="grid">
            <div className="col-12 block md:hidden">
              <StepNavigation pageNumber={2} />
            </div>
            <div className="col-12 md:col-8">
              {loading ? (
                <PaymentsShimmer />
              ) : (
                <>
                  <Panel className="mb-3" header={"Saved Cards"} toggleable collapsed>
                    <SavedPayments options={SPMOptions} />
                  </Panel>
                  <ValidPaymentPanels options={ValidPaymentOptions} />
                </>
              )}
            </div>
            <div className="col-12 md:col-4">
              <div className="hidden md:block">
                <StepNavigation pageNumber={2} />
              </div>
              <PaymentSummary data={paymentSummaryProps} />
            </div>
          </div>
        </div>
      </>
    </>
  );
}
