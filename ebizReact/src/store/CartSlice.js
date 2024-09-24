import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { _delete, _get, _patch, _post, retrieveCSRFTokens } from "@api/APIClient";
import { ebConfig } from "@configuration/ebConfig";

export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async (data, { dispatch, rejectWithValue, getState }) => {
    try {
      const state = getState();
      const cartState = state.cart.cartItems;
      const existingProductIndex = cartState.findIndex((item) => item.productId === data.productId);
      if (existingProductIndex !== -1 && data.productType !== "subscription") {
        //update logic
        const updateDatatoSend = {
          id: cartState[existingProductIndex].id,
          quantity: cartState[existingProductIndex].quantity + data.quantity
        };

        const resUpdateItemToCart = await dispatch(updateItemToCart(updateDatatoSend));
        if (resUpdateItemToCart.error) {
          return resUpdateItemToCart;
        }
        const resGetCartItems = await dispatch(getCartItems());
        return resGetCartItems;
      } else {
        //add logic
        let serviceURL = "";
        const dataToPass = {};
        if (data.productType) {
          switch (data.productType.toLowerCase()) {
            case "general":
            case "publication":
              serviceURL = ebConfig.ServicePathV1 + "/ShoppingCarts/Items/GeneralProduct";
              /*data to pass to service.*/
              dataToPass.productId = data.productId;
              dataToPass.quantity = data.quantity;
              break;
            case "subscription":
              serviceURL =
                ebConfig.ServicePathV1 + "/ShoppingCarts/Items/SubscriptionGeneralProduct";
              /*data to pass to service.*/
              dataToPass.productId = data.productId;
              dataToPass.quantity = data.quantity;
              break;
            case "meeting":
              serviceURL = ebConfig.ServicePathV1 + "/ShoppingCarts/Items/EventProduct";
              /*data to pass to service.*/
              dataToPass.attendeeId = data.attendeeId;
              dataToPass.productId = data.productId;
              break;
          }
        } else {
          throw {
            type: "argument_mismatch",
            message: "Missing item productType as parameter.",
            stack: Error().stack
          };
        }
        const response = await retrieveCSRFTokens();

        // Perform _post call and dispatch getCartItems() when it's finished
        const resAddItem = await _post(serviceURL, dataToPass, {
          withCredentials: true,
          headers: response
        });
        if (resAddItem.error) {
          return resAddItem;
        }

        const resGetCartItems = await dispatch(getCartItems());

        return resGetCartItems;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//Update Shopping Cart {PATCH}
export const updateItemToCart = createAsyncThunk(
  "cart/updateItemToCart",
  async (data, { rejectWithValue }) => {
    try {
      const sequence = data.id;
      const bodyData = {
        quantity: data.quantity
      };
      const updateURL = "/v1/ShoppingCarts/Items/" + sequence + "/GeneralProduct";
      const response1 = await retrieveCSRFTokens();
      const response2 = await _patch(updateURL, bodyData, {
        withCredentials: true,
        headers: response1
      });
      return response2.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//Update Shopping Cart {PATCH}
export const deleteItemFromCart = createAsyncThunk("cart/deleteItemFromCart", async (data) => {
  const sequence = data.id;

  const responseCSRF = await retrieveCSRFTokens();
  const response2 = await _delete("/v1/ShoppingCarts/Items/" + sequence, {
    withCredentials: true,
    headers: responseCSRF
  });
  return response2.data;
});

export const getCart = createAsyncThunk("cart/getCart", async () => {
  try {
    const response = await _get("/v1/ShoppingCarts", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error(error);
  }
});

export const deleteAllItemFromCart = createAsyncThunk("cart/deleteAllItemFromCart", async () => {
  const responseCSRF = await retrieveCSRFTokens();
  const response = await _delete("/v1/ShoppingCarts/Items", {
    withCredentials: true,
    headers: responseCSRF
  });
  return response.data;
});

export const getCartItems = createAsyncThunk("cart/getCartItems", async () => {
  try {
    const response = await _get("/v1/ShoppingCarts/Items", {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
});

export const getSubscriptionGeneralProduct = createAsyncThunk(
  "cart/getSubscriptionGeneralProduct",
  async () => {
    try {
      const response = await _get("/v1/ShoppingCarts/Items/SubscriptionGeneralProduct", {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const autorenewcartitem = createAsyncThunk("cart/autoRenewCartItem", async (data) => {
  try {
    const bodyData = {
      autoRenew: data.isautoRenew
    };
    const response = await _patch(
      "/v1/ShoppingCarts/Items/" + data.itemid + "/SubscriptionGeneralProduct",
      bodyData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
});

export const getCoupon = createAsyncThunk("cart/Coupon", async (data) => {
  try {
    const couponcode = data.CouponCode;
    const response = await _get("/v1/Coupon/" + couponcode, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
});

export const ApplyCouponToShoppingCarts = createAsyncThunk(
  "cart/updateShoppingCarts",
  async (Couponid) => {
    try {
      const bodyData = {
        couponid: Couponid
      };
      const response = await _patch("/v1/ShoppingCarts", bodyData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const updateAddressIdToCart = createAsyncThunk(
  "cart/updateAddressIdToCart",
  async (data) => {
    const bodyData = {
      billingAddressId: data.billingAddressId,
      shippingAddressID: data.shippingAddressID
    };
    const response1 = await retrieveCSRFTokens();
    const response2 = await _patch("/v1/ShoppingCarts", bodyData, {
      withCredentials: true,
      headers: response1
    });

    return response2.data;
  }
);

export const updateShipmentTypeIdToCart = createAsyncThunk(
  "cart/updateShipmentTypeIdToCart",
  async (data) => {
    const bodyData = {
      shipmentTypeId: data
    };
    const csrfHeaders = await retrieveCSRFTokens();
    const response2 = await _patch("/v1/ShoppingCarts", bodyData, {
      withCredentials: true,
      headers: csrfHeaders
    });

    return response2.data;
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {},
    cartItems: [],
    cartSubscriptionGeneralProduct: [],
    error: null,
    loading: false
  },
  reducers: {
    addToCart: (state, action) => {
      const itemPresent = state.cartItems.find((item) => item.id === action.payload.id);
      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    incrementQuantity: (state, action) => {
      const itemPresent = state.cartItems.find((item) => item.id === action.payload.id);
      if (itemPresent) {
        itemPresent.quantity++;
      }
    },
    decrementQuantity: (state, action) => {
      const itemPresent = state.cartItems.find((item) => item.id === action.payload.id);
      if (itemPresent) {
        if (itemPresent.quantity === 1) {
          const items = state.cartItems.filter((item) => item.id !== action.payload.id);
          state.cartItems = items;
        } else {
          itemPresent.quantity--;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addItemsToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(ApplyCouponToShoppingCarts.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(deleteAllItemFromCart.fulfilled, (state) => {
        state.cart = "";
        state.cartItems = [];
        state.cartSubscriptionGeneralProduct = [];
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(getSubscriptionGeneralProduct.fulfilled, (state, action) => {
        state.cartSubscriptionGeneralProduct = action.payload;
      })

      .addCase(updateItemToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(updateItemToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateShipmentTypeIdToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  }
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
