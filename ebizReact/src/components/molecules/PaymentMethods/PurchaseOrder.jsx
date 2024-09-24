import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";

import { _post } from "@api/APIClient";
import { CustomInputField, LoadingSpinner, SimpleButton } from "@components/atoms";
import { useToast } from "@context/ToasterProvider.jsx";

export default function PurchaseOrder({ options }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid }
  } = useForm();

  const { showToastError } = useToast();

  const onSubmit = async (formData) => {
    await checkout(formData);
  };

  const checkout = async (formData) => {
    if (options === undefined) {
      options = {};
    }
    const poDetails = {
      PurchaseOrderNumber: formData.poNumber
    };
    await _post(options.paymentByPOURL, poDetails, {
      withCredentials: true
    })
      .then((response) => {
        options?.handleOnPayment(response.data.id);
        reset();
        return response;
      })
      .catch((error) => {
        showToastError({
          severity: "error",
          sticky: false,
          summary: "Error Message",
          detail:
            error?.message != undefined && error?.type != undefined
              ? error?.type + ": " + error?.message
              : error?.message,
          life: 5000
        });
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isSubmitting && <LoadingSpinner />}
        <div className="grid">
          <div className="col-12 md:col-8">
            <Controller
              name="poNumber"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomInputField
                  {...field}
                  type="text"
                  isIconPresent={false}
                  label={"PO Number"}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.poNumber && (
              // <span style={{ color: "red" }}>
              <span>PO Number is required</span>
            )}
          </div>
          <div className="col-12 md:col-4 flex align-items-end">
            <SimpleButton
              type="submit"
              label={options.buttonName || "Place Order"}
              disabled={isSubmitting || !isValid}
              className="w-full"
            />
          </div>
        </div>
      </form>
    </>
  );
}

PurchaseOrder.propTypes = {
  options: PropTypes.shape({
    buttonName: PropTypes.string,
    paymentByPOURL: PropTypes.string,
    handleOnPayment: PropTypes.func
  })
};
