import React, { useState, useEffect } from "react";
import { Panel } from "primereact/panel";
import PropTypes from "prop-types";

import { _get } from "@api/APIClient";
import { useStateUser } from "@hooks/useStateUser";
import { ebConfig } from "@configuration/ebConfig";

import {
  ACHPaymentMethod,
  BluepayHostedPayment,
  CCPaymentMethod,
  SavedCard,
  HostediFrameTokenizer
} from "..";
import { DialogProvider } from "../PaymentMethods/DialogContext";

function SavedPayments({ options }) {
  const [validPayments, setValidPayments] = useState([]);
  const [cards, setCards] = useState([]);
  const user = useStateUser({});
  const personId = user.AuthenticatedPersonId;
  const [showHostedPaymentPanel, setShowHostedPaymentPanel] = useState(false);
  const [showCreditCards, setShowCreditCards] = useState(false);
  const [showACHCards, setShowACHCards] = useState(false);
  const [showTokenizerPaymentPanel, setShowTokenizerPaymentPanel] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  useEffect(() => {
    const getValidPayment = async () => {
      try {
        await _get("/v1/ProfilePersons/" + personId + "/ValidPayments", {
          withCredentials: true
        }).then((responseValidPayment) => {
          setValidPayments(responseValidPayment.data);
        });
        const [creditCardResponse, achResponse] = await Promise.all([
          fetchCreditCardDetails(),
          fetchAchDetails()
        ]);
        const combinedCards = [...creditCardResponse, ...achResponse];
        setCards(combinedCards);
      } catch (error) {
        console.error("An error occurred:", error);
        // Handle error appropriately
      }
    };
    getValidPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personId]);

  useEffect(() => {
    const setPayment = async () => {
      await setPaymentType();
    };
    setPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validPayments]);

  const showMessage = async () => {
    const [creditCardResponse, achResponse] = await Promise.all([
      fetchCreditCardDetails(),
      fetchAchDetails()
    ]);
    const combinedCards = [...creditCardResponse, ...achResponse];
    setCards(combinedCards);
  };
  const fetchCreditCardDetails = async () => {
    try {
      const response = await _get(
        "/v1/ProfilePersons/" + personId + "/SavedPaymentMethods/CreditCard",
        {
          withCredentials: true
        }
      );
      return response.data; // Assuming response.data contains credit card details
    } catch (error) {
      console.error("Error fetching credit card details:", error);
      throw error; // Propagate the error
    }
  };

  //Define a function to fetch ACH details
  const fetchAchDetails = async () => {
    try {
      const response = await _get("/v1/ProfilePersons/" + personId + "/SavedPaymentMethods/ACH", {
        withCredentials: true
      });
      return response.data; // Assuming response.data contains ACH details
    } catch (error) {
      console.error("Error fetching ACH details:", error);
      throw error; // Propagate the error
    }
  };

  const handleDeleteCard = async () => {
    try {
      // setCards(cards.filter(card => card.id !== cardId))
      const [creditCardResponse, achResponse] = await Promise.all([
        fetchCreditCardDetails(),
        fetchAchDetails()
      ]);
      const combinedCards = [...creditCardResponse, ...achResponse];
      setCards(combinedCards);
    } catch (error) {
      console.error("Error deleting card:", error);
      // Handle error appropriately
    }
  };
  const handleUpdateCard = async () => {
    try {
      const [creditCardResponse, achResponse] = await Promise.all([
        fetchCreditCardDetails(),
        fetchAchDetails()
      ]);
      const combinedCards = [...creditCardResponse, ...achResponse];
      setCards(combinedCards);
    } catch (error) {
      console.error("Error Updatingc card:", error);
    }
  };

  const hostedIframeTokenizerOption = {
    payByCreditCardTokenizerURL:
      "/v1/ProfilePersons/" + personId + "/SavedPaymentMethods/CreditCard",
    payByACHTokenizerURL: "/v1/ProfilePersons/" + personId + "/SavedPaymentMethods/ACHTokenizer",
    cardDetailsSchema: {
      cardNumberKey: "creditCardNumber",
      expirationMonthKey: "expirationMonth",
      expirationYearKey: "expirationYear",
      cvvKey: "CVV"
    },
    buttonName: "Add Card",
    handleOnPayment: showMessage,
    paymentFunction: "AddHostediFrameTokenizer"
  };

  const CCOptions = {
    paymentByCCURL: "/v1/ProfilePersons/" + personId + "/SavedPaymentMethods/CreditCard",
    cardDetailsSchema: {
      cardNumberKey: "creditCardNumber",
      expirationMonthKey: "expirationMonth",
      expirationYearKey: "expirationYear",
      cvvKey: "CVV"
    },
    buttonName: "Add Card",
    handleOnPayment: showMessage,
    paymentFunction: "AddCC"
  };

  const bluePayOptions = {
    getRemotePaymentRequestURL:
      "v1/ProfilePersons/" + personId + "/SavedPaymentMethods/GetRemotePaymentRequest",
    processBluepayResponseURL:
      "v1/ProfilePersons/" + personId + "/SavedPaymentMethods/ProcessRemoteResponse",
    body: {
      bluepayHPPCreditCardExpiryMonth: ebConfig.bluepayHPPCreditCardExpiryMonth,
      bluepayHPPCreditCardExpiryYear: ebConfig.bluepayHPPCreditCardExpiryYear
    },
    buttonName: "Add Card",
    handleOnPayment: showMessage,
    paymentFunction: "AddBluePay"
  };

  const ACHOptions = {
    paymentByACHURL: "/v1/ProfilePersons/" + personId + "/SavedPaymentMethods/ACH",
    handleOnPayment: showMessage,
    buttonName: "Add ACH",
    paymentFunction: "AddACH"
  };

  if (options === undefined) {
    options = {
      renderAddPayment: true,
      showSavedCard: true
    };
  }
  const setPaymentType = async () => {
    validPayments.forEach(async (payment) => {
      if (
        payment.PaymentType === "Credit Card" ||
        payment.PaymentType === "Credit Card Reference Transaction"
      ) {
        if (!showHostedPaymentPanel && !showTokenizerPaymentPanel) {
          await setShowCreditCards(true);
        }
      }
      if (
        payment.PaymentType === "Credit Card Hosted Payment Reference Transaction" &&
        payment.IsRemote === true
      ) {
        await setShowHostedPaymentPanel(true);
        await setShowCreditCards(false);
        await setShowTokenizerPaymentPanel(false);
      }
      if (payment.PaymentType === "Wire Transfer") {
        await setShowACHCards(true);
      }
      if (payment.PaymentType === "Hosted iFrame Tokenizer") {
        await setShowTokenizerPaymentPanel(true);
        await setShowCreditCards(false);
        await setShowHostedPaymentPanel(false);
      }
    });
  };

  const onSelectCard = (cardId) => {
    setSelectedCardId(cardId);
  };

  return (
    <>
      <div className={`font-bold text-2xl ${options.showSavedCard ? "eb-border-gray" : ""}`}>
        {options.showSavedCard && (
          <div className="font-bold text-2xl px-3 pt-3 pb-3 border-bottom-1 border-100">
            Saved Payments
          </div>
        )}
        <div className={options.showSavedCard ? "p-3" : ""}>
          {cards.length > 0 && (
            <div className="grid mb-2">
              {cards.map((card, index) => (
                <SavedCard
                  key={index}
                  card={card}
                  onDelete={() => handleDeleteCard(card.Id)}
                  onUpdate={() => handleUpdateCard()}
                  props={options}
                  onSelectCard={onSelectCard}
                  selectedCardId={selectedCardId}
                />
              ))}
            </div>
          )}
          {options.renderAddPayment && showCreditCards && (
            <Panel className="mb-3" header={"Add a Card"} toggleable collapsed>
              <CCPaymentMethod options={CCOptions} />
            </Panel>
          )}
          {options.renderAddPayment && showACHCards && (
            <Panel className="mb-3" header={"Add Bank Account (ACH)"} toggleable collapsed>
              <ACHPaymentMethod options={ACHOptions} />
            </Panel>
          )}
          {options.renderAddPayment && showTokenizerPaymentPanel && (
            <Panel className="mb-3" header={"Hosted Tokenizer"} toggleable collapsed>
              <HostediFrameTokenizer options={hostedIframeTokenizerOption} />
            </Panel>
          )}
          {options.renderAddPayment && showHostedPaymentPanel && (
            <Panel className="mb-3" header={"Hosted"} toggleable collapsed>
              <DialogProvider>
                <BluepayHostedPayment options={bluePayOptions} />
              </DialogProvider>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}

SavedPayments.propTypes = {
  options: PropTypes.object.isRequired
};

export default SavedPayments;
