import { Checkbox } from "primereact/checkbox";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

function OrderHistorySubscription(props) {
  const orderSubscription = props.orderSubscription;
  const [autoRenewFlag, setAutoRenewFlag] = useState(false);

  useEffect(() => {
    setAutoRenewFlag(orderSubscription.autoRenew);
  }, [orderSubscription?.autoRenew]);

  return (
    <div className="p-0">
      <Checkbox
        name="auto_renew"
        id="auto_renew"
        aria-label="auto_renew"
        checked={autoRenewFlag}
        disabled
      />
      <label htmlFor="auto_renew" className="ml-1 text-xs">
        Auto Renew
      </label>
    </div>
  );
}

OrderHistorySubscription.propTypes = {
  orderSubscription: PropTypes.shape({
    autoRenew: PropTypes.bool.isRequired
  }).isRequired
};

export default OrderHistorySubscription;
