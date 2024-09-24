import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { _get } from "@api/APIClient";
import { CustomInputField, LoadingSpinner, SimpleButton } from "@components/atoms";
import { useToast } from "@context/ToasterProvider";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
export default function PayNow() {
  const { showToastError } = useToast();
  const query = useQuery();
  const navigate = useNavigate();
  const initialOrderId = query.get("orderId") || "";
  const initialPersonId = query.get("personId") || "";
  const [orderId, setOrderId] = useState(initialOrderId);
  const [personId, setPersonId] = useState(initialPersonId);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid }
  } = useForm({
    defaultValues: {
      orderId: initialOrderId,
      personId: initialPersonId
    }
  });

  const handleOrderIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setOrderId(e.target.value);
    setValue("orderId", value, { shouldValidate: true });
  };

  const handlePersonIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPersonId(e.target.value);
    setValue("personId", value, { shouldValidate: true });
  };

  const onSubmit = async () => {
    const responseValidateOrder = await _get("/v1/ValidateOrder/" + personId + "/" + orderId);
    if (responseValidateOrder.data.ProceedtoPay === true) {
      navigate("/makePayment/order-payment", { state: { orderId, personId } });
    }
    if (responseValidateOrder.data.ProceedtoPay === false) {
      showToastError({
        summary: "Error Message",
        detail: responseValidateOrder.data.Message
      });
    }
  };

  return (
    <>
      <main className="flex-grow-1 surface-50 py-5 min-h-screen">
        <div className="max-w-30rem border-2 border-round-2xl p-5 surface-border bg-white mx-auto">
          <h1 className="text-center mb-3">Make a Payment</h1>
          <form className="formgrid grid" onSubmit={handleSubmit(onSubmit)}>
            {isSubmitting && <LoadingSpinner />}
            <div className="field col-12">
              <Controller
                name="orderId"
                control={control}
                rules={{
                  required: "Order Id is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Order Id must be a number"
                  }
                }}
                render={({ field, fieldState }) => (
                  <>
                    <CustomInputField
                      {...field}
                      type="text"
                      isIconPresent={false}
                      label={"Order Id"}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        field.onChange(e);
                        handleOrderIdChange(e);
                      }}
                      value={orderId}
                      className={fieldState.invalid ? "input-error" : ""}
                      isRequired
                    />
                    {fieldState.error && (
                      <span className="error-message">{fieldState.error.message}</span>
                    )}
                  </>
                )}
              />
            </div>
            <div className="field col-12">
              <Controller
                name="personId"
                control={control}
                rules={{
                  required: "Person Id is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Person Id must be a number"
                  }
                }}
                render={({ field, fieldState }) => (
                  <>
                    <CustomInputField
                      {...field}
                      type="text"
                      isIconPresent={false}
                      label={"Person Id"}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        field.onChange(e);
                        handlePersonIdChange(e);
                      }}
                      className={fieldState.invalid ? "input-error" : ""}
                      value={personId}
                      isRequired
                    />
                    {fieldState.error && (
                      <span className="error-message">{fieldState.error.message}</span>
                    )}
                  </>
                )}
              />
            </div>
            <div className="field col-12">
              <SimpleButton
                className={"w-full mt-2"}
                type="submit"
                label="Next"
                disabled={isSubmitting || !isValid}
              />
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
