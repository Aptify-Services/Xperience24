import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { useStateCart } from "@hooks/useStateCart";
import {
  ApplyCouponToShoppingCarts,
  getCartItems,
  getCoupon,
  getSubscriptionGeneralProduct
} from "@store/CartSlice";
import SimpleButton from "@components/atoms/Buttons/SimpleButton";
import CustomInputField from "@components/atoms/TextFields/CustomInputField";

export default function ApplyCoupon() {
  const dispatch = useDispatch();
  const { cart } = useStateCart();
  const { cartItems } = useStateCart();

  const [messagevalue, setmessage] = useState("");
  const [couponcode, setCouponcode] = useState(cart?.couponName || "");
  const [isShownapplycoupon, setIsShownApplyCoupon] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ApplyCouponCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, cart?.couponName]);

  function ApplyCouponCode() {
    if (cart?.couponName != "" || (couponcode != "" && couponcode !== undefined)) {
      setCouponcode(couponcode);
      ValidateCoupon();
      setIsShownApplyCoupon(false);
    } else {
      setIsShownApplyCoupon(true);
    }
  }

  function ValidateCoupon() {
    if (cart?.totalSavings <= 0 && cart?.couponName != "") {
      setmessage("Coupon is valid, but not applicable for the cart items.");
    } else {
      setmessage("Coupon has been applied.");
    }
  }

  function setCoupon(e) {
    setCouponcode(e.target.value);
    if (e.target.value == "") {
      setmessage("");
    }
  }

  const _ApplyCoupon = async () => {
    setmessage("");
    if (couponcode != "" && couponcode != undefined) {
      //True If Coupon code not entered
      const data = {
        CouponCode: couponcode
      };
      setLoading(true);
      await dispatch(getCoupon(data)).then(async (coupondata) => {
        if (coupondata.payload != undefined && coupondata.payload.id > 0) {
          //True if coupon is valid.
          await dispatch(ApplyCouponToShoppingCarts(coupondata.payload.id)).then(async () => {
            await dispatch(getCartItems()).then((cartItemsData) => {
              if (cartItemsData.payload.some((z) => z.isSubscription === true)) {
                dispatch(getSubscriptionGeneralProduct());
              }
            });
          });
        } else {
          setmessage("Coupon is not valid.");
        }
      });
      setLoading(false);
    } else {
      setLoading(false);
      setmessage("Please Enter Coupon Code.");
    }
  };

  const RemoveCoupon = async () => {
    setLoading(true);
    await dispatch(ApplyCouponToShoppingCarts(-1)).then(() => {
      dispatch(getCartItems()).then((cartItemsData) => {
        if (cartItemsData.payload.some((z) => z.isSubscription === true)) {
          dispatch(getSubscriptionGeneralProduct());
        }
        setLoading(false);
        setCouponcode("");
        setmessage("");
        setIsShownApplyCoupon(true);
      });
    });
  };

  return (
    <>
      <form
        className="border-2 border-round-xl border-100 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (isShownapplycoupon) {
            _ApplyCoupon();
          } else {
            RemoveCoupon();
          }
        }}
      >
        {" "}
        <div className="col-12">
          <h4>Add Coupon</h4>
        </div>
        <div className="grid">
          <div className="col-12">
            <div>
              <CustomInputField
                placeholder="Enter Coupon Code"
                isiconpresent={false}
                value={couponcode || cart?.couponName}
                onChange={setCoupon}
                disabled={!isShownapplycoupon}
              />
            </div>
            {messagevalue == "" ? (
              ""
            ) : (
              <small className={`${isShownapplycoupon ? "p-error" : "text-primary"} font-semibold`}>
                {messagevalue}
              </small>
            )}
          </div>
        </div>
        <div className="grid">
          <div className="col-12">
            <div>
              {isShownapplycoupon ? (
                <SimpleButton
                  type="submit"
                  label={"Apply Coupon"}
                  className={"simpleButtonStyle"}
                  loading={loading}
                />
              ) : (
                <SimpleButton
                  type="submit"
                  label={"Remove Coupon"}
                  className={"simpleButtonStyle"}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
