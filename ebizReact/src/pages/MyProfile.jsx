import React, { useState } from "react";
import { Sidebar } from "primereact/sidebar";

import { SimpleButton } from "@components/atoms";
import {
  MakeMyPayment,
  OrderHistory,
  ProfileLeftPanel,
  ProfileTabs,
  SavedPayments
} from "@components/molecules";
import { useStateUser } from "@hooks/useStateUser";

function MyProfile() {
  const [selectedPage, setSelectedPage] = useState(1);
  const user = useStateUser({});
  const isLoggedIn = user.isUserLoggedIn;
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <main className="eb-container">
        <div className="grid h-auto">
          <aside className="hidden md:block h-auto mb-0 mt-5 lg:mb-5 col-12 md:col-12 lg:col-3 ">
            <ProfileLeftPanel setSelectedPage={setSelectedPage} setVisible={setVisible} />
          </aside>
          <aside className="block md:hidden w-full mt-5 mx-2">
            <SimpleButton
              className={"w-full"}
              navigatelink={"false"}
              label={"menu items"}
              onClick={() => setVisible(true)}
              outlined
            />
            <Sidebar visible={visible} onHide={() => setVisible(false)}>
              <ProfileLeftPanel setSelectedPage={setSelectedPage} setVisible={setVisible} />
            </Sidebar>
          </aside>
          <article className="mb-5 lg:my-5 col-12 md:col-12 lg:col-9">
            {selectedPage === 1 && isLoggedIn && (
              <div>
                <ProfileTabs />
              </div>
            )}
            {selectedPage === 2 && isLoggedIn && (
              <div>
                <OrderHistory />
              </div>
            )}
            {selectedPage === 3 && isLoggedIn && (
              <div>
                <MakeMyPayment />
              </div>
            )}
            {selectedPage === 4 && isLoggedIn && (
              <div>
                <SavedPayments />
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  );
}

export default MyProfile;
