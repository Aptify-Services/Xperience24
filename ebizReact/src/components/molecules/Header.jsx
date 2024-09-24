import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import useMutationObserver from "@hooks/useMutationObserver";
import { addAriaLabelOnCloseButton } from "@utils/accessibilty";
import { useStateUser } from "@hooks/useStateUser";
import { getCart } from "@store/CartSlice";
import { Logout } from "@store/UserSlice";
import SimpleButton from "@components/atoms/Buttons/SimpleButton";
import "@css/Header.scss";
import { useStateCart } from "@hooks/useStateCart";

const Header = () => {
  const { cart } = useStateCart();
  const numberOfItems = cart?.numberOfItems || 0;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useStateUser();
  const isUserLoggedIn = user?.isUserLoggedIn;
  const firstName = user?.FirstName || "";
  const displayName = firstName !== "" ? "Welcome " + firstName : "";

  const navigateToCart = () => {
    navigate("/cart");
  };
  const [logOutDailog, setLogOutDialog] = useState(false);
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  useMutationObserver(addAriaLabelOnCloseButton, [sideBarVisible]);

  useEffect(() => {}, [numberOfItems, firstName]);

  useEffect(() => {
    const fetchCart = async () => {
      dispatch(getCart());
    };
    fetchCart();
  }, [dispatch, user]);

  function logoutHeader() {
    setLoading(true);
    dispatch(Logout())
      .catch((error) => {
        // Handle Logout error
        setLoading(false);
        console.error("Logout failed:", error);
      })
      .then(() => {
        setLoading(false);
        setLogOutDialog(false);
      })
      .then(() => navigate("/"));
  }

  function Login() {
    navigate("/");
  }

  const confirmationFooter = (
    <div className="grid">
      <div className="col">
        <SimpleButton
          navigatelink={"false"}
          label={"No"}
          onClick={() => setLogOutDialog(false)}
          className={"simpleButtonStyle"}
        />
      </div>
      <div className="col">
        <SimpleButton
          navigatelink={"false"}
          label={"Yes"}
          onClick={() => logoutHeader()}
          className={"simpleButtonStyle"}
          loading={loading}
        />
      </div>
    </div>
  );
  const LogOutDailogSet = () => {
    setLogOutDialog(true);
  };

  const onKeyDownLink = (event, link, itemEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (itemEvent) {
        itemEvent();
      } else {
        navigate(link);
      }
      setSideBarVisible(false);
    }
  };

  const itemRenderer = (item) => (
    <div className="p-menuitem-content">
      <Link
        className="flex align-items-center 
        p-menuitem-link no-underline border-bottom-2 
        border-transparent hover:border-primary flex 
        align-items-center px-3 text-primary text-l 
        text-center font-bold"
        to={item.linkpath}
        onClick={() => {
          if (item.event) {
            item?.event();
          }
          setSideBarVisible(false);
        }}
        role="button"
        accessibilityRole="button"
        aria-label={item.shortcut}
        tabIndex={0}
        onKeyDown={(event) => onKeyDownLink(event, item.linkpath, item?.event)}
      >
        <span className={item.icon} />
        <span className="mx-2">{item.label}</span>
        {item.badge && <Badge className="ml-auto" value={item.badge} />}
        {item.shortcut && (
          <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
            {item.shortcut}
          </span>
        )}
      </Link>
    </div>
  );

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigateToCart();
    }
  };

  const items = [
    {
      template: (item, options) => {
        return (
          <button
            onClick={(e) => options.onClick(e)}
            className={
              "w-full p-link flex align-items-center p-2 text-color hover:surface-200 border-noround"
            }
          >
            <Avatar icon="pi pi-user" size="large" className="mr-2" shape="circle" />
            <div className="flex flex-column align">
              Welcome<span className="font-bold">{firstName}</span>
            </div>
          </button>
        );
      }
    },
    {
      separator: true
    },
    {
      label: "Menu",
      items: [
        {
          label: "Home",
          icon: "pi pi-home",
          linkpath: "../",
          template: itemRenderer
        },
        // {
        //   label: "Events",
        //   icon: "pi pi-calendar",
        //   linkpath: "../",
        //   template: itemRenderer
        // },
        {
          label: "Products",
          icon: "pi pi-shopping-bag",
          linkpath: "/product-catalog",
          template: itemRenderer
        },
        {
          label: "View Cart",
          icon: "pi pi-shopping-cart",
          linkpath: "../cart",
          badge: numberOfItems,
          template: itemRenderer
        }
      ]
    },
    !!isUserLoggedIn && {
      label: "Profile",
      items: [
        {
          label: "My Profile",
          icon: "pi pi-user",
          linkpath: "/my/profile",
          template: itemRenderer
        },
        {
          label: "Order History",
          icon: "pi pi-history",
          linkpath: "/my/order-history",
          template: itemRenderer
        },
        {
          label: "Pay Off Orders",
          icon: "pi pi-money-bill",
          linkpath: "/my/payoff-order",
          template: itemRenderer
        },
        {
          label: "Saved Payments",
          icon: "pi pi-credit-card",
          linkpath: "/my/saved-payments",
          template: itemRenderer
        },
        {
          label: isUserLoggedIn ? "Logout" : "Login",
          icon: isUserLoggedIn ? "pi pi-sign-out" : "pi pi-sign-in",
          event: isUserLoggedIn ? LogOutDailogSet : "",
          template: itemRenderer
        }
      ]
    }
  ];
  return (
    <>
      <header className="header sticky top-0 z-5">
        <div className="flex eb-container">
          {/* Website Title */}
          <Link to={"/"} className="no-underline">
            <h1 className="text-primary my-2">e-Business</h1>
          </Link>
          <ul className="hidden md:flex my-0 list-none">
            <li className="flex">
              {/* Tabs */}
              <Link
                className="no-underline border-bottom-2
                 border-transparent hover:border-primary 
                 flex align-items-center px-3 text-primary
                  text-l text-center font-bold"
                to={"../"}
              >
                <span>Home</span>
              </Link>
            </li>
            {/* <li className="flex">
              <Link
                className="no-underline border-bottom-2
                 border-transparent hover:border-primary flex 
                 align-items-center px-3 text-primary text-l
                  text-center font-bold"
                to={"../"}
              >
                <span>Events</span>
              </Link>
            </li> */}
            <li className="flex">
              <Link
                className="no-underline border-bottom-2
                 border-transparent hover:border-primary 
                 flex align-items-center px-3 text-primary 
                 text-l text-center font-bold"
                to={"/product-catalog"}
              >
                <span>Products</span>
              </Link>
            </li>
          </ul>
          <div className="ml-auto hidden md:flex align-items-center">
            {/* {" "} */}
            {!!firstName && (
              <Link className="no-underline" to={"/my/profile"} aria-label={displayName}>
                <span className="text-primary ml-5 text-l text-center font-bold capitalize">
                  {displayName}
                </span>
              </Link>
            )}
            {/* {" "} */}
          </div>
          {/* Logout button only visible when logged in */}
          {isUserLoggedIn && (
            <div className="hidden lg:block ml-auto lg:ml-3 align-content-center">
              <Button
                onClick={LogOutDailogSet}
                label="Logout"
                text
                className="text-l text-center"
              />
            </div>
          )}
          {!isUserLoggedIn && (
            <div className="hidden lg:block ml-auto lg:ml-3 align-content-center">
              <Button onClick={Login} label="Login" text className="text-l text-center" />
            </div>
          )}

          {/* Shopping cart */}
          <div className="ml-auto md:ml-3 align-content-center" style={{ position: "relative" }}>
            <i
              tabIndex="0"
              className="pi pi-shopping-cart p-overlay-badge text-primary small cursor-pointer text-2xl"
              onClick={navigateToCart}
              role="button"
              onKeyDown={handleKeyDown}
              aria-label={`Shopping cart with ${numberOfItems} items`}
            >
              <Badge value={numberOfItems} />
            </i>
          </div>
          <div className="ml-4 align-content-center lg:hidden">
            <Button
              aria-label="Menu"
              id="Menu"
              title="Menu"
              role="button"
              icon="pi pi-bars"
              onClick={() => setSideBarVisible(true)}
            />
          </div>
        </div>
      </header>
      {/* For Mobile view Sidebar Links*/}
      <Sidebar visible={sideBarVisible} onHide={() => setSideBarVisible(false)} position="right">
        <div className="card flex justify-content-center">
          <Menu model={items} className="w-full" />
        </div>
      </Sidebar>
      <Dialog
        header="Logout"
        visible={logOutDailog}
        className="w-6"
        breakpoints={{ "991px": "75vw", "767px": "95vw" }}
        onHide={() => setLogOutDialog(false)}
        footer={confirmationFooter}
      >
        <p className="m-0">Are you sure you want to log out?</p>
      </Dialog>
    </>
  );
};

export default Header;
