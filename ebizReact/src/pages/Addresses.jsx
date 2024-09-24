import { Dialog } from "primereact/dialog";
import { Panel } from "primereact/panel";
import { RadioButton } from "primereact/radiobutton";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { _get, _patch, _post, _delete } from "@api/APIClient.js";
import CommonIconButtonComponent from "@components/atoms/Buttons/CommonIconButtonComponent.jsx";
import SimpleButton from "@components/atoms/Buttons/SimpleButton.jsx";
import CustomCheckBox from "@components/atoms/CheckBox/CustomCheckBox.jsx";
import { useToast } from "@context/ToasterProvider.jsx";
import { useStateCart } from "@hooks/useStateCart.js";
import { useStateUser } from "@hooks/useStateUser.js";
import { updateAddressIdToCart } from "@store/CartSlice.js";
import { AddressDialog, BilligAddressShimmer, EmptyGenericComponent } from "@components/molecules";

export default function Address({ addressList, selectedBillAdd, selectedShipAdd }) {
  const dispatch = useDispatch();
  const user = useStateUser({});
  const UserId = user.LinkId;
  const [addresses, setAddresses] = useState(addressList || []);
  const { showToastSuccess, showToastError } = useToast();

  const [selectedBillingAddress, setSelectedBillingAddress] = useState(
    addressList ? addressList[0] : {}
  );
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(
    addressList ? addressList[0] : {}
  );
  const [visibleDeletedDialog, setDeleteDialogVisible] = useState(false);
  const [countries, setCountries] = useState([]);
  const [, setStateList] = useState([]);
  const [choiceAddresss, setChoiceAddresss] = useState(addressList ? addressList[0] : {});
  const [rerender, setRerender] = useState(true);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({});

  const [addressIndexOfList, setAddressIndexOfList] = useState(0);

  const [loading, setLoading] = useState(true);

  const [shippingSameAsBilling, setshippingSameAsBilling] = useState(false);
  const { cart: cartData } = useStateCart();
  const isLoggedIn = user.isUserLoggedIn;

  const navigate = useNavigate();

  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const userId = UserId;
        setLoading(true);

        const [profileResponse, personResponse] = await Promise.all([
          _get(`/v1/ProfilePersons/${userId}/ProfileAddresses`, { withCredentials: true }),
          _get(`/v1/ProfilePersons/${userId}/PersonAddresses`, { withCredentials: true })
        ]);

        const profileAddresses = filteredAddresses(profileResponse.data);
        const personAddresses = filteredAddresses(personResponse.data).map((x) => ({
          ...x,
          isPersonAddress: true
        }));

        const combinedAddresses = [...profileAddresses, ...personAddresses];

        setAddresses(combinedAddresses);
        setSelectedBillingShipping();

        // Update address index
        const count = profileResponse.data.filter((values) => values.id > 0).length;
        setAddressIndexOfList(count);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
        setRerender(false);
      }
    };

    if (addresses?.length > 0 && !formSubmitted) {
      setSelectedBillingShipping();
    } else {
      fetchAddresses();
      selectedBillAdd(undefined);
      selectedShipAdd(undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender, selectedBillAdd, selectedShipAdd, cartData]);

  const filteredAddresses = (newData) => {
    // Filter out items with IDs that are not already present
    const filteredData = newData.filter(
      // (item) => !idSet.has(item.id) && item.id > 0
      (item) => item.id > 0
    );

    return filteredData;
  };

  function setSelectedBillingShipping() {
    const _filteredAddresses = addresses;

    let billingAddress = _filteredAddresses?.[0];
    if (cartData?.billingAddressId > 0) {
      billingAddress = getAddressById(cartData?.billingAddressId) || _filteredAddresses[0];
    }
    if (billingAddress) {
      // setSelectedBillingAddress(billingAddress);
      // selectedBillAdd(billingAddress);
      handleBillingAddressSelection(billingAddress);
      selectedBillAdd(billingAddress);
    }

    let shippingAddress = _filteredAddresses?.[0];
    if (cartData?.shippingAddressId > 0) {
      shippingAddress = getAddressById(cartData?.shippingAddressId) || _filteredAddresses?.[0];
    }
    if (shippingAddress) {
      // setSelectedShippingAddress(shippingAddress);
      // selectedShipAdd(shippingAddress);
      handleShippingAddressSelection(shippingAddress);
      selectedShipAdd(shippingAddress);
    }
    setRerender(false);
  }

  useEffect(() => {
    const fetchCountries = async () => {
      const resCountries = await _get("/v1/countries", {
        withCredentials: true
      });
      const countryResponse = resCountries.data;
      countryResponse.forEach((values) => {
        const temp = {
          name: values.country,
          code: values.ISOCode,
          id: values.id
        };

        setCountries((countryList) => [...countryList, temp]);
      });
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      // const resCountries = await _get("/v1/country/" + selectedCountryId + "/states", {
      const resCountries = await _get("/v1/country/222/states", {
        withCredentials: true
      });
      const stateResponse = resCountries.data;
      stateResponse.forEach((values) => {
        const temp = {
          name: values.stateName,
          code: values.state,
          id: values.id
        };
        setStateList((stateList) => [...stateList, temp]);
      });
    };
    fetchStates();
  }, []);

  const getAddressById = (addressId) => {
    return addresses?.find((item) => item?.id === addressId);
  };

  const setSelectedBillingAddressOnCart = (addressElement) => {
    if (shippingSameAsBilling) {
      setSelectedShippingAddress(addressElement);
      selectedShipAdd(addressElement);
    }
    const billingAddressId = addressElement.id;
    const shippingAddressId = shippingSameAsBilling ? billingAddressId : selectedShippingAddress.id;
    const addressPayload = {
      billingAddressId: billingAddressId,
      shippingAddressID: shippingAddressId
    };
    dispatch(updateAddressIdToCart(addressPayload)).then((response) => {
      console.info("response", response);
    });
  };

  const setSelectedShippingAddressOnCart = (addressElement) => {
    setSelectedShippingAddress(addressElement);
    selectedShipAdd(addressElement);
    const addressPayload = {
      billingAddressId: selectedBillingAddress.id,
      shippingAddressID: addressElement.id
    };
    dispatch(updateAddressIdToCart(addressPayload));
  };

  const setAddressOnCart = (addressElement) => {
    const addressPayload = {
      billingAddressId: addressElement.id,
      shippingAddressID: addressElement.id
    };
    dispatch(updateAddressIdToCart(addressPayload)).then((response) => {
      console.info("response", response);
    });
  };

  function handleAddressDialog(value, index) {
    const temp = {
      index: index,
      value: value
    };
    setChoiceAddresss(temp);
    setCurrentAddress(value);
    setShowAddressDialog(true);
  }

  function handleCloseDialog() {
    setCurrentAddress(null);
    setShowAddressDialog(false);
  }

  const handleAddressFormSubmit = async (data) => {
    handleFormSubmitted(false);
    if (currentAddress) {
      //call patch/update service
      const addressData = {
        id: data.id,
        name: data.name,
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        stateProvince: data.stateProvince,
        postalCode: data.postalCode,
        country: data.country
      };
      await updateAddressDetails(addressData);
      handleFormSubmitted(true);
    } else {
      //call add/post service
      await addAddressService(data);
      handleFormSubmitted(true);
    }
    setRerender(!rerender);
  };

  const handleFormSubmitted = (value) => {
    setFormSubmitted(value);
  };

  const postMessage = () => {
    const eventData = {
      action: "rerender",
      data: "rerenderAddresses"
    };
    window.parent.postMessage(eventData, "*");
  };

  const addAddressService = async (postData) => {
    if (!postData?.stateProvince) {
      delete postData?.stateProvince;
    }
    await _post("/v1/ProfilePersons/" + UserId + "/PersonAddresses", postData, {
      withCredentials: true
    })
      .then(() => {
        setShowAddressDialog(false);
        postMessage();
        showToastSuccess({
          summary: "Success",
          detail: "Changes have been successfully saved."
        });
      })
      .catch((error) => {
        showToastError({
          summary: "Error Message",
          detail:
            error?.message != undefined && error.type != undefined
              ? error.type + ": " + error?.message
              : error?.message
        });
      });
  };

  const updateAddressDetails = async (data) => {
    const addContactDetailsService = async (_data) => {
      let url = "v1/ProfilePersons/" + UserId + "/ProfileAddresses/" + _data.name;
      if (choiceAddresss?.index < addressIndexOfList) {
        url = "v1/ProfilePersons/" + UserId + "/ProfileAddresses/" + _data.name;
      } else {
        url = "v1/ProfilePersons/" + UserId + "/PersonAddresses/" + _data.name;
      }
      try {
        const updateContactDetails = await _patch(url, _data, {
          withCredentials: true
        });
        if (updateContactDetails?.data) {
          setShowAddressDialog(false);
          postMessage();
          showToastSuccess({
            summary: "Success",
            detail: "Changes have been successfully saved."
          });
        }
      } catch (e) {
        console.error("<<<<<<<<<", e);
      }
    };

    await addContactDetailsService(data);
  };

  function handleDeleteDialog(value, index) {
    const temp = {
      index: index,
      value: value
    };
    setChoiceAddresss(temp);
    setDeleteDialogVisible(true);
  }

  function YesDeleteAddressInfo() {
    handleFormSubmitted(true);
    const fetchAddressDetails = async () => {
      let url = "v1/ProfilePersons/" + UserId + "/ProfileAddresses/" + choiceAddresss.value.name;
      if (choiceAddresss.index < addressIndexOfList) {
        url = "v1/ProfilePersons/" + UserId + "/ProfileAddresses/" + choiceAddresss.value.name;
      } else {
        url = "v1/ProfilePersons/" + UserId + "/PersonAddresses/" + choiceAddresss.value.name;
      }
      await _delete(url, {
        withCredentials: true
      })
        .then(() => {
          setRerender(!rerender);
          selectedBillAdd(undefined);
          selectedShipAdd(undefined);
        })
        .catch((error) => {
          console.error("error in deleting address: ", error);
        });
    };

    fetchAddressDetails();
    setDeleteDialogVisible(false);
  }

  const checkShippingSameAsBilling = () => {
    return setshippingSameAsBilling(
      selectedBillingAddress?.name === selectedShippingAddress?.name &&
        selectedBillingAddress?.name !== undefined &&
        selectedBillingAddress?.name !== undefined
    );
  };

  function handleBillingAddressSelection(value) {
    setSelectedBillingAddress(value);
  }

  function handleShippingAddressSelection(value) {
    setSelectedShippingAddress(value);
  }

  function handleShippingSameAsBilling() {
    setshippingSameAsBilling(!shippingSameAsBilling);
  }

  useEffect(() => {
    checkShippingSameAsBilling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBillingAddress, selectedShippingAddress]);

  useEffect(() => {
    if (shippingSameAsBilling) {
      handleShippingAddressSelection(selectedBillingAddress);
      setAddressOnCart(selectedBillingAddress);
      selectedShipAdd(selectedBillingAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingSameAsBilling]);

  const confirmationFooter = (
    <div className="grid">
      <div className="col-6">
        <SimpleButton
          navigatelink={"false"}
          label={"No"}
          onClick={() => setDeleteDialogVisible(false)}
          className={"simpleButtonStyle"}
        />
      </div>
      <div className="col-6">
        <SimpleButton
          navigatelink={"false"}
          label={"Yes"}
          onClick={() => YesDeleteAddressInfo()}
          className={"simpleButtonStyle"}
        />
      </div>
    </div>
  );

  return (
    <div>
      {!loading && addresses?.length <= 0 && (
        <EmptyGenericComponent label="NoAddressAvailable" msgDisplay="No addresses available." />
      )}
      {loading && (
        <>
          <Panel header="Billing Address" className="mb-4">
            <BilligAddressShimmer />
          </Panel>
          <Panel header="Shipping Address" className="mb-4">
            <BilligAddressShimmer />
          </Panel>
        </>
      )}

      {addresses?.length > 0 && (
        <div>
          <Panel header="Billing Address" className="mb-4">
            <div className="grid grid-nogutter">
              {!loading &&
                addresses.map((address, index) => {
                  return (
                    <div className="col-12 lg:col-6 eb-address-card mb-3" key={address?.id}>
                      <div className="border-100 border-2 border-round-2xl p-3 h-full">
                        <div className="grid">
                          <div className="col-1">
                            <RadioButton
                              inputId={address?.id}
                              name="address"
                              value={address}
                              onChange={(e) => {
                                handleBillingAddressSelection(e?.value);
                                selectedBillAdd(e?.value);
                                setSelectedBillingAddressOnCart(e?.value);
                              }}
                              checked={selectedBillingAddress?.id === address?.id}
                            />
                          </div>
                          <div
                            className="col-7"
                            aria-label={`${address?.name && <>{address?.name},&nbsp;</>}
                              ${address?.line1 && <>{address?.line1},&nbsp;</>}
                              ${address?.line2 && <>{address?.line2},&nbsp;</>}
                              ${address?.postalCode && <>{address?.postalCode},&nbsp;</>}
                              ${address?.stateProvince && <>{address?.stateProvince},&nbsp;</>}
                              ${address?.country}`}
                            tabIndex={0}
                            role="link"
                          >
                            <label htmlFor={address.id} className="address__label eb-word-break">
                              {address?.name && <>{address?.name},&nbsp;</>}
                              {address?.line1 && <>{address?.line1},&nbsp;</>}
                              {address?.line2 && <>{address?.line2},&nbsp;</>}
                              {address?.postalCode && <>{address?.postalCode},&nbsp;</>}
                              {address?.stateProvince && <>{address?.stateProvince},&nbsp;</>}
                              {address?.country}
                            </label>
                          </div>
                          <div className="col-2">
                            <CommonIconButtonComponent
                              className="eb-icon-only-btn"
                              icon={"pi pi-pencil"}
                              rounded
                              outlined
                              aria-label={"Edit Billing Address" + address?.name}
                              onClick={() => {
                                handleAddressDialog(address, index);
                              }}
                            />
                          </div>
                          <div className="col-2">
                            <CommonIconButtonComponent
                              className="eb-icon-only-btn"
                              icon={"pi pi-trash"}
                              rounded
                              outlined
                              aria-label={"Delete Billing Address" + address?.name}
                              onClick={() => handleDeleteDialog(address, index)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Panel>
          <CustomCheckBox
            onChange={() => {
              handleShippingSameAsBilling();
            }}
            checked={shippingSameAsBilling}
            id="autorenew"
            label={"Shipping Same as Billing"}
            className="mb-4"
          />
          <Panel header="Shipping Address">
            <div className="grid grid-nogutter">
              {loading && <BilligAddressShimmer />}

              {!loading &&
                addresses.map((address, index) => {
                  return (
                    <div className="col-12 lg:col-6 eb-address-card mb-3" key={address?.id}>
                      <div className="border-100 border-2 border-round-2xl p-3 h-full">
                        <div className="grid">
                          <div className="col-1">
                            <RadioButton
                              inputId={`S-${address?.id}`}
                              name="address"
                              value={address}
                              onChange={(e) => {
                                handleShippingAddressSelection(e?.value);
                                setSelectedShippingAddressOnCart(e?.value);
                                selectedShipAdd(e?.value);
                              }}
                              checked={selectedShippingAddress?.id === address?.id}
                            />
                          </div>
                          <div
                            className="col-7"
                            tabIndex={0}
                            role="link"
                            aria-label={`${address?.name && <>{address?.name},&nbsp;</>}
                              ${address?.line1 && <>{address?.line1},&nbsp;</>}
                              ${address?.line2 && <>{address?.line2},&nbsp;</>}
                              ${address?.postalCode && <>{address?.postalCode},&nbsp;</>}
                              ${address?.stateProvince && <>{address?.stateProvince},&nbsp;</>}
                              ${address?.country}`}
                          >
                            <label
                              htmlFor={`S-${address?.id}`}
                              className="address__label eb-word-break"
                            >
                              {address?.name && <>{address?.name},&nbsp;</>}
                              {address?.line1 && <>{address?.line1},&nbsp;</>}
                              {address?.line2 && <>{address?.line2},&nbsp;</>}
                              {address?.postalCode && <>{address?.postalCode},&nbsp;</>}
                              {address?.stateProvince && <>{address?.stateProvince},&nbsp;</>}
                              {address?.country}
                            </label>
                          </div>
                          <div className="col-2">
                            <CommonIconButtonComponent
                              className="eb-icon-only-btn"
                              icon={"pi pi-pencil"}
                              rounded
                              outlined
                              aria-label={"Edit Shipping Address" + address?.name}
                              onClick={() => {
                                handleAddressDialog(address, index);
                              }}
                            />
                          </div>
                          <div className="col-2">
                            <CommonIconButtonComponent
                              className="eb-icon-only-btn"
                              icon={"pi pi-trash"}
                              aria-label={"Delete Shipping Address" + address?.name}
                              rounded
                              outlined
                              onClick={() => handleDeleteDialog(address, index)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Panel>
        </div>
      )}
      <AddressDialog
        visible={showAddressDialog}
        existingData={currentAddress}
        handleSubmit={handleAddressFormSubmit}
        onHide={handleCloseDialog}
        countries={countries}
      />
      <SimpleButton
        label={"Add New Address"}
        className="mt-3 w-full"
        onClick={() => {
          handleAddressDialog();
        }}
      />

      <Dialog
        header="Delete Address info"
        visible={visibleDeletedDialog}
        className="w-6"
        breakpoints={{ "991px": "75vw", "767px": "95vw" }}
        onHide={() => setDeleteDialogVisible(false)}
        footer={confirmationFooter}
      >
        <p className="m-0">Are you sure you want to delete this address?</p>
      </Dialog>
    </div>
  );
}

Address.propTypes = {
  addressList: PropTypes.arrayOf(PropTypes.object).isRequired,
  addressIndex: PropTypes.number,
  selectedBillAdd: PropTypes.string,
  selectedShipAdd: PropTypes.string
};
