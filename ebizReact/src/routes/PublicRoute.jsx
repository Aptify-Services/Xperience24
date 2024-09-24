import PropTypes from "prop-types";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useStateUser } from "@hooks/useStateUser";
import { Login, ProductCatalog } from "@pages";

const PublicRoute = ({ element, ...rest }) => {
  const { pathname } = useLocation();
  const user = useStateUser({});
  const isLoggedIn = user?.isUserLoggedIn;

  if (pathname === "/") {
    return !isLoggedIn ? <Login /> : <ProductCatalog />;
  }

  /**
   * If user is logged in then user should not navigate to signup
   */
  if (isLoggedIn && pathname.includes("signup")) {
    return <Navigate to="/" />;
  }

  return React.cloneElement(element, rest);
};

PublicRoute.propTypes = {
  element: PropTypes.element
};

export default PublicRoute;
