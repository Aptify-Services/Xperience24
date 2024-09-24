import { Dialog } from "primereact/dialog";
import { Panel } from "primereact/panel";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import SimpleButton from "@components/atoms/Buttons/SimpleButton.jsx";
import {
  ViewCartCard,
  ViewCartKitItems,
  ApplyCoupon,
  EmptyGenericComponent,
  PaymentSummary,
  RelatedProductWidget,
  CartListShimmer
} from "@components/molecules/index.jsx";
import { useStateUser } from "@hooks/useStateUser.js";
import {
  getCart,
  getCartItems,
  deleteAllItemFromCart,
  getSubscriptionGeneralProduct
} from "@store/CartSlice.js";
import "@css/Cart.scss";
import { useStateCart } from "@hooks/useStateCart";

const Cart = () => {
  const { cart, cartItems: cartItemsState } = useStateCart();

  const [loading, setLoading] = useState(false);
  const user = useStateUser({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserLoggedIn = user.isUserLoggedIn;
  const [visibleRemoveAllItemsDialog, setRemoveAllItemsDialog] = useState(false);

  const paymentSummaryProps = {
    checkoutLabel: "Proceed to Checkout",
    navigateToBilling: () => {
      navigate("/billing-shipping");
    }
  };

  const viewCartCardAdditionalProps = {
    hideButtons: false
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getCart()).then(() => {
      dispatch(getCartItems()).then((cartItemsData) => {
        if (cartItemsData.payload.some((z) => z.isSubscription === true)) {
          dispatch(getSubscriptionGeneralProduct());
        }
        setLoading(false);
      });
    });
  }, [dispatch]);

  const RemoveAllItems = () => {
    setRemoveAllItemsDialog(true);
  };

  function RemoveAllCartItems() {
    setLoading(true);
    dispatch(deleteAllItemFromCart()).then(() => {
      dispatch(getCart()).then(() => {
        dispatch(getCartItems()).then(() => {
          {
            isUserLoggedIn && <ApplyCoupon />;
          }
          setRemoveAllItemsDialog(false);
          setLoading(false);
        });
      });
    });
  }

  const confirmationFooter = (
    <div>
      <div className="flex">
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
            loading={loading}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <main>
        {!loading && cartItemsState?.length <= 0 && (
          <EmptyGenericComponent
            label="EmptyCart"
            msgDisplay="Your Cart is Empty"
            btnLabel="Continue Shopping"
          />
        )}
        <div className="eb-container">
          {(cartItemsState?.length > 0 || loading) && (
            <section>
              <h2 className="my-3">
                Your Cart&nbsp;
                <span className="text-base font-medium">{cart?.numberOfItems}&nbsp;item(s)</span>
              </h2>
            </section>
          )}
          {loading && (
            <div className="md:col-7 lg:col-8 col-12">
              <CartListShimmer />
            </div>
          )}
          {!loading && cartItemsState?.length > 0 && (
            <section className="grid">
              <article className="md:col-7 lg:col-8 col-12">
                <div>
                  <div className="hidden lg:flex grid border-bottom-2 border-100 mt-2">
                    <div className="md:col-6 font-semibold">Product</div>
                    <div className="md:col-2 font-semibold">Price</div>
                    <div className="md:col-2 font-semibold">Quantity</div>
                    <div className="md:col-2 font-semibold">Action</div>
                  </div>
                  {cartItemsState?.length > 0 ? (
                    <>
                      {cartItemsState
                        .filter((parentitems) => {
                          return parentitems.parentId === -1;
                        })
                        .map((item) => {
                          return (
                            <div className="border-bottom-2 border-100 py-2" key={item?.id}>
                              <ViewCartCard
                                item={item}
                                additionalProps={viewCartCardAdditionalProps}
                              />
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
                                          key={linkitem?.id}
                                          item={linkitem}
                                          fromCart
                                        />
                                      );
                                    })}
                                </Panel>
                              ) : (
                                ""
                              )}
                            </div>
                          );
                        })}
                      <section className="flex justify-content-between py-2">
                        <div>
                          <SimpleButton
                            onClick={RemoveAllItems}
                            label="Remove All Items"
                            className="font-semibold p-0"
                            link
                          />
                        </div>
                      </section>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </article>
              <aside className="md:col-5 lg:col-4 col-12 mt-2">
                <div className="md:ml-3">
                  <div className="mb-3">{isUserLoggedIn && <ApplyCoupon />}</div>
                  <PaymentSummary data={paymentSummaryProps} />
                </div>
              </aside>
              <section className="col-12 md:mt-4 mt-2">
                <RelatedProductWidget iscartRelatedProducts />
              </section>
            </section>
          )}
        </div>
      </main>
      <Dialog
        header="Remove All Items"
        visible={visibleRemoveAllItemsDialog}
        // eslint-disable-next-line react/forbid-component-props
        style={{ width: "50vw" }}
        onHide={() => setRemoveAllItemsDialog(false)}
        footer={confirmationFooter}
      >
        <p className="m-0">Are you sure you want to remove all the items from your cart?</p>
      </Dialog>
    </>
  );
};

export default Cart;
