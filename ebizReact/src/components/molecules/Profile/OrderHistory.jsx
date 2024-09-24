import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";

import { useStateUser } from "@hooks/useStateUser";
import { SimpleButton } from "@components/atoms";
import { _get } from "@api/APIClient";
import { OrderHistoryDetails, SearchBar, EmptyGenericComponent } from "@components/molecules";
import { FILTER_SORT_OPTIONS, DEFAULT_DATE } from "@constants";
import { generateDateMMDDYYYY } from "@utils/generateDateTime";

function OrderHistory() {
  const navigate = useNavigate();
  const user = useStateUser({});
  const isLoggedIn = user.isUserLoggedIn;
  const UserId = user.LinkId;
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedRowDetails, setSelectedRowDetails] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(-1);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(orderHistory);
  const [filterKey, setFilterKey] = useState("0");
  const [expandedRows, setExpandedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate, user]);

  useEffect(() => {
    const fetchStates = async () => {
      await _get("v1/ProfilePersons/" + UserId + "/OrderHistory", {
        withCredentials: true
      })
        .then((orderDetails) => {
          const orderDetailsResponse = orderDetails?.data;
          if (orderDetailsResponse) {
            orderDetailsResponse?.reverse();
            setOrderHistory(orderDetailsResponse);
            orderDetailsResponse.forEach((values, index) => {
              const orderDate = new Date(values?.orderDate);
              const shipDate = new Date(values?.shipDate);

              let tempDate = generateDateMMDDYYYY(orderDate);
              if (tempDate === DEFAULT_DATE) {
                orderDetailsResponse[index].orderDate = "--";
              } else {
                orderDetailsResponse[index].orderDate = tempDate;
              }

              tempDate = generateDateMMDDYYYY(shipDate);
              if (tempDate === DEFAULT_DATE) {
                orderDetailsResponse[index].shipDate = "--";
              } else {
                orderDetailsResponse[index].shipDate = tempDate;
              }
              orderDetailsResponse[index].id = values.id.toString();
            });
            setFilteredData(orderDetailsResponse);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("error in order details", error);
        });

      // Set Filter for All Days
      setFilterKey("0");
    };

    if (!isLoggedIn) {
      navigate("/");
    } else {
      fetchStates();
    }
  }, [UserId, isLoggedIn, navigate, user]);

  const renderHeader = () => {
    return (
      <section className="grid pl-2">
        <div className="text-2xl font-bold col-12 md:col-4">Order History</div>
        <div className="col-12 md:col-4">
          <Dropdown
            options={FILTER_SORT_OPTIONS}
            value={filterKey}
            optionLabel="label"
            placeholder="Sort By Days"
            onChange={onFilterChange}
            className="eb-sort-dropdownStyle w-full"
            name="Sort By Days"
            aria-label="Sort By Days"
          />
        </div>
        <div className="col-12 md:col-4">
          <SearchBar
            value={searchText}
            onChange={handleSearchChange}
            className="eb-sort-dropdownStyle w-full"
          />
        </div>
      </section>
    );
  };

  const handleSearchChange = (value) => {
    setSearchText(value);

    const _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
  };

  const onFilterChange = (event) => {
    const value = event.value;

    setFilterKey(event.value);
    const currentDate = new Date();
    const currentDateTime = currentDate.getTime();
    if (value === "0") {
      setFilteredData(orderHistory);
    } else {
      const lastNDaysDate = new Date(currentDate.setDate(currentDate.getDate() - parseInt(value)));
      const lastNDaysDateTime = lastNDaysDate.getTime();
      const lastNDaysList = orderHistory
        .filter((x) => {
          const elementDateTime = new Date(x.orderDate).getTime();
          if (elementDateTime <= currentDateTime && elementDateTime > lastNDaysDateTime) {
            return true;
          }
          return false;
        })
        .sort((a, b) => {
          return new Date(b.orderDate) - new Date(a.orderDate);
        });
      setFilteredData(lastNDaysList);
    }
  };

  const getSeverity = (status) => {
    switch (status?.orderStatus?.trim()) {
      case "Shipped":
        return "success";

      case "Taken":
        return "warning";

      case "Cancelled":
        return "danger";

      case "Back-Ordered":
        return "info";

      default:
        return null;
    }
  };

  const statusBodyTemplate = (status) => {
    return <Tag value={status?.orderStatus} severity={getSeverity(status)} />;
  };

  function toggleRow(data) {
    setExpandedRows(data);
  }

  const expandButtonTemplate = (rowData) => {
    return (
      <SimpleButton
        text
        className="text-sm p-1 border-none"
        label={selectedRowDetails?.id === rowData?.id ? "Hide Details" : "Show Details"}
        onClick={(e) => toggleRowExpansion(e, rowData)}
      />
    );
  };

  const toggleRowExpansion = (event, rowData) => {
    setSelectedOrderId(rowData?.id);

    const _expandedRows = expandedRows ? expandedRows : [];
    if (_expandedRows.some((r) => r?.id === rowData?.id)) {
      // make selected null as we are deselecting it by hidding details and pop from our array
      setSelectedRowDetails(null);
      _expandedRows.pop();
    } else {
      setSelectedRowDetails(rowData);
      // pop the existing row details
      _expandedRows.pop();
      // push new selected row details
      _expandedRows.push(rowData);
    }

    setExpandedRows(_expandedRows);
  };

  return (
    <div className="h-auto eb-border-gray w-full">
      {loading && (
        <div className="eb-loader-wrapper">
          <div className="eb-loader" />
          <div className="loading-text">Loading...</div>
        </div>
      )}
      {!loading && (
        <>
          {orderHistory?.length <= 0 && (
            <EmptyGenericComponent
              label="EmptyOrderList"
              msgDisplay="You don't have any orders."
              btnLabel="Start Shopping"
            />
          )}
          {orderHistory?.length > 0 && (
            <DataTable
              value={filteredData}
              filters={filters}
              emptyMessage={
                <EmptyGenericComponent label="NoProductFound" msgDisplay="No records found." />
              }
              paginator
              rows={15}
              sortMode="multiple"
              rowsPerPageOptions={[5, 10, 25, 50]}
              header={renderHeader}
              expandedRows={expandedRows}
              rowExpansionTemplate={
                <OrderHistoryDetails
                  selectedOrderId={selectedOrderId}
                  selectedRowDetails={selectedRowDetails}
                />
              }
              onRowToggle={(e) => toggleRow(e.data)}
              className="text-sm md:text-base"
            >
              <Column field="id" sortable header="Order Id" />
              <Column field="orderDate" sortable header="Order Date" />
              <Column field="shipDate" header="Ship Date" />
              <Column
                field="orderStatus"
                sortable
                header="Order Status"
                body={statusBodyTemplate}
              />
              <Column field="shipmentMethod" header="Shipment Method" />
              <Column className="p-2" body={expandButtonTemplate} />
            </DataTable>
          )}
        </>
      )}
    </div>
  );
}

export default OrderHistory;
