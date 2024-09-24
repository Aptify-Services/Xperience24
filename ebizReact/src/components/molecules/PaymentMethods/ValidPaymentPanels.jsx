import { Panel } from "primereact/panel";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import { PAYMENT_TYPES } from "@constants";
import { _get } from "@api/APIClient.js";
import { useStateUser } from "@hooks/useStateUser.js";

import ACHPaymentMethod from "./ACHPaymentMethod.jsx";
import BluepayHostedPayment from "./BluepayHostedPayment.jsx";
import CCPaymentMethod from "./CCPaymentMethod.jsx";
import { DialogProvider } from "./DialogContext.jsx";
import GPayPaymentMethod from "./GPayPaymentMethod.jsx";
import HostediFrameTokenizer from "./HostediFrameTokenizer.jsx";
import PurchaseOrder from "./PurchaseOrder.jsx";

export default function ValidPaymentPanels({ options }) {
  const user = useStateUser({});
  let personId = user.AuthenticatedPersonId;
  const [showHostedPaymentPanel, setShowHostedPaymentPanel] = useState(false);
  const [showCreditCards, setShowCreditCards] = useState(false);
  const [showACHCards, setShowACHCards] = useState(false);
  const [showTokenizerPaymentPanel, setShowTokenizerPaymentPanel] = useState(false);
  const [showGPayPanel, setShowGPayPanel] = useState(false);
  const [showBillMeLaterPanel, setShowBillMeLaterPanel] = useState(false);
  const [validPayments, setValidPayments] = useState([]);
  const validPaymentTypesForUser = {
    "Purchase Order": "Purchase Order",
    "Credit Card": "Credit Card",
    "Wire Transfer": "Wire Transfer",
    "Credit Card Reference Transaction": "Credit Card Reference Transaction",
    "Credit Card Hosted Payment Reference Transaction":
      "Credit Card Hosted Payment Reference Transaction",
    "Hosted iFrame Tokenizer": "Hosted iFrame Tokenizer",
    "Google Pay": "Google Pay"
  };
  useEffect(() => {
    const getValidPayment = async () => {
      let url;
      let orderId;
      try {
        if (options.isMakePaymentWithoutLogin) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          personId = options.personId;
          orderId = options.orderId;
          url = "/v1/OrderDetails/" + personId + "/" + orderId + "/ValidPayments";
        } else {
          personId = user.AuthenticatedPersonId;
          url = "/v1/ProfilePersons/" + personId + "/ValidPayments";
        }
        await _get(url, {
          withCredentials: true
        }).then((responseValidPayment) => {
          setValidPayments(responseValidPayment.data);
        });
      } catch (error) {
        console.error("An error occurred:", error);
        // Handle error appropriately
      }
    };
    getValidPayment();
  }, [personId]);

  useEffect(() => {
    const setPayment = async () => {
      await setPaymentType();
    };
    setPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validPayments]);

  const setPaymentType = async () => {
    validPayments.forEach(async (payment) => {
      if (payment.name === validPaymentTypesForUser["Purchase Order"]) {
        await setShowBillMeLaterPanel(true);
      }
      if (
        payment.PaymentType === PAYMENT_TYPES.CREDIT_CARD ||
        payment.PaymentType === PAYMENT_TYPES.CREDIT_CARD_REF_TRANSACTION
      ) {
        if (!showHostedPaymentPanel && !showTokenizerPaymentPanel) {
          await setShowCreditCards(true);
        }
      }
      if (
        payment.PaymentType === PAYMENT_TYPES.CREDIT_CARD_HOSTED_REF_TRANSACTION &&
        payment.IsRemote === true
      ) {
        await setShowHostedPaymentPanel(true);
        await setShowCreditCards(false);
        await setShowTokenizerPaymentPanel(false);
      }
      if (payment.PaymentType === PAYMENT_TYPES.WIRE_TRANSFER) {
        await setShowACHCards(true);
      }
      if (payment.PaymentType === PAYMENT_TYPES.HOSTED_IFRAME_TOKENIZER) {
        await setShowTokenizerPaymentPanel(true);
        await setShowCreditCards(false);
        await setShowHostedPaymentPanel(false);
      }
      if (payment.PaymentType === PAYMENT_TYPES.G_PAY) {
        await setShowGPayPanel(true);
      }
    });
  };

  return (
    <>
      {showHostedPaymentPanel && (
        <Panel className="mb-3" header={"Bluepay HPP"} toggleable collapsed>
          <DialogProvider>
            <BluepayHostedPayment options={options.bluepayHostedPaymentOptions} />
          </DialogProvider>
        </Panel>
      )}

      {showCreditCards && !showTokenizerPaymentPanel && (
        <Panel className="mb-3" header={"Credit Card"} toggleable collapsed>
          <CCPaymentMethod options={options.ccPaymentOptions} />
        </Panel>
      )}
      {showACHCards && !showTokenizerPaymentPanel && (
        <Panel className="my-3" header={"Bank Account (ACH)"} toggleable collapsed>
          <ACHPaymentMethod options={options.achPaymentOptions} />
        </Panel>
      )}
      {showTokenizerPaymentPanel && (
        <Panel className="mb-3" header={"CardPointe Tokenizer "} toggleable collapsed>
          <HostediFrameTokenizer options={options.hostedIframeTokenizerOptions} />
        </Panel>
      )}
      {showGPayPanel && (
        <Panel className="mb-3" header={"GPay"} toggleable collapsed>
          <GPayPaymentMethod options={options.gPayPaymentOptions} />
        </Panel>
      )}

      {showBillMeLaterPanel &&
        !(options?.isMakeMyPaymentPage || options?.isMakePaymentWithoutLogin) && (
          <Panel className="mb-3" header={"Bill me later"} toggleable collapsed>
            <PurchaseOrder options={options.poPaymentOptions} />
          </Panel>
        )}
    </>
  );
}

ValidPaymentPanels.propTypes = {
  options: PropTypes.shape({
    bluepayHostedPaymentOptions: PropTypes.object,
    ccPaymentOptions: PropTypes.object,
    achPaymentOptions: PropTypes.object,
    hostedIframeTokenizerOptions: PropTypes.object,
    gPayPaymentOptions: PropTypes.object,
    poPaymentOptions: PropTypes.object,
    isMakeMyPaymentPage: PropTypes.bool,
    isMakePaymentWithoutLogin: PropTypes.bool,
    personId: PropTypes.string,
    orderId: PropTypes.string
  }).isRequired
};
