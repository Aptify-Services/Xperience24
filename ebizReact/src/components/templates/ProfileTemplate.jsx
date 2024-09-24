import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { PROFILE_TABS } from "@constants";
import { ProfileLeftPanel } from "@components/molecules";

function ProfileTemplate() {
  const [selectedTab, setSelectedTab] = useState(1);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checkSelectedTab = useCallback(() => {
    if (pathname.includes(PROFILE_TABS.PROFILE)) {
      setSelectedTab(1);
    } else if (pathname.includes(PROFILE_TABS.ORDER_HISTORY)) {
      setSelectedTab(2);
    } else if (pathname.includes(PROFILE_TABS.PAYOFF_ORDER)) {
      setSelectedTab(3);
    } else if (pathname.includes(PROFILE_TABS.SAVED_PAYMENTS)) {
      setSelectedTab(4);
    }
  }, [pathname]);

  useEffect(() => {
    checkSelectedTab();
  }, [checkSelectedTab, pathname]);

  const navigateToRoute = (tab) => {
    switch (tab) {
      case 1:
        navigate(PROFILE_TABS.PROFILE);
        break;

      case 2:
        navigate(PROFILE_TABS.ORDER_HISTORY);
        break;

      case 3:
        navigate(PROFILE_TABS.PAYOFF_ORDER);
        break;

      case 4:
        navigate(PROFILE_TABS.SAVED_PAYMENTS);
        break;
    }
  };

  return (
    <div>
      <main className="eb-container">
        <div className="grid h-auto">
          <aside className="hidden md:block h-auto mb-0 mt-5 lg:mb-5 col-12 md:col-12 lg:col-3 ">
            <ProfileLeftPanel selectedTab={selectedTab} setSelectedPage={navigateToRoute} />
          </aside>
          <article className="mb-5 mt-4 md:mt-2 lg:my-5 col-12 md:col-12 lg:col-9">
            <Outlet />
          </article>
        </div>
      </main>
    </div>
  );
}

export default ProfileTemplate;
