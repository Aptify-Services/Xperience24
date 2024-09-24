import { Dialog } from "primereact/dialog";
import { Panel } from "primereact/panel";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { _post } from "@api/APIClient.js";
import { SimpleButton } from "@components/atoms";
import {
  ViewCartCard,
  ViewCartKitItems,
  ApplyCoupon,
  PaymentSummary,
  StepNavigation,
  AddressShimmer,
  CartListShimmer,
  EmptyGenericComponent
} from "@components/molecules";
import { useToast } from "@context/ToasterProvider.jsx";
import { useStateCart } from "@hooks/useStateCart.js";
import { useStateUser } from "@hooks/useStateUser.js";
import { getCart, getCartItems, deleteAllItemFromCart } from "@store/CartSlice.js";
import "@css/Cart.scss";

export default function ReviewOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [billingDetails, setBillingDetails] = useState({});
  const [shippingDetails, setShippingDetails] = useState({});

  const user = useStateUser({});
  const cart = useStateCart();

  const { cartItems: cartItemsState } = useStateCart();

  const isUserLoggedIn = user.isUserLoggedIn;
  const [visibleRemoveAllItemsDialog, setRemoveAllItemsDialog] = useState(false);

  const { showToastError } = useToast();

  const paymentSummaryProps = {
    checkoutLabel: cart.grandTotalBeforeDiscount === 0 ? "Place Order" : "Proceed to Payment",
    navigateToBilling: (cartData) => {
      if (cartData.grandTotalBeforeDiscount === 0) {
        placeZeroPaymentOrder();
      } else {
        navigate("/Checkout");
      }
    },
    checkoutButtonTooltip: "Proceed to Payment Options"
  };

  const placeZeroPaymentOrder = async (postData) => {
    try {
      const ZeroPaymentOrder = await _post("v1/ShoppingCarts/Checkout/ZeroPaymentOrder", postData, {
        withCredentials: true
      });
      if (ZeroPaymentOrder.data) {
        const orderID = ZeroPaymentOrder.data.id;
        navigateToOrderConfirmation(orderID);
      } else {
        showToastError({
          summary: "error",
          detail: "Order did not get placed, please try again.",
          closable: false,
          life: 1200
        });
      }
    } catch (error) {
      console.error("Order did not get placed, please try again:", error);
    }
  };

  const navigateToOrderConfirmation = (orderid) => {
    navigate("/order-confirmation?orderid=" + orderid);
  };

  const navigateToBillingShipping = () => {
    navigate("/billing-shipping");
  };

  useEffect(() => {
    dispatch(getCart()).then((cartData) => {
      mapBillingAddress(cartData.payload);
      mapShippingAddress(cartData.payload);

      function mapBillingAddress(_cartData) {
        setBillingDetails((c) => ({ ...c, ..._cartData }));
      }
      function mapShippingAddress(_cartData) {
        setShippingDetails((c) => ({ ...c, ..._cartData }));
      }

      setLoading(false);
    });

    dispatch(getCartItems()).then((cartData) => {
      mapBillingAddress(cartData.payload);
      mapShippingAddress(cartData.payload);

      function mapBillingAddress(_cartData) {
        setBillingDetails((c) => ({ ...c, ..._cartData }));
      }
      function mapShippingAddress(_cartData) {
        setShippingDetails((c) => ({ ...c, ..._cartData }));
      }

      setLoading(false);
    });
  }, [dispatch, loading]);

  const RemoveAllItems = () => {
    setRemoveAllItemsDialog(true);
  };
  function RemoveAllCartItems() {
    dispatch(deleteAllItemFromCart()).then(() => {
      dispatch(getCart()).then(() => {
        dispatch(getCartItems()).then(() => {
          {
            isUserLoggedIn && <ApplyCoupon />;
          }
          setRemoveAllItemsDialog(false);
        });
      });
    });
  }
  const confirmationFooter = (
    <div>
      <div className="grid">
        <div className="col">
          <SimpleButton
            navigatelink={"false"}
            label={"No"}
            onClick={() => setRemoveAllItemsDialog(false)}
            className={"simpleButtonStyle"}
          />
        </div>
        <div className="col">
          <SimpleButton
            navigatelink={"false"}
            label={"Yes"}
            onClick={() => RemoveAllCartItems()}
            className={"simpleButtonStyle"}
          />
        </div>
      </div>
    </div>
  );

  if (!loading && cartItemsState?.length <= 0) {
    return (
      <EmptyGenericComponent
        label="EmptyCart"
        msgDisplay="Your Cart is Empty"
        btnLabel="Continue Shopping"
      />
    );
  }

  return (
    <>
      <>
        <main>
          <div className="eb-container">
            <section>
              <h2 className="my-3 ml-2">Order Review</h2>
            </section>
            <div className="grid">
              <section className="flex flex-column col-12 md:col-8">
                <div className="col-12 block md:hidden">
                  <StepNavigation pageNumber={1} />
                </div>
                <div className="grid flex-wrap mx-0">
                  {loading && (
                    <>
                      <AddressShimmer />
                      <AddressShimmer />
                    </>
                  )}
                  {!loading && (
                    <>
                      <div className="col-12 lg:col-6">
                        <div className="eb-border-gray p-0 h-full">
                          <div className="font-bold text-md eb-border-gray border-noround-bottom ">
                            <div className="flex flex-row flex-wrap justify-content-between text-center">
                              <span className="px-2 py-3 font-semibold">Billing Adress</span>
                              <div className="flex">
                                <SimpleButton
                                  text
                                  label={"Change"}
                                  onClick={navigateToBillingShipping}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-base font-normal gap-2 py-3 px-2">
                            <label>
                              {billingDetails.billToLine1}
                              {!!billingDetails.billToLine1 && ", "}
                              {billingDetails.billToLine2}
                              {!!billingDetails.billToLine2 && ", "}
                              {billingDetails.billToCity}
                              {!!billingDetails.billToCity && ", "}
                              {billingDetails.billToZipCode}
                              {!!billingDetails.billToZipCode && ", "}
                              {billingDetails.billToState}
                              {!!billingDetails.billToState && ", "}
                              {billingDetails.billToCountry}
                            </label>
                            {/* <span>{billingDetails.billToLine1},&nbsp;</span>
                          <span>{billingDetails.billToLine2},&nbsp;</span>
                          <span>{billingDetails.billToCity},&nbsp;</span>
                          <span>{billingDetails.billToState},&nbsp;</span>
                          <span>{billingDetails.billToCountry}&nbsp;</span>
                          <span>{billingDetails.billToZipCode}&nbsp;</span> */}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 lg:col-6">
                        <div className="eb-border-gray p-0 h-full">
                          <div className="font-bold text-md eb-border-gray border-noround-bottom p-0">
                            <div className="flex flex-row flex-wrap justify-content-between justify-content-center text-center">
                              <span className="px-2 py-3 font-semibold">Shipping Adress</span>
                              <div className="flex">
                                <SimpleButton
                                  text
                                  label={"Change"}
                                  onClick={navigateToBillingShipping}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-base font-normal gap-2 py-3 px-2">
                            <label>
                              {shippingDetails.shipToLine1}
                              {!!shippingDetails.shipToLine1 && ", "}
                              {shippingDetails.shipToLine2}
                              {!!shippingDetails.shipToLine2 && ", "}
                              {shippingDetails.shipToCity}
                              {!!shippingDetails.shipToCity && ", "}
                              {shippingDetails.shipToZipCode}
                              {!!shippingDetails.shipToZipCode && ", "}
                              {shippingDetails.shipToState}
                              {!!shippingDetails.shipToState && ", "}
                              {shippingDetails.shipToCountry}
                            </label>
                            {/* <span>{shippingDetails.shipToLine1},&nbsp;</span>
                          <span>{shippingDetails.shipToLine2},&nbsp;</span>
                          <span>{shippingDetails.shipToCity},&nbsp;</span>
                          <span>{shippingDetails.shipToState},&nbsp;</span>
                          <span>{shippingDetails.shipToCountry},&nbsp;</span>
                          <span>{shippingDetails.shipToZipCode},&nbsp;</span> */}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {loading ? (
                  <CartListShimmer />
                ) : (
                  <div className="col-12">
                    <div className="hidden md:flex grid mt-2">
                      <div className="col-6 text-base font-semibold">Product</div>
                      <div className="col-2 text-base font-semibold">Price</div>
                      <div className="col-2 text-base font-semibold">Quantity</div>
                      {/* <div className="col-2 text-base font-semibold text-right">
                        Total Price
                      </div> */}
                      <div className="col-2 text-base font-semibold">Action</div>
                    </div>
                    {cartItemsState
                      .filter((parentitems) => {
                        return parentitems.parentId === -1;
                      })
                      .map((item) => {
                        return (
                          <div className="border-top-2 border-100 py-2" key={`${item?.id}`}>
                            <ViewCartCard item={item} />
                            {cartItemsState.filter((childitem) => {
                              return childitem.parentId === item.id;
                            }).length > 0 ? (
                              <Panel
                                header={
                                  "Products Included in Kit (" +
                                  cartItemsState.filter((childitem) => {
                                    return childitem.parentId === item.id;
                                  }).length +
                                  ")"
                                }
                                toggleable
                                collapsed
                              >
                                {cartItemsState
                                  .filter((childitem) => {
                                    return childitem.parentId === item.id;
                                  })
                                  .map((linkitem) => {
                                    return (
                                      <ViewCartKitItems
                                        key={linkitem.id}
                                        item={linkitem}
                                        fromCart
                                      />
                                    );
                                  })}
                              </Panel>
                            ) : (
                              <></>
                            )}
                          </div>
                        );
                      })}
                    <div>
                      <SimpleButton
                        onClick={RemoveAllItems}
                        label="Remove All Items"
                        className="font-semibold p-0"
                        link
                      />
                    </div>
                  </div>
                )}
              </section>
              <section className="col-12 md:col-4">
                <div className="w-full">
                  <div className="hidden md:block">
                    <StepNavigation pageNumber={1} />
                  </div>
                  <PaymentSummary data={paymentSummaryProps} />
                </div>
              </section>
              <Dialog
                header="Remove All Items"
                visible={visibleRemoveAllItemsDialog}
                className="w-6"
                onHide={() => setRemoveAllItemsDialog(false)}
                footer={confirmationFooter}
              >
                <p className="m-0">Are you sure you want to remove all the items from your cart?</p>
              </Dialog>
            </div>
          </div>
        </main>
      </>
    </>
  );
}
