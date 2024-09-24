import { Navigate, Outlet } from "react-router-dom";

import { useStateUser } from "@hooks/useStateUser";

const PrivateRoute = () => {
  const user = useStateUser({});
  const isLoggedIn = user?.isUserLoggedIn;

  if (!isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
