import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { ebConfig } from "@configuration/ebConfig";
import SimpleButton from "@components/atoms/Buttons/SimpleButton";
import { useStateCart } from "@hooks/useStateCart";

export default function PaymentSummary({ data, selectedBillAdd, selectedShipAdd }) {
  const { cart } = useStateCart();
  const { cartItems } = useStateCart();
  const [proceedFlag, setProceedFlag] = useState(true);
  const cartData = {
    subTotal: data?.cart?.subTotal ?? cart?.subTotal,
    grandTotalBeforeDiscount:
      data?.cart?.grandTotalBeforeDiscount ?? cart?.grandTotalBeforeDiscount,
    totalSavings: data?.cart?.totalSavings ?? cart?.totalSavings,
    tax: data?.cart?.tax ?? cart?.tax,
    shipping: data?.cart?.shipping ?? cart?.shipping,
    handling: data?.cart?.handling ?? cart?.handling,
    currencySymbol: data?.cart?.currencySymbol ?? cart?.currencySymbol,
    shipmentTypeId: data?.cart?.shipmentTypeId ?? cart?.shipmentTypeId,
    shipmentTypeName: data?.cart?.shipmentTypeName ?? cart?.shipmentTypeName
  };

  useEffect(() => {
    if (data.checkoutLabel === "Proceed to Review Order") {
      if (selectedBillAdd === undefined || selectedShipAdd === undefined) {
        setProceedFlag(false);
      } else {
        setProceedFlag(true);
      }
    } else {
      setProceedFlag(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, selectedBillAdd, selectedShipAdd]);

  if (cart != undefined && cartItems != undefined) {
    return (
      <>
        <div className="border-2 border-round-xl border-100 p-3">
          <h4 className="mb-3">Cart Summary</h4>
          <div className="flex justify-content-between mb-2">
            <div>Grand Total:</div>
            <div className="paymentSummaryTextAlign">
              {cartData.currencySymbol}
              {parseFloat(cartData.subTotal + cartData.totalSavings)?.toFixed(
                ebConfig.roundOffDigitsAfterDecimal || 2
              )}
            </div>
          </div>
          <div className="flex justify-content-between mb-2">
            <div>Total Savings:</div>
            <div className="paymentSummaryTextAlign">
              {cartData.currencySymbol}
              {parseFloat(cartData.totalSavings)?.toFixed(ebConfig.roundOffDigitsAfterDecimal || 2)}
            </div>
          </div>
          <div className="flex justify-content-between mb-2">
            <div>Subtotal:</div>
            <div className="paymentSummaryTextAlign">
              {cartData.currencySymbol}
              {parseFloat(cartData.subTotal)?.toFixed(ebConfig.roundOffDigitsAfterDecimal || 2)}
            </div>
          </div>
          <div className="flex justify-content-between mb-2">
            <div>Tax:</div>
            <div className="paymentSummaryTextAlign">
              {cartData.currencySymbol}
              {parseFloat(cartData.tax)?.toFixed(ebConfig.roundOffDigitsAfterDecimal || 2)}
            </div>
          </div>
          {cartData.shipmentTypeName && (
            <div className="flex justify-content-between mb-2">
              <div>Shipment Type:</div>
              <div className="paymentSummaryTextAlign">
                {/* {cartData.shipmentTypeId}, {" "} */}
                {cartData.shipmentTypeName}
              </div>
            </div>
          )}
          <div className="flex justify-content-between mb-2">
            <div>Shipping:</div>
            <div className="paymentSummaryTextAlign">
              {cartData.currencySymbol}
              {parseFloat(cartData.shipping)?.toFixed(ebConfig.roundOffDigitsAfterDecimal || 2)}
            </div>
          </div>
          <div className="flex justify-content-between">
            <div>Handling:</div>
            <div className="paymentSummaryTextAlign">
              {cartData.currencySymbol}
              {parseFloat(cartData.handling)?.toFixed(ebConfig.roundOffDigitsAfterDecimal || 2)}
            </div>
          </div>
          <small className="text-color-secondary mb-2 block">
            Note: Estimated shipping and handling charges. Charges subject to change based on the
            shipping address you select.
          </small>
          <div className="flex justify-content-between mb-2">
            <div>Total:</div>
            <div className="paymentSummaryTextAlign">
              {cartData.currencySymbol}
              {parseFloat(cartData?.grandTotalBeforeDiscount)?.toFixed(
                ebConfig.roundOffDigitsAfterDecimal || 2
              )}
            </div>
          </div>
          <div>
            {!data.hideProceedButton && (
              <SimpleButton
                label={data.checkoutLabel}
                onClick={() => {
                  data.navigateToBilling(cartData);
                }}
                disabled={!proceedFlag}
                className={"w-full mt-3"}
              />
            )}
          </div>
        </div>
      </>
    );
  } else return <></>;
}

PaymentSummary.propTypes = {
  data: PropTypes.shape({
    checkoutLabel: PropTypes.string,
    navigateToBilling: PropTypes.func,
    checkoutButtonTooltip: PropTypes.string,
    hideProceedButton: PropTypes.bool,
    cart: PropTypes.shape({
      id: PropTypes.number,
      orderDate: PropTypes.string,
      orderStatus: PropTypes.string,
      orderType: PropTypes.string,
      paymentType: PropTypes.string,
      totalSavings: PropTypes.number,
      subTotal: PropTypes.number,
      shipping: PropTypes.number,
      handling: PropTypes.number,
      tax: PropTypes.number,
      grandTotalBeforeDiscount: PropTypes.number,
      currencyTypeID: PropTypes.number,
      currencySymbol: PropTypes.string,
      trackingNumber: PropTypes.string,
      shipDate: PropTypes.string,
      shipmentMethod: PropTypes.string,
      shipToName: PropTypes.string,
      shipToAddressID: PropTypes.number,
      shipToLine1: PropTypes.string,
      shipToLine2: PropTypes.string,
      shipToCity: PropTypes.string,
      shipToState: PropTypes.string,
      shipToZipCode: PropTypes.string,
      shipmentTypeId: PropTypes.string,
      shipToCountry: PropTypes.string,
      shipmentTypeName: PropTypes.string,
      billToName: PropTypes.string,
      billToLine1: PropTypes.string,
      billToLine2: PropTypes.string,
      billToCity: PropTypes.string,
      billToState: PropTypes.string,
      billToZipCode: PropTypes.string,
      billToCountry: PropTypes.string
    })
  }),
  selectedBillAdd: PropTypes.string,
  selectedShipAdd: PropTypes.string
};
