import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { RadioButton } from "primereact/radiobutton";
import { classNames } from "primereact/utils";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  FTS_UAT_CARD_CONNECT,
  IFRAME_TOKENIZER_URL,
  IFRAME_TOKENIZER_URL_ACH,
  PAYMENT_FUNCTIONS
} from "@constants";
import { _post } from "@api/APIClient.js";
import { useToast } from "@context/ToasterProvider.jsx";
import SimpleButton from "@components/atoms/Buttons/SimpleButton.jsx";
import LoadingSpinner from "@components/atoms/LoadingSpinner.jsx";
import CustomInputField from "@components/atoms/TextFields/CustomInputField.jsx";
import "@css/login.scss";

export default function HostediFrameTokenizer({ options }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid }
  } = useForm({ mode: "onChange" });

  const { showToastError, showToastSuccess } = useToast();

  const [visible, setVisible] = useState(false);
  const [achChecked, setACHhecked] = useState(false);
  const [tokenData, setTokenData] = useState("");
  const [ccChecked, setCCChecked] = useState(true);
  const [buttonLabel] = useState("Pay By iFrame Tokenizer");
  const [iframeTokenizerURL, setIframeTokenizerURL] = useState(IFRAME_TOKENIZER_URL);

  const [masterCardDisabled, setMasterCardDisabled] = useState(true);
  const [visaCardDisabled, setVisaCardDisabled] = useState(true);
  const [amexCardDisabled, setAmexCardDisabled] = useState(true);
  const [discoverCardDisabled, setDiscoverCardDisabled] = useState(true);

  useEffect(() => {
    window.addEventListener("message", function (event) {
      //   tokenData = JSON.parse(event.data);
      if (event?.origin === FTS_UAT_CARD_CONNECT) {
        // if (event.data && event.data.errorCode == "0") {
        let eventData = "";
        if (isJsonString(event?.data)) {
          eventData = JSON.parse(event?.data);
        }
        //if (eventData.errorCode == "0") {
        setTokenData(eventData);
        //highlight the selected card type
        if (eventData?.message !== "") {
          highlightSelectedCardType(eventData?.message);
        } else if (eventData?.message === "" && eventData?.expiry === "") {
          setAllCardsDisabled();
        }
        //}
      }
    });
  }, []);

  const setAllCardsDisabled = () => {
    setDiscoverCardDisabled(true);
    setMasterCardDisabled(true);
    setVisaCardDisabled(true);
    setAmexCardDisabled(true);
  };

  /*The second character of the token returned from Cardpointe denotes the credit card type.*/
  const highlightSelectedCardType = (number) => {
    // visa
    if (number.charAt(1) == "4") {
      setVisaCardDisabled(false);
      setMasterCardDisabled(true);
      setDiscoverCardDisabled(true);
      setAmexCardDisabled(true);
    }

    // Mastercard
    if (number.charAt(1) == "5") {
      setMasterCardDisabled(false);
      setVisaCardDisabled(true);
      setDiscoverCardDisabled(true);
      setAmexCardDisabled(true);
    }

    // AMEX
    if (number.charAt(1) == "3") {
      setAmexCardDisabled(false);
      setMasterCardDisabled(true);
      setDiscoverCardDisabled(true);
      setVisaCardDisabled(true);
    }

    // Discover
    if (number.charAt(1) == "6") {
      setDiscoverCardDisabled(false);
      setMasterCardDisabled(true);
      setVisaCardDisabled(true);
      setAmexCardDisabled(true);
    }
    return "";
  };

  const isJsonString = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const onSubmit = async (formData) => {
    if (options.paymentFunction === PAYMENT_FUNCTIONS.PAY_BY_HOSTED_IFRAME_TOKENIZER) {
      await payByHostediFrameTokenizer(formData);
    }
    if (options.paymentFunction === PAYMENT_FUNCTIONS.MAKE_PAYMENT_BY_HOSTED_IFRAME_TOKENIZER) {
      await makePaymentByHostediFrameTokenizer(formData);
    }
    if (
      options.paymentFunction ===
      PAYMENT_FUNCTIONS.MAKE_PAYMENT_WITHOUT_LOGIN_BY_HOSTED_IFRAME_TOKENIZER
    ) {
      await makePaymentWithoutLoginByHostediFrameTokenizer(formData);
    }
    if (options.paymentFunction === "AddHostediFrameTokenizer") {
      await payByHostediFrameTokenizer(formData);
    }
  };

  const payByCreditCard = async (postData) => {
    await _post(options.payByCreditCardTokenizerURL, postData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        showToastSuccess({
          summary: "Success",
          detail: "Payment successful."
        });
        options.handleOnPayment(response.data.id);
        setVisible(false);
        return response;
      })
      .catch((error) => {
        showToastError({
          summary: "Error Message",
          detail:
            error.message != undefined && error.type != undefined
              ? error.type + ": " + error.message
              : error.message,
          life: 3000
        });
      });
  };
  const payByACH = async (postData) => {
    await _post(options.payByACHTokenizerURL, postData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        showToastSuccess({
          summary: "Success",
          detail: "Payment successful."
        });
        options.handleOnPayment(response.data.id);
        setVisible(false);
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

  const payByHostediFrameTokenizer = async (formData) => {
    if (tokenData === "" || tokenData == undefined) {
      return;
    }
    if (ccChecked === true) {
      const token = tokenData.message;
      const expiryDate = tokenData.expiry;
      const saveForFutureUse = formData.saveForFuture;

      if (options === undefined) {
        options = {};
      }
      if (options.cardDetailsSchema === undefined) {
        options.cardDetailsSchema = {};
      }
      const cardDetails = {
        [options.cardDetailsSchema.cardNumberKey || "cardNumber"]: token,
        [options.cardDetailsSchema.expirationMonthKey || "expirationMonth"]: expiryDate.slice(4),
        [options.cardDetailsSchema.expirationYearKey || "expirationYear"]: expiryDate.slice(0, 4),
        [options.cardDetailsSchema.saveForFutureUseKey || "saveForFutureUse"]:
          saveForFutureUse || false
      };

      await payByCreditCard(cardDetails);
    } else {
      const _token = tokenData.message;

      const _saveForFutureUse = formData.saveForFuture;

      if (options === undefined) {
        options = {};
      }
      if (options.achDetailsSchema === undefined) {
        options.achDetailsSchema = {};
      }

      const achDetails = {
        [options.achDetailsSchema.accountNumberKey || "accountNumber"]: _token,
        [options.achDetailsSchema.accountNameKey || "accountName"]: formData.accountName,
        [options.achDetailsSchema.bankKey || "bank"]: formData.bank,
        [options.achDetailsSchema.saveForFutureUseKey || "saveForFutureUse"]:
          _saveForFutureUse || false
      };

      await payByACH(achDetails);
    }
  };

  const makePaymentByHostediFrameTokenizer = async (formData) => {
    if (tokenData === "" || tokenData == undefined) {
      return;
    }
    if (ccChecked === true) {
      const token = tokenData.message;
      const saveForFutureUse = formData.saveForFuture;
      const saveToTypes = formData.saveToTypes;

      const formattedExpiryDate = new Intl.DateTimeFormat("en-US").format(
        new Date(tokenData.expiry.slice(0, 4) + "/" + tokenData.expiry.slice(4))
      );
      const expiryDate = formattedExpiryDate;

      if (options === undefined) {
        options = {};
      }
      if (options.cardDetailsSchema === undefined) {
        options.cardDetailsSchema = {};
      }

      const postDataArray = [];

      const selectedOutstandingOrders = options.selectedOutstandingOrders;
      selectedOutstandingOrders?.map(async (order) => {
        const cardDetails = {
          [options.cardDetailsSchema.cardNumberKey || "CCAccountNumber"]: token,
          [options.cardDetailsSchema.expirationMonth || "CCExpireDate"]: expiryDate,
          [options.cardDetailsSchema.saveForFutureUseKey || "saveForFutureUse"]:
            saveForFutureUse || false,
          [options.cardDetailsSchema.saveToTypesKey || "saveToTypes"]: saveToTypes || "Person"
        };
        cardDetails.paymentAmount = order?.PayAmount?.toString();
        cardDetails.orderId = order.OrderId;
        postDataArray.push(cardDetails);
      });

      await payByCreditCard(postDataArray);
    } else {
      const _token = tokenData.message;
      const _saveForFutureUse = formData.saveForFuture;

      if (options === undefined) {
        options = {};
      }
      if (options.achDetailsSchema === undefined) {
        options.achDetailsSchema = {};
      }

      const postDataArray = [];

      const selectedOutstandingOrders = options.selectedOutstandingOrders;
      selectedOutstandingOrders.map(async (order) => {
        const achDetails = {
          [options.achDetailsSchema.accountNumberKey || "AccountNumber"]: _token,
          [options.achDetailsSchema.accountNameKey || "AccountName"]: formData.accountName,
          [options.achDetailsSchema.bankKey || "Bank"]: formData.bank,
          [options.achDetailsSchema.abaKey || "ABA"]: formData.aba,
          [options.achDetailsSchema.checkNumberKey || "CheckNumber"]:
            formData.checkNumber || "ebiz react payment",
          [options.achDetailsSchema.branchNameKey || "BranchName"]: formData.branchName,
          [options.achDetailsSchema.saveForFutureUseKey || "saveForFutureUse"]:
            _saveForFutureUse || false,
          [options.achDetailsSchema.saveToTypesKey || "saveToTypes"]:
            formData.saveToTypes || "Person"
        };
        achDetails.paymentAmount = order?.PayAmount;
        achDetails.orderId = order.OrderId;
        postDataArray.push(achDetails);
      });
      await payByACH(postDataArray);
    }
  };

  const makePaymentWithoutLoginByHostediFrameTokenizer = async (formData) => {
    if (tokenData === "" || tokenData == undefined) {
      return;
    }
    if (ccChecked === true) {
      const token = tokenData.message;
      const expiryDate = tokenData.expiry;
      const saveForFutureUse = formData.saveForFuture;

      if (options === undefined) {
        options = {};
      }
      if (options.cardDetailsSchema === undefined) {
        options.cardDetailsSchema = {};
      }
      const cardDetails = {
        [options.cardDetailsSchema.cardNumberKey || "cardNumber"]: token,
        [options.cardDetailsSchema.expirationMonthKey || "expirationMonth"]: expiryDate.slice(4),
        [options.cardDetailsSchema.expirationYearKey || "expirationYear"]: expiryDate.slice(0, 4),
        [options.cardDetailsSchema.saveForFutureUseKey || "saveForFutureUse"]:
          saveForFutureUse || false
      };

      await payByCreditCard(cardDetails);
    } else {
      const _token = tokenData.message;
      const _saveForFutureUse = formData.saveForFuture;

      if (options === undefined) {
        options = {};
      }
      if (options.achDetailsSchema === undefined) {
        options.achDetailsSchema = {};
      }

      const achDetails = {
        [options.achDetailsSchema.accountNumberKey || "accountNumber"]: _token,
        [options.achDetailsSchema.accountNameKey || "accountName"]: formData.accountName,
        [options.achDetailsSchema.bankKey || "bank"]: formData.bank,
        [options.achDetailsSchema.abaKey || "aba"]: formData.aba,
        [options.achDetailsSchema.checkNumberKey || "CheckNumber"]:
          formData.checkNumber || "ebiz react payment",
        [options.achDetailsSchema.saveForFutureUseKey || "saveForFutureUse"]:
          _saveForFutureUse || false
      };

      await payByACH(achDetails);
    }
  };

  const rdoTokenizerOnChange = (e) => {
    setTokenData("");
    if (e.value.toLowerCase() == "ach") {
      setACHhecked(true);
      setCCChecked(false);
      setIframeTokenizerURL(IFRAME_TOKENIZER_URL_ACH);
    } else {
      setCCChecked(true);
      setACHhecked(false);
      setIframeTokenizerURL(IFRAME_TOKENIZER_URL);
    }

    setDiscoverCardDisabled(true);
    setMasterCardDisabled(true);
    setVisaCardDisabled(true);
    setAmexCardDisabled(true);
  };

  const checkIfValidOutstandingOrdersData = () => {
    //Check if Outstanding orders list is empty. If yes, throw error and do not open Tokenizer form.
    //For pages, other than Make My Payment, the above check is not done and Tokenizer form is directly opened.
    if (options.selectedOutstandingOrders) {
      if (options.selectedOutstandingOrders.length > 0) {
        setVisible(true);
      } else {
        setVisible(false);
        showToastError({
          summary: "Error Message",
          detail: "Please select orders to pay off.",
          life: 3000
        });
      }
    } else {
      setVisible(true);
    }
  };

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" /> */}
      <span className="font-bold white-space-nowrap">Make a Payment</span>
    </div>
  );
  return (
    <>
      <div>
        <SimpleButton
          label={options.buttonName || buttonLabel}
          icon="pi pi-external-link"
          onClick={() => {
            checkIfValidOutstandingOrdersData();
          }}
        />
        <Dialog
          visible={visible}
          modal
          header={headerElement}
          className="w-6"
          breakpoints={{ "991px": "75vw", "767px": "95vw" }}
          onHide={() => setVisible(false)}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <>
              {isSubmitting && <LoadingSpinner />}
              <div className="mb-3">
                <div>
                  <RadioButton
                    inputId={"rdoTokenizerCCACH"}
                    name="tokenizerRadio"
                    value={"Credit Card"}
                    onChange={(e) => rdoTokenizerOnChange(e)}
                    checked={ccChecked}
                  />

                  <label htmlFor={"rdoTokenizerCCACH"} className="ml-2">
                    Credit Cards
                  </label>
                </div>
                <div className="mt-2">
                  <RadioButton
                    inputId={"rdoTokenizerCCACH1"}
                    name="tokenizerRadio"
                    value={"ACH"}
                    onChange={(e) => rdoTokenizerOnChange(e)}
                    checked={achChecked}
                  />
                  <label htmlFor={"rdoTokenizerCCACH1"} className="ml-2">
                    ACH
                  </label>
                </div>
              </div>
              {/* Credit Card Types */}
              <div className="mb-3" hidden={achChecked}>
                <label className="mb-2" htmlFor="Accepted Cards">
                  Accepted Cards
                </label>
                <ul className="flex eb-accepted-card">
                  <li className={`eb-card master  ${masterCardDisabled && "cdisabled"}`} />
                  <li className={`eb-card discover ${discoverCardDisabled && "cdisabled"}`} />
                  <li className={`eb-card amex ${amexCardDisabled && "cdisabled"}`} />
                  <li className={`eb-card visa ${visaCardDisabled && "cdisabled"}`} />
                </ul>
              </div>
              <div>
                {/* <!--This div belongs to the credit card types icons.--> */}
                <div id="cardcontainer" style={{ display: ccChecked ? "block" : "none" }} />
              </div>

              <div>
                <label
                  style={{ display: achChecked ? "block" : "none" }}
                  htmlFor="Routing Number/Account Number"
                >
                  Routing Number/Account Number
                </label>
                <div className={isSubmitting ? "disabledbutton" : ""}>
                  <iframe
                    className="-ml-2"
                    id="tokenframe"
                    name="tokenframe"
                    title="cardpointe-iframe"
                    frameBorder="0"
                    scrolling="no"
                    width="100%"
                    height={achChecked ? "70" : "280"}
                    src={iframeTokenizerURL}
                  />
                </div>
              </div>

              <div className="eb-tokenizer-container">
                <div id="achfields" style={{ display: achChecked ? "block" : "none" }}>
                  <div className="formgrid grid pr-3">
                    <div className="field col-12">
                      <Controller
                        name="txNo"
                        control={control}
                        //rules={{ required: achChecked }}
                        render={({ field }) => (
                          <CustomInputField
                            {...field}
                            type="text"
                            isiconpresent={false}
                            label={"Transaction Number"}
                            placeholder={""}
                            disabled={isSubmitting}
                          />
                        )}
                      />
                    </div>
                    <div className="field col-12">
                      <Controller
                        name="bank"
                        control={control}
                        rules={{ required: achChecked }}
                        render={({ field }) => (
                          <CustomInputField
                            {...field}
                            type="text"
                            isiconpresent={false}
                            label={"Bank"}
                            placeholder={""}
                            disabled={isSubmitting}
                          />
                        )}
                      />
                      {errors.bank && achChecked && (
                        <small className="p-error">Bank is required</small>
                      )}
                    </div>
                    <div className="field col-12">
                      <Controller
                        name="accountName"
                        control={control}
                        rules={{ required: achChecked }}
                        render={({ field }) => (
                          <CustomInputField
                            {...field}
                            type="text"
                            isiconpresent={false}
                            label={"Account Name"}
                            disabled={isSubmitting}
                          />
                        )}
                      />
                      {errors.accountName && achChecked && (
                        <small className="p-error">Account Name is required</small>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Controller
                    name="saveForFuture"
                    control={control}
                    rules={{ required: false }}
                    //onChange={onSaveForFutureChange}
                    render={({ field, fieldState }) => (
                      <Checkbox
                        inputId={field.name}
                        // onChange={(e) => field.onChange(e.checked)}
                        onChange={(e) => field.onChange(e.checked)}
                        checked={field.value}
                        className={classNames({
                          "p-invalid": fieldState.invalid
                        })}
                        aria-label="Save For Future"
                        disabled={isSubmitting}
                      />
                    )}
                  />
                  <label className="ml-2" htmlFor="Save For Future">
                    Save For Future
                  </label>
                </div>
                <div className="my-3 pr-3">
                  <SimpleButton
                    type="submit"
                    label="Confirm Payment"
                    icon="pi pi-check"
                    disabled={
                      isSubmitting || !isValid || tokenData === "" || tokenData?.token === ""
                    }
                  />
                </div>
              </div>
            </>
          </form>
        </Dialog>
      </div>
    </>
  );
}

HostediFrameTokenizer.propTypes = {
  options: PropTypes.shape({
    handleOnPayment: PropTypes.func,
    paymentFunction: PropTypes.oneOf([
      "payByHostediFrameTokenizer",
      "makePaymentByHostediFrameTokenizer",
      "makePaymentWithoutLoginByHostediFrameTokenizer"
    ]).isRequired,
    buttonName: PropTypes.string,
    payByCreditCardTokenizerURL: PropTypes.string,
    payByACHTokenizerURL: PropTypes.string,
    selectedOutstandingOrders: PropTypes.arrayOf(PropTypes.object),
    cardDetailsSchema: PropTypes.shape({
      cardNumberKey: PropTypes.string,
      expirationMonthKey: PropTypes.string,
      expirationYearKey: PropTypes.string,
      saveForFutureUseKey: PropTypes.string,
      saveToTypesKey: PropTypes.string,
      expirationDateKey: PropTypes.string,
      expirationMonth: PropTypes.string
    }),
    achDetailsSchema: PropTypes.shape({
      accountNumberKey: PropTypes.string,
      accountNameKey: PropTypes.string,
      bankKey: PropTypes.string,
      abaKey: PropTypes.string,
      checkNumberKey: PropTypes.string,
      branchNameKey: PropTypes.string,
      saveForFutureUseKey: PropTypes.string,
      saveToTypesKey: PropTypes.string
    })
  }).isRequired
};
