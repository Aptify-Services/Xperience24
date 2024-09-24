import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";

import { CC_PAYMENT_FUNCTIONS, MONTHS, INPUT_ERRORS } from "@constants";
import { _post } from "@api/APIClient.js";
import { useToast } from "@context/ToasterProvider.jsx";
import SimpleButton from "@components/atoms/Buttons/SimpleButton.jsx";
import LoadingSpinner from "@components/atoms/LoadingSpinner.jsx";
import CustomInputField from "@components/atoms/TextFields/CustomInputField.jsx";
import useMutationObserver from "@hooks/useMutationObserver";
import { addAriaLabelOnExpandIcon } from "@utils/accessibilty";

export default function CCPaymentMethod({ options }) {
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    defaultValues: {
      cardNumber: "",
      cvv: "",
      expirationMonth: "",
      expirationYear: "",
      saveForFutureUse: false
    },
    mode: "onChange"
  });

  const { showToastSuccess, showToastError } = useToast();
  const [years, setYears] = useState([]);
  useMutationObserver(addAriaLabelOnExpandIcon, []);

  const currentYear = new Date().getFullYear();

  const yearOptions = useCallback(() => {
    const _years = [];
    for (let index = 0; index < 15; index++) {
      _years.push({
        label: currentYear + index,
        value: currentYear + index
      });
    }
    return _years;
  }, [currentYear]);

  useEffect(() => {
    setYears(yearOptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearOptions]);

  const [masterCardDisabled, setMasterCardDisabled] = useState(false);
  const [visaCardDisabled, setVisaCardDisabled] = useState(false);
  const [amexCardDisabled, setAmexCardDisabled] = useState(false);
  const [discoverCardDisabled, setDiscoverCardDisabled] = useState(false);

  const onSubmit = async (formData) => {
    switch (options.paymentFunction) {
      case CC_PAYMENT_FUNCTIONS.CHECKOUT:
        await checkout(formData);
        break;
      case CC_PAYMENT_FUNCTIONS.MAKE_MY_PAYMENT:
        await makeMyPayment(formData);
        break;
      case CC_PAYMENT_FUNCTIONS.MAKE_MY_PAYMENT_WITHOUT_LOGIN:
        await makeMyPaymentWithoutLogin(formData);
        break;
      case CC_PAYMENT_FUNCTIONS.ADCC:
        await checkout(formData);
        break;
      default:
        console.error("Unknown payment function:", options.paymentFunction);
        break;
    }
  };

  const checkout = async (formData) => {
    if (options === undefined) {
      options = {};
    }
    if (options.cardDetailsSchema === undefined) {
      options.cardDetailsSchema = {};
    }
    const cardDetails = {
      [options.cardDetailsSchema.cardNumberKey || "cardNumber"]: formData.cardNumber,
      [options.cardDetailsSchema.cvvKey || "cvv"]: formData.cvv,
      [options.cardDetailsSchema.expirationMonthKey || "expirationMonth"]: formData.expirationMonth,
      [options.cardDetailsSchema.expirationYearKey || "expirationYear"]: formData.expirationYear,
      [options.cardDetailsSchema.saveForFutureUseKey || "saveForFutureUse"]:
        formData.saveForFutureUse || false
    };

    await _post(options.paymentByCCURL, cardDetails, {
      withCredentials: true
    })
      .then((response) => {
        options.handleOnPayment(response.data.id);
        reset();
        return response;
      })
      .catch((error) => {
        showToastError({
          summary: "Error Message",
          detail:
            error.message != undefined && error.type != undefined
              ? error.type + ": " + error.message
              : error.message
        });
      });
  };

  const makeMyPayment = async (formData) => {
    if (options === undefined) {
      options = {};
    }
    if (options.cardDetailsSchema === undefined) {
      options.cardDetailsSchema = {};
    }
    const cardDetails = {
      [options.cardDetailsSchema.cardNumberKey || "cardNumber"]: formData.cardNumber,
      [options.cardDetailsSchema.cvvKey || "cvv"]: formData.cvv,
      [options.cardDetailsSchema.expirationMonthKey || "expirationMonth"]: formData.expirationMonth,
      [options.cardDetailsSchema.expirationYearKey || "expirationYear"]: formData.expirationYear,
      [options.cardDetailsSchema.saveForFutureUseKey || "saveForFutureUse"]:
        formData.saveForFutureUse || false
    };

    const selectedOutstandingOrders = options.selectedOutstandingOrders;
    if (selectedOutstandingOrders.length > 0) {
      const paymentPromises = selectedOutstandingOrders.map((order, idx) => {
        const postData = { ...cardDetails };

        if (idx > 0) {
          postData.saveForFutureUse = false;
        }
        postData.paymentAmount = order.PayAmount;

        return _post(options.paymentByCCURL.replace("{orderId}", order.OrderId), postData, {
          withCredentials: true
        })
          .then((response) => {
            showToastSuccess({
              summary: "Success",
              detail: "Payment successful."
            });
            // options.handleOnPayment();
            //reset();
            return response;
          })
          .catch((error) => {
            showToastError({
              summary: "Error Message",
              detail:
                error.message != undefined && error.type != undefined
                  ? error.type + ": " + error.message
                  : error.message
            });
          });
      });

      try {
        await Promise.all(paymentPromises);
        options.handleOnPayment();
        reset();
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

  const makeMyPaymentWithoutLogin = async (formData) => {
    if (options === undefined) {
      options = {};
    }
    if (options.cardDetailsSchema === undefined) {
      options.cardDetailsSchema = {};
    }
    const cardDetails = {
      [options.cardDetailsSchema.cardNumberKey || "cardNumber"]: formData.cardNumber,
      [options.cardDetailsSchema.cvvKey || "cvv"]: formData.cvv,
      [options.cardDetailsSchema.expirationMonthKey || "expirationMonth"]: formData.expirationMonth,
      [options.cardDetailsSchema.expirationYearKey || "expirationYear"]: formData.expirationYear,
      [options.cardDetailsSchema.saveForFutureUseKey || "saveForFutureUse"]:
        formData.saveForFutureUse || false
    };

    await _post(options.paymentByCCURL, cardDetails, {
      withCredentials: true
    })
      .then((response) => {
        options.handleOnPayment();
        reset();
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

  /*The second character of the token returned from Cardpointe denotes the credit card type.*/
  const highlightSelectedCardType = (number) => {
    // visa
    if (number.charAt(0) == "4") {
      setVisaCardDisabled(false);
      setMasterCardDisabled(true);
      setDiscoverCardDisabled(true);
      setAmexCardDisabled(true);
    }

    // Mastercard
    if (number.charAt(0) == "5") {
      setMasterCardDisabled(false);
      setVisaCardDisabled(true);
      setDiscoverCardDisabled(true);
      setAmexCardDisabled(true);
    }

    // AMEX
    if (number.charAt(0) == "3") {
      setAmexCardDisabled(false);
      setMasterCardDisabled(true);
      setDiscoverCardDisabled(true);
      setVisaCardDisabled(true);
    }

    // Discover
    if (number.charAt(0) == "6") {
      setDiscoverCardDisabled(false);
      setMasterCardDisabled(true);
      setVisaCardDisabled(true);
      setAmexCardDisabled(true);
    }
    return "";
  };

  const restoreCardsOriginalState = () => {
    setDiscoverCardDisabled(false);
    setMasterCardDisabled(false);
    setVisaCardDisabled(false);
    setAmexCardDisabled(false);
  };

  const validateExpirationDate = () => {
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-based month

    const { expirationMonth, expirationYear } = getValues();

    clearErrors(["expirationMonth", "expirationYear"]);

    if (
      parseInt(expirationYear) < currentYear ||
      (parseInt(expirationYear) === currentYear && parseInt(expirationMonth) < currentMonth)
    ) {
      setError("expirationMonth", {
        type: "custom",
        message: INPUT_ERRORS.CARD_EXPIRATION_DATE_PAST
      });
      setError("expirationYear", {
        type: "custom",
        message: INPUT_ERRORS.CARD_EXPIRATION_DATE_PAST
      });
      return false;
    }
    return true;
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isSubmitting && <LoadingSpinner />}
        <div className="grid">
          {/* Credit Card Types */}
          <div className="mb-1 col-12">
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

          <div className="col-12 md:col-6">
            <Controller
              name="cardNumber"
              control={control}
              rules={{
                required: "Card Number is required",
                valueAsNumber: true,
                pattern: {
                  value: /^[0-9]+$/,
                  message: INPUT_ERRORS.NUMBER_REQUIRED
                }
              }}
              render={({ field }) => (
                <CustomInputField
                  {...field}
                  type="text"
                  isiconpresent={false}
                  label={"Credit Card No"}
                  onChange={(e) => {
                    field.onChange(e?.currentTarget?.value);
                    highlightSelectedCardType(e?.target?.value);
                  }}
                  onBlur={() => {
                    if (!field.value) {
                      restoreCardsOriginalState();
                    }
                  }}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors?.cardNumber && <small className="p-error">{errors?.cardNumber?.message}</small>}
          </div>
          <div className="col-12 md:col-6">
            <Controller
              name="cvv"
              control={control}
              rules={{
                required: false,
                valueAsNumber: true,
                pattern: {
                  value: /^[0-9]+$/,
                  message: INPUT_ERRORS.NUMBER_REQUIRED
                }
              }}
              render={({ field }) => (
                <CustomInputField {...field} type="text" isiconpresent={false} label={"CVV"} />
              )}
              disabled={isSubmitting}
            />
            {errors?.cvv && <small className="p-error">{errors?.cvv?.message}</small>}
          </div>
          <div className="col-12 md:col-6">
            <label htmlFor="expirationMonth">Expiration Month</label>

            <Controller
              name="expirationMonth"
              control={control}
              rules={{
                required: "Card Expiration Month is required",
                validate: validateExpirationDate
              }}
              render={({ field }) => (
                <Dropdown
                  id={field.name}
                  name={field?.name}
                  aria-label={field?.name}
                  value={field.value}
                  options={MONTHS}
                  onChange={(e) => {
                    field.onChange(e.value);
                  }}
                  className="w-full"
                  checkmark
                  disabled={isSubmitting}
                />
              )}
            />
            {errors?.expirationMonth && (
              <small className="p-error">{errors?.expirationMonth?.message}</small>
            )}
          </div>

          <div className="col-12 md:col-6">
            <label htmlFor="expirationYear">Expiration Year</label>

            <Controller
              name="expirationYear"
              control={control}
              rules={{
                required: "Card Expiration Year is required",
                validate: validateExpirationDate
              }}
              render={({ field }) => (
                <Dropdown
                  id={field.name}
                  name={field?.name}
                  aria-label={field?.name}
                  value={field.value}
                  options={years}
                  onChange={(e) => {
                    field.onChange(e.value);
                  }}
                  className="w-full"
                  checkmark
                  disabled={isSubmitting}
                />
              )}
            />
            {errors?.expirationYear && (
              <small className="p-error">{errors?.expirationYear?.message}</small>
            )}
          </div>
          <div className="col-12">
            <Controller
              name="saveForFutureUse"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex align-items-center">
                  <Checkbox
                    inputId={field.name}
                    onChange={(e) => field.onChange(e.checked)}
                    checked={field.value}
                    className={classNames({ "p-invalid": fieldState.invalid })}
                    aria-label="Save For Future"
                    disabled={isSubmitting}
                  />
                  <label htmlFor={field.name} className="ml-2">
                    Save For Future
                  </label>
                </div>
              )}
            />
          </div>
        </div>
        <div>
          <SimpleButton
            type="submit"
            label={options.buttonName || "Pay"}
            disabled={isSubmitting || !isValid}
          />
        </div>
        {/* </div> */}
      </form>
    </>
  );
}

CCPaymentMethod.propTypes = {
  options: PropTypes.shape({
    paymentFunction: PropTypes.oneOf(["checkout", "makeMyPayment", "makeMyPaymentWithoutLogin"])
      .isRequired,
    paymentByCCURL: PropTypes.string.isRequired,
    handleOnPayment: PropTypes.func.isRequired,
    cardDetailsSchema: PropTypes.shape({
      cardNumberKey: PropTypes.string,
      cvvKey: PropTypes.string,
      expirationMonthKey: PropTypes.string,
      expirationYearKey: PropTypes.string,
      saveForFutureUseKey: PropTypes.string
    }),
    selectedOutstandingOrders: PropTypes.arrayOf(PropTypes.object),
    buttonName: PropTypes.string
  })
};
