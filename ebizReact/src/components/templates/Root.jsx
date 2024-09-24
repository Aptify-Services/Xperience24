import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";

import { getUserDetails, getUserInformation } from "@store/UserSlice";
import { Header, Loader } from "@components/molecules";
import { useStateUser } from "@hooks/useStateUser";
import { resetFilter } from "@store/ProductCatalogSlice";

const Root = () => {
  const dispatch = useDispatch();
  const user = useStateUser();
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  useEffect(() => {
    async function getUserInfo() {
      await dispatch(getUserInformation(true));
    }
    getUserInfo();
  }, [dispatch]);

  useEffect(() => {
    async function getUserInfo() {
      if (user?.LinkId) {
        await dispatch(getUserDetails(user?.LinkId));
      }
    }
    getUserInfo();
  }, [dispatch, user?.LinkId]);

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  //clear filter if route is other than product
  useEffect(() => {
    if (!pathname.includes("product")) {
      dispatch(resetFilter());
    }
  }, [pathname, dispatch]);

  return (
    <Suspense fallback={<Loader />}>
      <Header />
      <Outlet />
    </Suspense>
  );
};

export default Root;
