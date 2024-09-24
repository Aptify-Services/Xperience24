import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import GooglePayButton from "@google-pay/button-react";

import { _post } from "@api/APIClient";
import { GPAY_PAYMENT_FUNCTIONS } from "@constants";
import { getCountryCurrency } from "@store/CountryCurrencySlice";
import { useToast } from "@context/ToasterProvider.jsx";
import { useStateCart } from "@hooks/useStateCart";
import LoadingSpinner from "@components/atoms/LoadingSpinner.jsx";
import { ebConfig } from "@configuration/ebConfig";

export default function GPayPaymentMethod({ options }) {
  const dispatch = useDispatch();
  const { cart } = useStateCart();
  //   const countryCurrency = useSelector((state) => state.countryCurrency);
  const [loading, setLoading] = useState(false);
  const [countryCurrency, setCountryCurrency] = useState({});
  const { showToastError, showToastSuccess } = useToast();
  const defaulErrorMessage =
    "Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.";

  /**
   * An initialized google.payments.api.PaymentsClient object or null if not yet set
   *
   * @see {@link getGooglePaymentsClient}
   */
  let paymentsClient = null;

  useEffect(() => {
    dispatch(getCountryCurrency()).then((data) => {
      const isoCode = getCountryCurrencySymbol(data.payload, cart?.currencySymbol);
      setCountryCurrency({ ...isoCode });

      setLoading(false);
    });
  }, [cart?.currencySymbol, dispatch]);

  const getCountryCurrencySymbol = (countryCurrencyArray, currencySymbol) => {
    return countryCurrencyArray?.find((item) => item.CurrencySymbol == currencySymbol);
  };

  /**
   * Define the version of the Google Pay API referenced when creating your
   * configuration
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|apiVersion in PaymentDataRequest}
   */
  const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
  };

  /**
   * Card networks supported by your site and your gateway
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
   * @todo confirm card networks supported by your site and gateway
   */
  const allowedCardNetworks = ["AMEX", "DISCOVER", "MASTERCARD", "VISA"];

  /**
   * Card authentication methods supported by your site and your gateway
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
   * @todo confirm your processor supports Android device tokens for your
   * supported card networks
   */
  const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

  /**
   * Identify your gateway and your site's gateway merchant identifier
   *
   * The Google Pay API response will return an encrypted payment method capable
   * of being charged by a supported gateway after payer authorization
   *
   * @todo check with your gateway on the parameters to pass
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway|PaymentMethodTokenizationSpecification}
   */
  const tokenizationSpecification = {
    type: "PAYMENT_GATEWAY",
    parameters: {
      gateway: "cardconnect",
      gatewayMerchantId: ebConfig.cardConnectMerchantId
    }
  };

  /**
   * Describe your site's support for the CARD payment method and its required
   * fields
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
   */
  const baseCardPaymentMethod = {
    type: "CARD",
    parameters: {
      allowedAuthMethods: allowedCardAuthMethods,
      allowedCardNetworks: allowedCardNetworks
    }
  };

  /**
   * Describe your site's support for the CARD payment method including optional
   * fields
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
   */
  const cardPaymentMethod = Object.assign({}, baseCardPaymentMethod, {
    tokenizationSpecification: tokenizationSpecification
  });

  /**
   * Return an active PaymentsClient or initialize
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
   * @returns {google.payments.api.PaymentsClient} Google Pay API client
   */
  const getGooglePaymentsClient = () => {
    if (paymentsClient === null) {
      paymentsClient = {
        environment: ebConfig.cardConnectEnvironment,
        apiVersion: baseRequest.apiVersion,
        apiVersionMinor: baseRequest.apiVersionMinor,
        allowedPaymentMethods: [cardPaymentMethod],
        transactionInfo: getGoogleTransactionInfo(),
        merchantInfo: {
          merchantId: ebConfig.cardConnectMerchantId,
          merchantName: ebConfig.cardConnectMerchantName
        }
      };
    }
    return paymentsClient;
  };

  /**
   * Provide Google Pay API with a payment amount, currency, and amount status
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
   * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
   */
  const getGoogleTransactionInfo = () => {
    return {
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Total",
      totalPrice: options.totalPriceToPay.toString(),
      countryCode: countryCurrency.ISOCode || "US",
      currencyCode: countryCurrency.TradingSymbol || "USD"
    };
  };

  const isValidPayment = () => {
    if (options.selectedOutstandingOrders?.length <= 0) {
      showToastError({
        summary: "Error Message",
        detail: "Please select orders to pay off.",
        life: 3000
      });
      return false;
    } else {
      if (options.totalPriceToPay > 0) {
        return true;
      } else {
        showToastError({
          summary: "Error Message",
          detail: "Total price cannot be zero.",
          life: 3000
        });
        return false;
      }
    }
  };

  /**
   * Show Google Pay payment sheet when Google Pay payment button is clicked
   * @param {event} event Google Pay button click event
   */
  const onGooglePaymentButtonClicked = (event) => {
    if (!isValidPayment()) {
      event.preventDefault();
    }
  };

  const tokenizeDigiWalletData = async (gPayTokenData) => {
    try {
      setLoading(true);
      const postData = {
        encryptionhandler: "EC_GOOGLE_PAY",
        devicedata: gPayTokenData,
        CurrencyTypeId: cart?.currencyTypeId
      };
      const resToken = await _post("/v1/CardPointe/ccn/tokenize", postData, {
        withCredentials: true
      });

      if (options.paymentFunction === GPAY_PAYMENT_FUNCTIONS.CHECKOUT) {
        await payByGPay(resToken.data.outputToken);
      }
      if (options.paymentFunction === GPAY_PAYMENT_FUNCTIONS.MAKE_MY_PAYMENT) {
        await makePaymentByGPay(resToken.data.outputToken);
      }
      if (options.paymentFunction === GPAY_PAYMENT_FUNCTIONS.MAKE_MY_PAYMENT_WITHOUT_LOGIN) {
        await makePaymentByGPayWithoutLogin(resToken.data.outputToken);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showToastError({
        summary: "Error Message",
        detail:
          error.message != undefined && error.type != undefined
            ? error.type + ": " + (error.message || defaulErrorMessage)
            : error.message || defaulErrorMessage
      });
    }
  };

  const payByGPay = async (cpToken) => {
    const cardDetails = {
      cardNumber: cpToken,
      saveForFutureUse: false,
      CCPartial: ""
    };
    const paymentResponse = await _post("/v1/ShoppingCarts/Checkout/GPay", cardDetails, {
      withCredentials: true
    });
    options.handleOnPayment(paymentResponse.data.id);
  };

  const makePaymentByGPay = async (cpToken) => {
    const postDataArray = [];

    const selectedOutstandingOrders = options.selectedOutstandingOrders;
    selectedOutstandingOrders?.map(async (order) => {
      const cardDetails = {
        CCAccountNumber: cpToken
        //CCPartial: ""
      };
      cardDetails.paymentAmount = order.PayAmount;
      cardDetails.orderId = order.OrderId;
      postDataArray.push(cardDetails);
    });

    await _post(options.paymentURL, postDataArray, {
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
        options.handleOnPayment();
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

  const makePaymentByGPayWithoutLogin = async (cpToken) => {
    const cardDetails = {
      cardNumber: cpToken,
      saveForFutureUse: false
    };

    await _post(options.paymentURL, cardDetails, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        options.handleOnPayment();
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
      {loading && <LoadingSpinner />}
      <GooglePayButton
        buttonType={ebConfig.gPayButtonSettings.buttonType}
        buttonColor={ebConfig.gPayButtonSettings.buttonColor}
        paymentRequest={getGooglePaymentsClient()}
        onClick={(e) => onGooglePaymentButtonClicked(e)}
        onLoadPaymentData={(paymentRequest) => {
          const paymentToken = paymentRequest.paymentMethodData.tokenizationData.token;
          tokenizeDigiWalletData(paymentToken);
        }}
      />
    </>
  );
}

GPayPaymentMethod.propTypes = {
  options: PropTypes.shape({
    paymentFunction: PropTypes.oneOf([
      "payByGPay",
      "makePaymentByGPay",
      "makePaymentByGPayWithoutLogin"
    ]).isRequired,
    handleOnPayment: PropTypes.func.isRequired,
    selectedOutstandingOrders: PropTypes.arrayOf(PropTypes.object),
    paymentURL: PropTypes.string.isRequired,
    totalPriceToPay: PropTypes.number.isRequired
  }).isRequired
};
