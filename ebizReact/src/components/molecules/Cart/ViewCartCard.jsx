import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { ebConfig } from "@configuration/ebConfig";
import { useToast } from "@context/ToasterProvider";
import {
  incrementQuantity,
  decrementQuantity,
  getCartItems,
  updateItemToCart,
  getCart,
  deleteItemFromCart,
  autorenewcartitem,
  getSubscriptionGeneralProduct
} from "@store/CartSlice";
import "@css/viewCart.scss";
import SimpleButton from "@components/atoms/Buttons/SimpleButton";
import CustomCheckBox from "@components/atoms/CheckBox/CustomCheckBox";
import "@css/Cart.scss";
import { useStateCart } from "@hooks/useStateCart";
import { INPUT_ERRORS } from "@constants";
import { Text } from "@components/atoms";

export default function ViewCartCard({ item, additionalProps }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [prevQnty, setPrevQty] = useState(item?.quantity);
  const [cartItem, setCartItem] = useState(item);
  const [isAutoRenew, setIsAutoRenew] = useState(false);
  const loadDefaultImage = ebConfig.loadDefaultImage;
  const { cart } = useStateCart();
  const { cartSubscriptionGeneralProduct: SubscriptionGeneralProduct } = useStateCart();

  const { showToastSuccess, showToastError, showToastWarn } = useToast();
  const { error } = useSelector((state) => state.cart);

  const defaulterror =
    "Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.";

  useEffect(() => {
    if (error) {
      showToastError({
        summary: "Error Message",
        detail: error.message || defaulterror
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (SubscriptionGeneralProduct.find((z) => z?.id == cartItem?.id) != undefined) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      item = SubscriptionGeneralProduct.find((z) => z?.id == cartItem?.id);
      setIsAutoRenew(item?.autoRenew);
    }
    setCartItem(item);
  }, [item, SubscriptionGeneralProduct]);

  const incrementItemQuantity = (_item) => {
    setCartItem({
      ...cartItem,
      quantity: _item?.quantity + 1
    });
    dispatch(incrementQuantity(_item));
  };
  const decrementItemQuantity = (_item) => {
    if (_item?.quantity === 1) {
      showToastWarn({
        summary: "Warning",
        detail: INPUT_ERRORS.QTY_LESS_THAN_ONE
      });
    } else {
      setCartItem({
        ...cartItem,
        quantity: _item?.quantity - 1
      });
      dispatch(decrementQuantity(_item));
    }
  };

  const removeItemFromCart = async (_item) => {
    setLoading(_item?.id);
    dispatch(deleteItemFromCart(_item)).then(() => {
      dispatch(getCart())
        .then(() => {
          dispatch(getCartItems());
          setLoading(null);
        })
        .then(() => {
          dispatch(getSubscriptionGeneralProduct());
          setLoading(null);
        });
    });
  };
  const updateItemInCart = async (_item) => {
    await dispatch(updateItemToCart(_item))
      .then((response) => {
        setPrevQty(item?.quantity);
        if (!response.error) {
          showToastSuccess({
            summary: "Success",
            detail: "Cart Updated"
          });
        }
      })
      .then(() => {
        dispatch(getCart()).then(() => {
          dispatch(getCartItems());
        });
      });
  };

  function autorenewCheckedBoxHandle(e) {
    setIsAutoRenew(e.checked);
    const data = {
      itemid: cartItem?.id,
      isautoRenew: e?.checked
    };
    dispatch(autorenewcartitem(data)).then(() => {
      dispatch(getSubscriptionGeneralProduct());
    });
  }
  return (
    <>
      {error && <div style={{ color: "red" }}>{error?.errorCode}</div>}
      <div key={`${cartItem?.id}-${cartItem?.productName}`}>
        <div className="grid lg:align-items-center">
          <div className="lg:col-2 col-3">
            <div>
              <Link to={`/product-details/${cartItem?.productId}`}>
                <img
                  alt="product"
                  className="eb-cover-image w-full h-7rem block border-round-xl"
                  src={
                    loadDefaultImage
                      ? `${ebConfig.thumbnailImageURL}/coming-soon.png`
                      : `${ebConfig.thumbnailImageURL}/${cartItem.productId}${ebConfig.imageExtension}`
                  }
                  onError={(e) => {
                    e.target.src = `${ebConfig.thumbnailImageURL}/coming-soon.png`;
                  }}
                />
              </Link>
            </div>
          </div>
          <div className="lg:col-4 col-7">
            <Link to={`/product-details/${cartItem?.productId}`} className="text-900 no-underline">
              <p
                className="font-semibold eb-overflow eb-overflow--single-line"
                title={cartItem?.webName || cartItem?.productName}
              >
                {cartItem?.webName || cartItem?.productName}
              </p>
            </Link>
            {cartItem?.isSubscription && (
              <p className="text-sm text-color-secondary" aria-label={cartItem?.description}>
                <Text>{cartItem?.description}</Text>
              </p>
            )}
            <div>
              {cartItem?.isSubscription ? (
                <>
                  <div className="checkboxColumnStyle flex align-items-center">
                    <CustomCheckBox
                      onChange={autorenewCheckedBoxHandle}
                      checked={isAutoRenew}
                      id="autorenew"
                      label={"Auto Renew?"}
                      className={"text-sm "}
                      disabled={additionalProps?.hideButtons}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="lg:col-2 lg:col-offset-0 col-2">
            {cartItem?.discount > 0 && (
              <label
                className="productsNameStyle"
                aria-label={parseFloat(
                  cartItem["price"] * (1 - cartItem["discount"] / 100)
                )?.toFixed(ebConfig.roundOffDigitsAfterDecimal)}
              >
                <p>
                  {cart?.currencySymbol}
                  {parseFloat(cartItem["price"] * (1 - cartItem["discount"] / 100))?.toFixed(
                    ebConfig.roundOffDigitsAfterDecimal
                  )}
                </p>
              </label>
            )}
            <label
              aria-label={`${cart?.currencySymbol}${cartItem.price}`}
              className={`productsNameStyle  ${cartItem?.discount && "eb-textStrikeThrough"}`}
            >
              <p>
                {cart?.currencySymbol}
                {parseFloat(cartItem.price)?.toFixed(ebConfig.roundOffDigitsAfterDecimal || 2)}
              </p>
            </label>
          </div>

          <div className="lg:col-2 lg:col-offset-0 col-4">
            <div className="cartButtons border-2 border-100 border-round">
              {(additionalProps === undefined || !additionalProps?.hideButtons) &&
                !cartItem?.isSubscription && (
                  <SimpleButton
                    onClick={() => decrementItemQuantity(cartItem)}
                    label={"-"}
                    className="max-w-2rem px-2 py-0"
                    text
                  />
                )}
              <div className="flex-grow-1 text-center white-space-nowrap overflow-hidden text-overflow-ellipsis text-lg">
                {cartItem?.quantity}
              </div>
              {(additionalProps === undefined || !additionalProps?.hideButtons) &&
                !cartItem?.isSubscription && (
                  <SimpleButton
                    onClick={() => incrementItemQuantity(cartItem)}
                    label={"+"}
                    className="max-w-2rem px-2 py-0"
                    text
                  />
                )}
            </div>
          </div>
          <div className="lg:col-2 lg:col-offset-0 col-8">
            <div className="cartButtonContainer flex gap-2">
              {(additionalProps === undefined || !additionalProps?.hideButtons) && (
                <>
                  <SimpleButton
                    onClick={async () => updateItemInCart(cartItem)}
                    className="justify-content-center text-xs p-1"
                    disabled={cartItem.isSubscription || prevQnty == item?.quantity}
                    outlined
                  >
                    <span className="px-2">Update</span>
                  </SimpleButton>

                  <SimpleButton
                    onClick={async () => removeItemFromCart(cartItem)}
                    className="justify-content-center text-xs p-1"
                    outlined
                    loading={cartItem?.id == loading}
                  >
                    <span className="px-2">Remove</span>
                  </SimpleButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ViewCartCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    productName: PropTypes.string.isRequired,
    description: PropTypes.string,
    isSubscription: PropTypes.bool.isRequired,
    autoRenew: PropTypes.bool,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired
  }).isRequired,
  additionalProps: PropTypes.shape({
    hideButtons: PropTypes.bool
  })
};
