import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";

import { ACH_PAYMENT_FUNCTIONS, INPUT_ERRORS } from "@constants";
import { _post } from "@api/APIClient.js";
import { useToast } from "@context/ToasterProvider.jsx";
import SimpleButton from "@components/atoms/Buttons/SimpleButton.jsx";
import LoadingSpinner from "@components/atoms/LoadingSpinner.jsx";
import CustomInputField from "@components/atoms/TextFields/CustomInputField.jsx";

export default function ACHPaymentMethod({ options }) {
  const defaultValues = {
    accountNumber: "",
    accountName: "",
    bank: "",
    aba: "",
    saveForFutureUse: false
  };

  const {
    control,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    reset
  } = useForm({
    defaultValues,
    mode: "onChange"
  });

  const { showToastError, showToastSuccess } = useToast();

  const onSubmit = async (formData) => {
    switch (options.paymentFunction) {
      case ACH_PAYMENT_FUNCTIONS.CHECKOUT:
      case "AddACH":
        await checkoutACH(formData);
        break;
      case ACH_PAYMENT_FUNCTIONS.MAKE_MY_PAYMENT:
        await makeMyPaymentACH(formData);
        break;
      case ACH_PAYMENT_FUNCTIONS.MAKE_MY_PAYMENT_WITHOUT_LOGIN:
        await makeMyPaymentWithoutLoginACH(formData);
        break;
      default:
        console.error("Unknown payment function:", options.paymentFunction);
        break;
    }
  };

  const checkoutACH = async (postData) => {
    await _post(options.paymentByACHURL, postData, {
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

  const makeMyPaymentACH = async (postData) => {
    const selectedOutstandingOrders = options.selectedOutstandingOrders;
    if (selectedOutstandingOrders.length > 0) {
      const paymentPromises = selectedOutstandingOrders?.map(async (order, idx) => {
        const paymentData = { ...postData };
        if (idx > 0) {
          paymentData.saveForFutureUse = false;
        }
        paymentData.paymentAmount = order.PayAmount;

        return _post(options.paymentByACHURL.replace("{orderId}", order.OrderId), paymentData, {
          withCredentials: true
        })
          .then((response) => {
            showToastSuccess({
              summary: "Success",
              detail: "Payment successful."
            });
            // options.handleOnPayment();
            // reset();
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
        detail: "Please select orders to pay off."
      });
    }
  };

  const makeMyPaymentWithoutLoginACH = async (postData) => {
    await _post(options.paymentByACHURL, postData, {
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
              : error.message
        });
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isSubmitting && <LoadingSpinner />}
        <div className="grid">
          <div className="col-12 md:col-6">
            <Controller
              name="accountNumber"
              control={control}
              rules={{
                required: "Account Number is required",
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
                  label={"Acc No"}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors?.accountNumber && (
              <small className="p-error">{errors?.accountNumber?.message}</small>
            )}
          </div>
          <div className="col-12 md:col-6">
            <Controller
              name="aba"
              control={control}
              rules={{
                required: "ABA/Routing No is required",
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
                  label={"Routing No (ABA)"}
                  placeholder={""}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors?.aba && <small className="p-error">{errors?.aba?.message}</small>}
          </div>
          <div className="col-12 md:col-6">
            <Controller
              name="accountName"
              control={control}
              rules={{ required: "Account Name is required" }}
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
            {errors?.accountName && (
              <small className="p-error">{errors?.accountName?.message}</small>
            )}
          </div>
          <div className="col-12 md:col-6">
            <Controller
              name="bank"
              control={control}
              rules={{ required: "Bank is required" }}
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
            {errors?.bank && <small className="p-error">{errors?.bank?.message}</small>}
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
          <div className="col-12">
            <SimpleButton
              type="submit"
              label={options.buttonName || "Pay"}
              disabled={isSubmitting || !isValid}
            />
          </div>
        </div>
      </form>
    </>
  );
}

ACHPaymentMethod.propTypes = {
  options: PropTypes.shape({
    paymentFunction: PropTypes.oneOf([
      "checkoutACH",
      "makeMyPaymentACH",
      "makeMyPaymentWithoutLoginACH"
    ]).isRequired,
    paymentByACHURL: PropTypes.string.isRequired,
    selectedOutstandingOrders: PropTypes.arrayOf(PropTypes.object),
    handleOnPayment: PropTypes.func.isRequired,
    buttonName: PropTypes.string
  }).isRequired
};
