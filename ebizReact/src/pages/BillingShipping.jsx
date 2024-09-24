import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { PaymentSummary, ShippingMethod, StepNavigation } from "@components/molecules/index.jsx";
import { useStateUser } from "@hooks/useStateUser.js";

import Address from "./Addresses.jsx";
import "@css/Cart.scss";

const BillingShipping = () => {
  const navigate = useNavigate();

  const [loading] = useState(false);

  const [rerender] = useState(false);

  const user = useStateUser({});
  const isLoggedIn = user.isUserLoggedIn;

  const paymentSummaryProps = {
    checkoutLabel: "Proceed to Review Order",
    navigateToBilling: () => {
      navigate("/review-order");
    }
  };

  const [selectedBillingAddress, setSelectedBillingAddress] = useState();
  const [selectedShippingAddress, setSelectedShippingAddress] = useState();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate, rerender, selectedBillingAddress]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      {!loading && (
        <>
          <div className="eb-container">
            <section>
              <h2 className="my-3">Select Address</h2>
            </section>
            <div className="col-12 block md:hidden">
              <StepNavigation pageNumber={0} />
            </div>
            {/* Shipment Method dropdown */}
            <div className="mb-3 sm:w-8">
              <ShippingMethod />
            </div>
            <div className="grid">
              <div className="col-12 md:col-8">
                <div>
                  <Address
                    selectedBillAdd={setSelectedBillingAddress}
                    selectedShipAdd={setSelectedShippingAddress}
                  />
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="hidden md:block eb-tab-view">
                  <StepNavigation pageNumber={0} />
                </div>
                <PaymentSummary
                  data={paymentSummaryProps}
                  selectedBillAdd={selectedBillingAddress}
                  selectedShipAdd={selectedShippingAddress}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BillingShipping;
