import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import {
  BluepayHostedPaymentResponse,
  MakeMyPayment,
  OrderHistory,
  ProductDetails,
  ProfileTabs,
  SavedPayments,
  PageNotFound
} from "@components/molecules";
import ProfileTemplate from "@components/templates/ProfileTemplate";
import Root from "@components/templates/Root";
import {
  BillingShipping,
  Cart,
  Checkout,
  OrderPayment,
  PayNow,
  OrderConfirmation,
  Payment,
  ProductCatalog,
  ReviewOrder,
  SignUpComponent,
  OrderConfirmationMPWL
} from "@pages";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute />} />
      <Route path="/signup" element={<PublicRoute element={<SignUpComponent />} />} />
      <Route path="/product-catalog" element={<PublicRoute element={<ProductCatalog />} />} />
      <Route path="/product-details/:id" element={<PublicRoute element={<ProductDetails />} />} />
      <Route path="/cart" element={<PublicRoute element={<Cart />} />} />
      <Route path="/makepayment/paynow" element={<PayNow />} />
      <Route path="/makepayment/order-payment" element={<OrderPayment />} />
      <Route path="/makePayment/order-confirmation" element={<OrderConfirmationMPWL />} />
      <Route path="HostedPaymentResponse.html" element={<BluepayHostedPaymentResponse />} />
      <Route path="*" element={<PageNotFound />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/billing-shipping" element={<BillingShipping />} />
        <Route path="/my" element={<ProfileTemplate />}>
          <Route path="profile" element={<ProfileTabs />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="payoff-order" element={<MakeMyPayment />} />
          <Route path="saved-payments" element={<SavedPayments />} />
        </Route>
        <Route path="/review-order" element={<ReviewOrder />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
    </Route>
  )
);

export default router;
