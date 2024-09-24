import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import PropTypes from "prop-types";

import useMutationObserver from "@hooks/useMutationObserver";
import { addAriaLabelOnCloseButton, addAriaLabelOnExpandIcon } from "@utils/accessibilty";
import { CommonIconButtonComponent, CustomInputField, SimpleButton } from "@components/atoms";
import { _delete, _patch, _post } from "@api/APIClient";
import { ebConfig } from "@configuration/ebConfig";
import { useStateUser } from "@hooks/useStateUser";
import { useToast } from "@context/ToasterProvider.jsx";
import LoadingSpinner from "@components/atoms/LoadingSpinner.jsx";

const SavedCard = ({ card, onDelete, onUpdate, props, onSelectCard, selectedCardId }) => {
  const [visibleDeletedDialog, setDeleteDialogVisible] = useState(false);
  const [visibleEditDialog, setEditDialogVisible] = useState(false);
  const [, setEditedCard] = useState(card);
  const [, setSelectedRadio] = useState(null);
  const [cvv, setCvv] = useState("");
  const lastFourDigits = card.partialNumber.slice(-4);
  const user = useStateUser({});
  const personId = user.AuthenticatedPersonId;

  const { showToastError, showToastSuccess } = useToast();

  const [loading, setLoading] = useState(false);

  const defaultDeleteErrorMsg =
    "There was some problem deleting your card, please contact customer support for further assistance.";

  useMutationObserver(addAriaLabelOnCloseButton, [
    visibleDeletedDialog,
    visibleEditDialog,
    card.paymentType
  ]);
  useMutationObserver(addAriaLabelOnExpandIcon, [
    visibleDeletedDialog,
    visibleEditDialog,
    card.paymentType
  ]);
  const monthOptions = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" }
  ];
  const yearOptions = ebConfig.expirationYearOptions;

  const [formData, setFormData] = useState({
    // Initialize your form fields here
    // For example:
    cardNumber: card.partialNumber,
    expirationMonth: card.expirationMonth + "",
    expirationYear: card.expirationYear + "",
    accountNumber: card.accountNumber,
    accountName: card.accountName,
    bank: card.bank,
    routingNumber: card.ABA,
    bankName: card.bank
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditDialog = () => {
    setEditedCard(card); // Populate the edited card details
    setEditDialogVisible(true); // Open the edit dialog
  };

  const handleCloseEditDialog = () => {
    setEditDialogVisible(false); // Close the edit dialog
  };

  const handleUpdateCard = async () => {
    try {
      setLoading(true);
      let url = "";
      let cardData = {};
      if (
        card.paymentType.toLowerCase() !== "ach" &&
        card.paymentType.toLowerCase() !== "ach hosted" &&
        card.paymentType.toLowerCase() !== "ach cardpointe"
      ) {
        cardData = {
          expirationMonth: formData.expirationMonth,
          expirationYear: formData.expirationYear
        };
        url = "/v1/ProfilePersons/" + personId + "/SavedPaymentMethods/CreditCard/" + card.Id;
      } else {
        cardData = {
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
          bank: formData.bank,
          aba: formData.routingNumber
        };
        url = "v1/ProfilePersons/" + personId + "/SavedPaymentMethods/ACH/" + card.Id;
      }
      const response = await _patch(url, cardData, {
        withCredentials: true
      });
      // Close the edit dialog after successful update
      setEditDialogVisible(false);
      if (response.status === 200) {
        onUpdate();
      }
      // You might want to update the card list in the parent component after updating the card details
    } catch (error) {
      showToastError({
        severity: "error",
        sticky: false,
        summary: "Error Message",
        detail:
          error.message != undefined && error.type != undefined
            ? error.type + ": " + error.message
            : error.message,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const footerContent = (
    <div>
      <SimpleButton
        // className="createAccountButtonStyle"
        navigateLink={"false"}
        label={"Save Card"}
        // onClick={() => setDialogVisible(false)}
        onClick={handleUpdateCard}
        className={"simpleButtonStyle"}
      />
    </div>
  );
  const confirmationFooter = (
    <div>
      <div className="grid">
        <div className="col-6">
          <SimpleButton
            // className="createAccountButtonStyle"
            navigateLink={"false"}
            label={"No"}
            onClick={() => setDeleteDialogVisible(false)}
            className={"w-full"}
          />
        </div>
        <div className="col-6">
          <SimpleButton
            // className="createAccountButtonStyle"
            navigateLink={"false"}
            label={"Yes"}
            onClick={async () => YesDeleteCardInfo()}
            className={"w-full"}
          />
        </div>
      </div>
    </div>
  );

  async function YesDeleteCardInfo() {
    setLoading(true);
    const deleteCard = async () => {
      const response = await _delete(
        "v1/ProfilePersons/" + personId + "/SavedPaymentMethods/" + card.Id,
        {
          withCredentials: true
        }
      ).catch((error) => {
        showToastError({
          severity: "error",
          sticky: false,
          summary: "Error Message",
          detail:
            error?.message != undefined && error?.type != undefined
              ? error.type + ": " + (error.message ? error.message : defaultDeleteErrorMsg)
              : error.message || defaultDeleteErrorMsg,
          life: 3000
        });
      });
      if (response?.status === 204) {
        onDelete();
        showToastSuccess({
          summary: "Success",
          detail: "Your Card details have been deleted successfully."
        });
      }
    };
    await deleteCard();

    setDeleteDialogVisible(false);
    setLoading(false);
  }

  function handleDeleteDialog() {
    setDeleteDialogVisible(true);
  }

  const PayMakeMyPayment = async (cardId) => {
    const selectedOutstandingOrders = props.selectedOutstandingOrders;

    if (selectedOutstandingOrders.length > 0) {
      const paymentPromises = selectedOutstandingOrders.map(async (order) => {
        const data = {
          SavedPaymentId: cardId,
          isSavedCard: true
        };
        if (cvv !== "") {
          data.CVV = cvv;
        }

        const url = props.paymentUrl;
        data.paymentAmount = order.PayAmount;
        return _post(url.replace("{orderId}", order.OrderId), data, {
          withCredentials: true
        })
          .then((response) => {
            showToastSuccess({
              summary: "Success",
              detail: "Payment successful."
            });
            return response;
          })
          .catch((error) => {
            showToastError({
              severity: "error",
              sticky: false,
              summary: "Error Message",
              detail:
                error.message != undefined && error.type != undefined
                  ? error.type + ": " + error.message
                  : error.message,
              life: 3000
            });
          });
      });

      try {
        await Promise.all(paymentPromises);
        props.handleOnPayment();
      } catch (error) {
        console.error("One or more payments failed", error);
      }
    } else {
      showToastError({
        summary: "Error Message",
        detail: "Please select orders to pay off.",
        life: 3000
      });
    }
  };
  const PayCheckout = async (cardId) => {
    const data = {
      SavedPaymentId: cardId
    };
    if (cvv !== "") {
      data.CVV = cvv;
    }
    const url = props.paymentUrl;
    await _post(url, data, {
      withCredentials: true
    })
      .then((response) => {
        props.handleOnPayment(response.data.id);
        return response;
      })
      .catch((error) => {
        showToastError({
          severity: "error",
          sticky: false,
          summary: "Error Message",
          detail:
            error.message != undefined && error.type != undefined
              ? error.type + ": " + error.message
              : error.message,
          life: 3000
        });
      });
  };
  const payNow = async (cardId) => {
    setLoading(true);
    if (props.paymentMethod === "PayCheckout") {
      await PayCheckout(cardId);
    }
    if (props.paymentMethod === "PayMakeMyPayment") {
      await PayMakeMyPayment(cardId);
    }
    setLoading(false);
  };

  const handleRadioChange = () => {
    onSelectCard(card.Id);
  };
  useEffect(() => {
    // Handle the case where the radio button should be unchecked if the other is selected
    if (selectedCardId !== card.Id) {
      setSelectedRadio(null);
    }
  }, [card.Id, selectedCardId]);

  return (
    <>
      <div className={`flex ${props.renderAddPayment ? "md:col-6" : "md:col-12"} lg:col-6 col-12`}>
        <div className="card border-round-2xl border-2 border-100 p-3 w-full">
          {loading && <LoadingSpinner />}
          <div className="card-details">
            <div className="grid align-items-center">
              <div className="col-8 flex align-items-center card-type text-xl text-900">
                {!props.renderAddPayment && (
                  <RadioButton
                    className="mr-2"
                    inputId={card.Id}
                    value={card.Id}
                    onChange={handleRadioChange}
                    checked={selectedCardId === card.Id}
                    aria-label="Radio Button to Select Payment"
                  />
                )}
                {card.paymentType.toLowerCase() !== "ach" &&
                  card.paymentType.toLowerCase() !== "ach hosted" &&
                  card.paymentType.toLowerCase() !== "ach cardpointe" &&
                  `${card.paymentType}`}
                {(card.paymentType.toLowerCase() === "ach" ||
                  card.paymentType.toLowerCase() === "ach hosted" ||
                  card.paymentType.toLowerCase() === "ach cardpointe") &&
                  "Bank Account (ACH)"}
              </div>
              <div className="col-4 flex justify-content-end">
                <CommonIconButtonComponent
                  className="eb-icon-only-btn mr-2"
                  icon={"pi pi-pencil"}
                  rounded
                  outlined
                  size="small"
                  aria-label={"Edit payment deatils"}
                  //</Col>onClick={() => handleDialog(address, index)}
                  onClick={handleEditDialog}
                />
                <CommonIconButtonComponent
                  aria-label={"delete payment deatils"}
                  className="eb-icon-only-btn"
                  icon={"pi pi-trash"}
                  size="small"
                  rounded
                  outlined
                  onClick={() => handleDeleteDialog()}
                />
              </div>
            </div>
            {(card.paymentType.toLowerCase() === "ach" ||
              card.paymentType.toLowerCase() === "ach hosted" ||
              card.paymentType.toLowerCase() === "ach cardpointe") && (
              <div className="card-number text-base text-color-secondary font-normal">
                Account Number :{card.partialNumber}
              </div>
            )}
            {card.paymentType.toLowerCase() !== "ach" &&
              card.paymentType.toLowerCase() !== "ach hosted" &&
              card.paymentType.toLowerCase() !== "ach cardpointe" && (
                <div className="grid">
                  <div className="col-6 text-base text-color-secondary font-normal">
                    Ending In: {lastFourDigits}
                  </div>
                  <div className="col-6 text-base text-color-secondary font-normal">
                    Expire On: {card.expirationMonth}/{card.expirationYear}
                  </div>
                  {selectedCardId === card.Id && (
                    <div className="col-6 mb-2 flex align-items-center text-base text-color-secondary font-normal">
                      <label htmlFor="CVV" className="mr-2">
                        CVV
                      </label>
                      <CustomInputField
                        type="text"
                        id={"CVV"}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="col-6">
                    {selectedCardId === card.Id && (
                      <SimpleButton
                        label="Place Order"
                        type="submit"
                        onClick={() => payNow(card.Id)}
                      />
                    )}
                  </div>
                </div>
              )}
            {(card.paymentType.toLowerCase() === "ach" ||
              card.paymentType.toLowerCase() === "ach hosted" ||
              card.paymentType.toLowerCase() === "ach cardpointe") && (
              <div className="grid">
                <div className="col-6 mt-2">
                  {selectedCardId === card.Id && (
                    <SimpleButton
                      label="Place Order"
                      type="submit"
                      onClick={() => payNow(card.Id)}
                    />
                  )}
                </div>
              </div>
            )}
            {/* {card.paymentType!=="ACH" && <div className="card-number">Ending In :{lastFourDigits}</div>}
    {card.paymentType!=="ACH" &&<div className="card-expiry">Expire On: {card.expirationMonth}/{card.expirationYear}</div>} */}
          </div>
        </div>

        <Dialog
          header="Delete Card info"
          visible={visibleDeletedDialog}
          style={{ width: "50vw" }}
          breakpoints={{ "991px": "75vw", "767px": "95vw" }}
          onHide={() => setDeleteDialogVisible(false)}
          footer={confirmationFooter}
        >
          <p className="m-0">Are you sure you want to delete this card?</p>
        </Dialog>
        <Dialog
          header="Edit Card info"
          visible={visibleEditDialog}
          style={{ width: "50vw" }}
          breakpoints={{ "991px": "75vw", "767px": "95vw" }}
          onHide={handleCloseEditDialog}
          footer={footerContent}
        >
          <div className="p-grid p-fluid">
            {(card.paymentType.toLowerCase() === "ach" ||
              card.paymentType.toLowerCase() === "ach hosted" ||
              card.paymentType.toLowerCase() === "ach cardpointe") && (
              <div className="p-field p-col-12">
                <label htmlFor="accountNumber">Account Number</label>
                <InputText
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  aria-label="Account Number"
                  onChange={(e) => handleInputChange(e, "accountNumber")}
                />
                <label htmlFor="routingNumber">Routing Number</label>
                <InputText
                  id="routingNumber"
                  name="routingNumber"
                  value={formData.routingNumber}
                  aria-label="Routing Number"
                  onChange={(e) => handleInputChange(e, "routingNumber")}
                />
                <label htmlFor="accountName">Account Holder&apos;s Name</label>
                <InputText
                  id="accountName"
                  name="accountName"
                  aria-label="Account Name"
                  value={formData.accountName}
                  onChange={(e) => handleInputChange(e, "accountName")}
                />
                <label htmlFor="bank">Bank</label>
                <InputText
                  id="bank"
                  name="bank"
                  aria-label="Bank"
                  value={formData.bank}
                  onChange={(e) => handleInputChange(e, "bank")}
                />
              </div>
            )}
            {card.paymentType.toLowerCase() !== "ach" &&
              card.paymentType.toLowerCase() !== "ach hosted" &&
              card.paymentType.toLowerCase() !== "ach cardpointe" && (
                <div className="p-field p-col-12">
                  <label htmlFor="cardNumber">Card Number</label>
                  <InputText
                    id="cardNumber"
                    name="cardNumber"
                    aria-label="Card Number"
                    value={formData.cardNumber}
                    readOnly
                    onChange={(e) => handleInputChange(e, "cardNumber")}
                  />
                  <label htmlFor="expMonth">Exp. Month</label>
                  <Dropdown
                    id="expMonth"
                    name="expirationMonth"
                    options={monthOptions}
                    value={formData.expirationMonth}
                    aria-label="Expiration Month"
                    onChange={(e) => handleInputChange(e, "expirationMonth")}
                    placeholder="Select Month"
                  />
                  <label htmlFor="expYear">Exp. Year</label>
                  <Dropdown
                    id="expYear"
                    name="expirationYear"
                    options={yearOptions}
                    value={formData.expirationYear}
                    aria-label="Expiration Year"
                    onChange={(e) => handleInputChange(e, "expirationYear")}
                  />
                </div>
              )}
          </div>
        </Dialog>
      </div>
    </>
  );
};

SavedCard.propTypes = {
  card: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  renderAddPayment: PropTypes.bool.isRequired,
  paymentUrl: PropTypes.string.isRequired,
  selectedOutstandingOrders: PropTypes.array,
  paymentMethod: PropTypes.string,
  handleOnPayment: PropTypes.string,
  props: PropTypes.object.isRequired,
  onSelectCard: PropTypes.func,
  selectedCardId: PropTypes.string
};

export default SavedCard;
