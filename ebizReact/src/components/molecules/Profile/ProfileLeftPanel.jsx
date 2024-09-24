import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import PropTypes from "prop-types";

import { useStateUser } from "@hooks/useStateUser";

function ProfileLeftPanel(props) {
  const user = useStateUser({});
  const FirstName = user.FirstName;
  const LastName = user.LastName;
  const [selectedPage, setSelectedPage] = useState(1);
  const name = FirstName + " " + LastName;

  function onClickOperation(item) {
    props.setSelectedPage(item);
    setSelectedPage(item);
    props.setVisible(false);
  }

  useEffect(() => {
    setSelectedPage(props?.selectedTab);
  }, [props?.selectedTab]);

  return (
    <div className="eb-border-gray">
      <div className="text-black font-bold text-base px-3 pt-3 pb-3 eb-border-gray border-noround-bottom capitalize">
        <span className="pi pi-user-edit border-1 border-circle p-2 text-primary text-xl font-medium mr-2" />
        {name}
      </div>
      {selectedPage === 1 && (
        <Button
          className="w-full text-primary font-semibold "
          text
          onClick={() => onClickOperation(1)}
        >
          <span className="pi pi-user px-3" />
          My Profile
        </Button>
      )}
      {selectedPage !== 1 && (
        <Button className="w-full text-black-alpha-90" text onClick={() => onClickOperation(1)}>
          <span className="pi pi-user px-3" />
          My Profile
        </Button>
      )}
      {selectedPage === 2 && (
        <Button
          className="w-full text-primary font-semibold "
          text
          onClick={() => onClickOperation(2)}
        >
          <span className="pi pi-history px-3" />
          Order History
        </Button>
      )}
      {selectedPage !== 2 && (
        <Button
          className="w-full text-black-alpha-90 border-none"
          text
          onClick={() => onClickOperation(2)}
        >
          <span className="pi pi-history px-3" />
          Order History
        </Button>
      )}
      {selectedPage === 3 && (
        <Button
          className="w-full text-primary font-semibold "
          text
          onClick={() => onClickOperation(3)}
        >
          <span className="pi pi-money-bill px-3" />
          Pay Off Orders
        </Button>
      )}
      {selectedPage !== 3 && (
        <Button
          className="w-full text-black-alpha-90 border-none"
          text
          onClick={() => onClickOperation(3)}
        >
          <span className="pi pi-money-bill px-3" />
          Pay Off Orders
        </Button>
      )}
      {selectedPage === 4 && (
        <Button
          className="w-full text-primary font-semibold "
          text
          onClick={() => onClickOperation(4)}
        >
          <span className="pi pi-credit-card px-3" />
          Saved Payments
        </Button>
      )}
      {selectedPage !== 4 && (
        <Button
          className="w-full text-black-alpha-90 border-none"
          text
          onClick={() => onClickOperation(4)}
        >
          <span className="pi pi-credit-card px-3" />
          Saved Payments
        </Button>
      )}
    </div>
  );
}

ProfileLeftPanel.propTypes = {
  setSelectedPage: PropTypes.func.isRequired,
  setVisible: PropTypes.func.isRequired,
  selectedTab: PropTypes.string
};

export default ProfileLeftPanel;
