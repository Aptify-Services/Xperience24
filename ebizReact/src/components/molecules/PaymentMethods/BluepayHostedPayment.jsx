import { Dialog } from "primereact/dialog";
import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";

import { _post } from "@api/APIClient.js";
import { useToast } from "@context/ToasterProvider.jsx";
import SimpleButton from "@components/atoms/Buttons/SimpleButton.jsx";
import LoadingSpinner from "@components/atoms/LoadingSpinner.jsx";

import { useDialog } from "./DialogContext.jsx";

export default function BluepayHostedPayment({ options }) {
  const { handleSubmit } = useForm();
  const { showToastWarn, showToastError, showToastSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [bluePayHPPURL, setBluePayHPPURL] = useState("");

  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  const defaulterror =
    "Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.";

  const handleOpenDialog = () => {
    openDialog();
  };

  const handleCloseDialog = () => {
    closeDialog();
  };

  const onSubmit = async () => {};

  const fetchBluepayHPPPaymentURL = async () => {
    let postData;
    let openBluepayDialog = true;

    if (options.body) {
      let expirationData = {};
      expirationData = {
        expirationMonth: options.body.bluepayHPPCreditCardExpiryMonth,
        expirationYear: options.body.bluepayHPPCreditCardExpiryYear
      };
      postData = expirationData;
    }

    if (options.selectedOutstandingOrders) {
      const postDataArray = [];
      const selectedOutstandingOrders = options.selectedOutstandingOrders;
      if (selectedOutstandingOrders.length > 0) {
        selectedOutstandingOrders?.map(async (order) => {
          const orderList = {};
          orderList.orderId = order.OrderId;
          orderList.paymentAmount = order.PayAmount;
          postDataArray.push(orderList);
        });
        postData = postDataArray;
      } else {
        openBluepayDialog = false;
        showToastError({
          summary: "Error Message",
          detail: "Please select orders to pay off.",
          life: 3000
        });
      }
    }

    if (openBluepayDialog) {
      await _post(options.getRemotePaymentRequestURL, postData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((response) => {
          if (
            typeof response.data.outputPaymentURL === "string" &&
            response.data.outputPaymentURL.trim().length === 0
          ) {
            showToastWarn({
              summary: "Error Message",
              detail: "An empty Bluepay HPP URL was returned"
            });
            handleCloseDialog();
          } else {
            setBluePayHPPURL(response.data.outputPaymentURL);
            handleOpenDialog();
          }
        })
        .catch((error) => {
          showToastError({
            summary: "Error Message",
            detail:
              error.message != undefined && error.type != undefined
                ? "type: " + error.type + ", message: " + error.message
                : error.message
          });
          handleCloseDialog();
        });
    }
  };

  const handleMessage = useCallback(
    async (event) => {
      const { data } = event;

      if (data) {
        const { dialog, action, data: eventData } = data;

        if (dialog === "closeDialog") {
          closeDialog();
          if (eventData) {
            options.handleOnPayment(eventData);
          }
        }

        if (action === "processBluepayResponse" && eventData) {
          setIsLoading(true);
          closeDialog();

          try {
            const response = await _post(options.processBluepayResponseURL, eventData, {
              withCredentials: true
            });

            setIsLoading(false);
            showToastSuccess({
              summary: "Success",
              detail: "Payment successful."
            });

            options.handleOnPayment(response.data.OrderId);
          } catch (error) {
            setIsLoading(false);

            const errorMessage =
              error?.message || error?.type
                ? `type: ${error.type}, message: ${error.message != "" ? error.message : defaulterror}`
                : defaulterror;

            showToastError({
              summary: "Error Message",
              detail: errorMessage
            });

            closeDialog();
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closeDialog, options]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage, true);

    return () => {
      window.removeEventListener("message", handleMessage, true);
    };
  }, [handleMessage]);

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" /> */}
      <span className="font-bold white-space-nowrap">Make a Payment</span>
    </div>
  );
  return (
    <>
      {/* <LoadingSpinner className={`${isLoading ? "block" : "none"}`} /> */}
      {isLoading && <LoadingSpinner />}

      <div>
        <SimpleButton
          label="Pay by Bluepay HPP"
          icon="pi pi-external-link"
          onClick={async () => {
            setIsLoading(true);
            await fetchBluepayHPPPaymentURL();
            setIsLoading(false);
            //handleOpenDialog();
          }}
        />
        <Dialog
          visible={isDialogOpen} //{visible}
          modal
          header={headerElement}
          // eslint-disable-next-line react/forbid-component-props
          style={{ width: "50rem" }}
          onHide={() => handleCloseDialog()}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <>
              <div>
                {/* <label style={{ display: true ? "block" : "none" }}>
                  Bluepay HPP
                </label> */}
                <iframe
                  title="tokenframe"
                  className="-ml-2"
                  id="tokenframe"
                  name="tokenframe"
                  //   frameBorder="0"
                  //   scrolling="no"
                  width="100%"
                  height={"580"} //"200" //250
                  src={bluePayHPPURL}
                />
              </div>
            </>
          </form>
        </Dialog>
      </div>
    </>
  );
}

BluepayHostedPayment.propTypes = {
  options: PropTypes.shape({
    body: PropTypes.object,
    getRemotePaymentRequestURL: PropTypes.string.isRequired,
    handleOnPayment: PropTypes.func.isRequired,
    processBluepayResponseURL: PropTypes.string.isRequired,
    selectedOutstandingOrders: PropTypes.arrayOf(PropTypes.object)
  }).isRequired
};
