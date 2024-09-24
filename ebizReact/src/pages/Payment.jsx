import { Panel } from "primereact/panel";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import {
  PaymentSummary,
  ACHPaymentMethod,
  BluepayHostedPayment,
  CCPaymentMethod,
  GPayPaymentMethod,
  HostediFrameTokenizer
} from "@components/molecules";
import { DialogProvider } from "@components/molecules/PaymentMethods/DialogContext.jsx";
import { getCart } from "@store/CartSlice.js";
import "@css/Cart.scss";

export default function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const paymentSummaryProps = {
    checkoutLabel: "Proceed to Payment",
    navigateToBilling: () => {
      navigate("/Payment");
    },
    hideProceedButton: true
  };

  const hostedIframeTokenizerOptions = {
    payByCreditCardTokenizerURL: "/v1/ShoppingCarts/Checkout/CreditCard",
    payByACHTokenizerURL: "/v1/ShoppingCarts/Checkout/ACHTokenizer"
  };

  useEffect(() => {
    dispatch(getCart()).then(() => {
      setLoading(false);
    });
  }, [dispatch, loading]);

  return (
    <>
      {!loading && (
        <>
          <div className="eb-container">
            <section>
              <h2 className="my-3">Payment</h2>
            </section>
            <div className="grid">
              <div className="col-12 md:col-8">
                <Panel className="mb-3" header={"Bluepay HPP"} toggleable collapsed>
                  <DialogProvider>
                    <BluepayHostedPayment />
                  </DialogProvider>
                </Panel>
                <Panel className="mb-3" header={"Bank Account (ACH)"} toggleable collapsed>
                  <ACHPaymentMethod />
                </Panel>
                <Panel className="mb-3" header={"Credit Card"} toggleable collapsed>
                  <CCPaymentMethod />
                </Panel>
                <Panel className="mb-3" header={"GPay"} toggleable collapsed>
                  <GPayPaymentMethod />
                </Panel>
                <Panel className="mb-3" header={"CardPointe Tokenizer "} toggleable collapsed>
                  <HostediFrameTokenizer options={hostedIframeTokenizerOptions} />
                </Panel>
              </div>
              <div className="col-12 md:col-4">
                <PaymentSummary data={paymentSummaryProps} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
