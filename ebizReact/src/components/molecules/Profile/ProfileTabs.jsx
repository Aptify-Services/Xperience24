// import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import AddressDetails from "./AddressDetails";
import BasicDetails from "./BasicDetails";
import Membership from "./Membership";
import PhoneDetails from "./PhoneDetails";

function ProfileTabs() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSelectedTab(searchParams.get("tab"));
  }, [searchParams]);

  return (
    <div className="eb-border-gray">
      <div className="eb-profile-text-color font-bold text-2xl px-3 pt-3 pb-3 eb-border-gray border-noround-bottom">
        Profile
      </div>
      <TabView
        activeIndex={Number(selectedTab)}
        className="mx-3"
        panelContainerClassName="p-0"
        onTabChange={(prop) => {
          setSelectedTab(prop?.index);
          setSearchParams({
            tab: prop?.index
          });
        }}
      >
        <TabPanel header="Basic Details">
          <BasicDetails />
        </TabPanel>
        <TabPanel header="Contact Details">
          <PhoneDetails />
        </TabPanel>
        <TabPanel header="Address Details">
          <AddressDetails />
        </TabPanel>
        <TabPanel header="Membership">
          <Membership />
        </TabPanel>
      </TabView>
    </div>
  );
}

export default ProfileTabs;
