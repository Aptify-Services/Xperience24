import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import { Panel } from "primereact/panel";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { _get } from "@api/APIClient.js";
import { ebConfig } from "@configuration/ebConfig.js";
import { useStateUser } from "@hooks/useStateUser.js";
import { useStateCart } from "@hooks/useStateCart";
import EmptyListComponent from "@components/molecules/EmptyGenericComponent";
import ValidPaymentPanels from "@components/molecules/PaymentMethods/ValidPaymentPanels.jsx";
import { addTableWithAriaLabelPayAmount } from "@utils/accessibilty.js";
import useMutationObserver from "@hooks/useMutationObserver.js";
import { generateDateMMDDYYYY } from "@utils/generateDateTime.js";
import { FloatingActionButton } from "@components/atoms/index.jsx";

import SavedPayments from "./SavedPayments.jsx";

const MakeMyPayment = () => {
  const navigate = useNavigate();
  const priceRef = useRef();
  const user = useStateUser({});
  const { cart } = useStateCart();
  const isLoggedIn = user.isUserLoggedIn;
  const UserId = user.LinkId;
  const [outstandingOrders, setOutstandingOrders] = useState([]);
  const [selectedOutstandingOrders, setSelectedOutstandingOrders] = useState([]);
  const [totalOutstandingAmountWithCurrency, setTotalOutstandingAmountWithCurrency] = useState();
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
  const [totalPaymentAmountWithCurrency, setTotalPaymentAmountWithCurrency] = useState(0);
  useMutationObserver(addTableWithAriaLabelPayAmount, [outstandingOrders?.length]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      fetchOutStandingOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let totalOutstanding = 0;
    let totalOutstandingWithCurrency;

    outstandingOrders.map((order) => {
      totalOutstanding += order.AmountDue;
      totalOutstandingWithCurrency =
        order.currencySymbol.trim() +
        totalOutstanding?.toFixed(ebConfig.roundOffDigitsAfterDecimal || 2);
    });
    setTotalOutstandingAmountWithCurrency(totalOutstandingWithCurrency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outstandingOrders]);

  useEffect(() => {
    calculateTotalPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOutstandingOrders]);

  const calculateTotalPayment = () => {
    let totalPayment = 0;
    let totalPaymentWithCurrency = 0;

    if (selectedOutstandingOrders.length > 0) {
      selectedOutstandingOrders.map((order) => {
        totalPayment += order.PayAmount;
        totalPaymentWithCurrency =
          order.currencySymbol.trim() +
          totalPayment?.toFixed(ebConfig.roundOffDigitsAfterDecimal || 2);
      });
    } else {
      totalPaymentWithCurrency =
        cart?.currencySymbol + totalPayment.toFixed(ebConfig.roundOffDigitsAfterDecimal || 2);
      setTotalPaymentAmountWithCurrency(totalPaymentWithCurrency);
    }
    setTotalPaymentAmount(totalPayment);
    setTotalPaymentAmountWithCurrency(totalPaymentWithCurrency);
  };

  const fetchOutStandingOrders = async () => {
    await _get("v1/ProfilePersons/" + UserId + "/OrderHistory/OutstandingOrders", {
      withCredentials: true
    })
      .then((outstandingOrdersList) => {
        setOutstandingOrders(outstandingOrdersList.data);
      })
      .catch((error) => {
        console.error("Error in Fetching Outstanding Orders", error);
      });
  };

  const payAmountChange = (e, rowData, column) => {
    rowData.PayAmount = e.value;

    //Do not allow null or zero as payable amount. Unselect the row.
    if (e.value == null || e.value <= 0 || e.value > rowData.AmountDue) {
      const selectedRows = column.props.selection;
      const filteredRows = selectedRows.filter((row) => {
        return row.OrderId !== rowData.OrderId;
      });
      setSelectedOutstandingOrders(filteredRows);
    }
    calculateTotalPayment();
  };

  const priceBodyTemplate = (rowData, e) => {
    return (
      rowData.currencySymbol.trim() +
      parseFloat(rowData[e.field]).toFixed(ebConfig.roundOffDigitsAfterDecimal || 2)
    );
  };

  const orderDateBodyTemplate = (rowData) => {
    const orderDate = generateDateMMDDYYYY(rowData.OrderDate);
    return orderDate;
  };

  const handleSelectionChange = (e) => {
    setSelectedOutstandingOrders(e.value);
  };

  const onRowSelect = (rowData) => {
    rowData.data.PayAmount = rowData.data.AmountDue;
  };

  const onRowUnselect = (rowData) => {
    rowData.data.PayAmount = null;
  };

  const onAllRowsSelect = (e) => {
    const rowsData = e.data;
    rowsData.map((row) => {
      row.PayAmount = row.AmountDue;
    });
  };

  const onAllRowsUnselect = () => {
    const rowsData = selectedOutstandingOrders;
    rowsData.map((row) => {
      row.PayAmount = "";
    });
  };

  const payAmountBodyTemplate = (rowData, column) => {
    return (
      <>
        <InputNumber
          value={rowData.PayAmount}
          maxFractionDigits={ebConfig.roundOffDigitsAfterDecimal || 2}
          allowEmpty={false}
          mode="decimal"
          onValueChange={(e) => payAmountChange(e, rowData, column)}
        />
        {rowData.PayAmount > rowData.AmountDue && (
          <small className="p-error">
            Payment amount should not be higher than balance amount.
          </small>
        )}
      </>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <section className="grid">
          <div className="text-2xl font-bold col-12 md:col-6 lg:col-4 xl:col-4 w-full">
            Unpaid Orders
          </div>
        </section>
      </>
    );
  };

  const renderFoater = () => {
    return (
      <>
        <section className="grid">
          <div className="col-12 text-xl py-2">Account and Payment Summary</div>
          <div className="col-12 md:col-6">
            <div className="">Total Outstanding : {totalOutstandingAmountWithCurrency}</div>
            <div>Total Payment : {totalPaymentAmountWithCurrency}</div>
          </div>
        </section>
      </>
    );
  };

  const renderPostPayment = () => {
    setOutstandingOrders([]);
    setSelectedOutstandingOrders([]);
    setTotalPaymentAmount(0);
    setTotalPaymentAmountWithCurrency(0);
    fetchOutStandingOrders();
  };

  const ccPaymentOptions = {
    paymentByCCURL:
      "v1/ProfilePersons/{personId}/OrderHistory/{orderId}/MakePayment/CreditCard".replace(
        "{personId}",
        UserId
      ),
    paymentFunction: "makeMyPayment",
    handleOnPayment: renderPostPayment,
    selectedOutstandingOrders: selectedOutstandingOrders,
    cardDetailsSchema: {
      cardNumberKey: "cardNumber",
      expirationMonthKey: "expirationMonth",
      expirationYearKey: "expirationYear",
      saveForFutureUseKey: "saveForFutureUse",
      isCreditCard: true
    }
  };

  const achPaymentOptions = {
    paymentByACHURL: "v1/ProfilePersons/{personId}/OrderHistory/{orderId}/MakePayment/ACH".replace(
      "{personId}",
      UserId
    ),
    paymentFunction: "makeMyPaymentACH",
    handleOnPayment: renderPostPayment,
    selectedOutstandingOrders: selectedOutstandingOrders
  };
  const bluepayHostedPaymentOptions = {
    getRemotePaymentRequestURL:
      "/v1/ProfilePersons/{personId}/OrderHistory/MakePayment/BulkOrder/GetRemotePaymentRequest".replace(
        "{personId}",
        UserId
      ),
    processBluepayResponseURL:
      "/v1/ProfilePersons/{personId}/OrderHistory/MakePayment/BulkOrder/ProcessRemoteResponse".replace(
        "{personId}",
        UserId
      ),
    handleOnPayment: renderPostPayment,
    selectedOutstandingOrders: selectedOutstandingOrders
  };

  const hostedIframeTokenizerOptions = {
    payByCreditCardTokenizerURL:
      "/v1/ProfilePersons/{id}/OrderHistory/MakePayment/BulkOrder/CreditCard".replace(
        "{id}",
        UserId
      ),
    payByACHTokenizerURL:
      "/v1/ProfilePersons/{id}/OrderHistory/MakePayment/BulkOrder/ACHTokenizer".replace(
        "{id}",
        UserId
      ),
    paymentFunction: "makePaymentByHostediFrameTokenizer",
    handleOnPayment: renderPostPayment,
    selectedOutstandingOrders: selectedOutstandingOrders,
    cardDetailsSchema: {
      cardNumberKey: "CCAccountNumber",
      expirationDateKey: "CCExpireDate",
      saveForFutureUseKey: "saveForFutureUse",
      saveToTypesKey: "saveToTypes"
    },
    achDetailsSchema: {
      accountNumberKey: "AccountNumber",
      accountNameKey: "AccountName",
      bankKey: "Bank",
      abaKey: "ABA",
      checkNumberKey: "CheckNumber",
      branchNameKey: "BranchName",
      saveForFutureUseKey: "saveForFutureUse",
      saveToTypesKey: "saveToTypes"
    }
  };

  const gPayPaymentOptions = {
    paymentURL: "v1/ProfilePersons/{personId}/OrderHistory/MakePayment/GPay".replace(
      "{personId}",
      UserId
    ),
    paymentFunction: "makePaymentByGPay",
    handleOnPayment: renderPostPayment,
    selectedOutstandingOrders: selectedOutstandingOrders,
    totalPriceToPay: totalPaymentAmount
  };

  const SPMOptions = {
    renderAddPayment: false,
    paymentMethod: "PayMakeMyPayment",
    paymentUrl: "/v1/ProfilePersons/" + UserId + "/OrderHistory/{orderId}/MakePayment/SavedPayment",
    handleOnPayment: renderPostPayment,
    selectedOutstandingOrders: selectedOutstandingOrders,
    showSavedCard: false
  };

  const ValidPaymentOptions = {
    bluepayHostedPaymentOptions: bluepayHostedPaymentOptions,
    achPaymentOptions: achPaymentOptions,
    ccPaymentOptions: ccPaymentOptions,
    hostedIframeTokenizerOptions: hostedIframeTokenizerOptions,
    gPayPaymentOptions: gPayPaymentOptions,
    isMakeMyPaymentPage: true
  };

  const handleFloatingActionClick = () => {
    priceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="h-auto eb-border-gray w-full">
      {outstandingOrders.length <= 0 && (
        <div className="mt-6">
          <EmptyListComponent label="unPaidOrders" msgDisplay="No Unpaid Orders." />
        </div>
      )}
      {outstandingOrders.length > 0 && (
        <div>
          <DataTable
            value={outstandingOrders}
            selectionMode={"checkbox"}
            selection={selectedOutstandingOrders}
            onSelectionChange={(e) => handleSelectionChange(e)}
            onRowSelect={onRowSelect}
            onRowUnselect={onRowUnselect}
            onAllRowsSelect={(e) => onAllRowsSelect(e)}
            onAllRowsUnselect={(e) => onAllRowsUnselect(e)}
            dataKey="OrderId"
            header={renderHeader}
            footer={renderFoater}
            className="text-sm md:text-base"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="OrderId" key="OrderId" header="Order ID" />
            <Column field="OrderType" header="Order Type" />
            <Column field="OrderDate" body={orderDateBodyTemplate} header="Order Date" />
            <Column field="OrderTotal" body={priceBodyTemplate} header="Total Amount" />
            <Column field="AmountDue" body={priceBodyTemplate} header="Balance Amount" />
            <Column
              field="PayAmount"
              header="Pay Amount"
              body={payAmountBodyTemplate}
              columnKey="PayAmount"
              name="PayAmount"
            />
          </DataTable>
          <div className="eb-container" ref={priceRef}>
            <div className="grid my-3">
              <div className="col-12">
                <Panel className="mb-3" header={"Saved Cards"} toggleable collapsed>
                  <SavedPayments options={SPMOptions} />
                </Panel>
                <ValidPaymentPanels options={ValidPaymentOptions} />
              </div>
            </div>
          </div>
        </div>
      )}
      {outstandingOrders?.length >= 10 && (
        <FloatingActionButton onClick={handleFloatingActionClick} />
      )}
    </main>
  );
};

export default MakeMyPayment;
