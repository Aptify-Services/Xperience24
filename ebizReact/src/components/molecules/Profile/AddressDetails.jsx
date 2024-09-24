import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { _get, _patch } from "@api/APIClient.js";
import { HTTP_STATUS_CODES } from "@constants";
import { useToast } from "@context/ToasterProvider.jsx";
import { useStateUser } from "@hooks/useStateUser.js";
import { CustomCheckBox, CustomDropdown } from "@components/atoms/index.jsx";
import AddressForm from "@components/molecules/AddressForm.jsx";

import Loader from "../Loader";

function AddressDetails() {
  const user = useStateUser({});
  const UserId = user.LinkId;
  const isLoggedIn = user.isUserLoggedIn;
  const navigate = useNavigate();
  const [addressInfo, setAddressInfo] = useState([]);
  const [selectedAddressData, setSelectedAddressData] = useState([]);
  const [addressTypeList, setaddressTypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddressTypeDropdown, setselectedAddressTypeDropdown] = useState(null);
  const [preferAddresscheckedBox, setPreferAddressCheckedBox] = useState(false);
  // For Showing Single popup after saving changed details
  const [changesAddressList, setChangesAddressList] = useState([]);
  const [profileAddress, setProfileAddress] = useState([]);
  const { showToastSuccess, showToastInfo, showToastWarn } = useToast();
  const [isCheckBoxDisable, setIsCheckBoxDisable] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate, user]);

  useEffect(() => {
    fetchProfileDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchProfileDetails() {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setaddressTypeList([]);
        setProfileAddress([]);
        const [profileAddresResponse, personAddressResponse] = await Promise.all([
          profileAddressDetails(),
          personAddressDetails()
        ]);

        const combinedAddress = [...profileAddresResponse, ...personAddressResponse];

        setAddressInfo(combinedAddress);

        await Promise.all([setAddressValues(combinedAddress, profileAddresResponse.length)]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("An error occurred:", error);
      }
    };

    fetchDetails();
  }

  const profileAddressDetails = async () => {
    try {
      const response = await _get("v1/ProfilePersons/" + UserId + "/ProfileAddresses", {
        withCredentials: true
      });
      return response?.data; // Assuming response.data contains person address details
    } catch (error) {
      console.error("Error fetching for profile details:", error);
      throw error; // Propagate the error
    }
  };

  const personAddressDetails = async () => {
    try {
      const response = await _get("v1/ProfilePersons/" + UserId + "/PersonAddresses", {
        withCredentials: true
      });
      return response?.data; // Assuming response.data contains Profile Address details
    } catch (error) {
      console.error("Error fetching for profile details:", error);
      throw error; // Propagate the error
    }
  };

  const setAddressValues = async (combinedAddress, profileLenght) => {
    if (combinedAddress) {
      combinedAddress.forEach((values, index) => {
        const temp = {
          name: values?.name,
          code: values?.id
        };
        setaddressTypeList((_addressTypeList) => [..._addressTypeList, temp]);
        if (index < profileLenght) {
          setProfileAddress((_profileAddress) => [..._profileAddress, values?.name]);
          values.isPreferredAddressAvailable = true;
        } else {
          values.isPreferredAddressAvailable = false;
        }
        if (combinedAddress[index]?.isPreferredMailingAddress === true) {
          setselectedAddressTypeDropdown(temp);
          setSelectedAddressData(combinedAddress[index]);
          setPreferAddressCheckedBox(combinedAddress[index]?.isPreferredMailingAddress);
          setIsCheckBoxDisable(false);
        }
      });

      return 0;
    }
  };

  const saveAddressDetails = async () => {
    const addContactDetailsService = async (dataName) => {
      let url = "v1/ProfilePersons/" + UserId + "/ProfileAddresses/" + dataName?.name;
      if (profileAddress.includes(dataName?.name)) {
        url = "v1/ProfilePersons/" + UserId + "/ProfileAddresses/" + dataName?.name;
      } else {
        url = "v1/ProfilePersons/" + UserId + "/PersonAddresses/" + dataName?.name;
      }
      setLoading(true);
      const updateContactDetails = await _patch(url, dataName, {
        withCredentials: true
      });
      setLoading(false);

      if (updateContactDetails.status === HTTP_STATUS_CODES?.OK) {
        fetchProfileDetails();
        return true;
      }
    };

    const tempUserInfo = changesAddressList;
    const promises = tempUserInfo.map(async (values) => {
      try {
        const apiStatus = await addContactDetailsService(values);
        if (!apiStatus) {
          showToastWarn({
            summary: "warning",
            detail: "Unable to save."
          });
          throw new Error("Unable to save."); // To ensure the promise is rejected
        }
      } catch (error) {
        showToastWarn({
          summary: "warning",
          detail: "Unable to save."
        });
        console.error("Error saving contact details:", error);
        throw error; // Re-throw the error to propagate it to Promise.all
      }
    });

    try {
      await Promise.all(promises);
      setChangesAddressList([]);

      setLoading(false);
      if (promises?.length) {
        showToastSuccess({
          summary: "Success",
          detail: "All details saved successfully"
        });
      } else {
        showToastInfo({
          summary: "Information",
          detail: "No changes has been observed."
        });
      }
    } catch (error) {
      console.error("Error in saving some contact details:", error);
      setLoading(false);
    }
  };

  const onValueChange = async (formData) => {
    setSelectedAddressData(formData);
    const indexOfSelectedFeild = changesAddressList.findIndex((x) => x.name === formData?.name);
    if (indexOfSelectedFeild != -1) {
      changesAddressList[indexOfSelectedFeild] = formData;
    } else {
      changesAddressList.push(formData);
    }
    setChangesAddressList(changesAddressList);

    updateAddressInfoList(formData);
  };

  function updateAddressInfoList(formData) {
    const tempOrginalList = addressInfo;
    tempOrginalList.forEach((values, index) => {
      if (values?.name === formData?.name) {
        tempOrginalList[index] = formData;
        return;
      }
    });
    setAddressInfo(tempOrginalList);
  }

  function dropdownAddressTypeHandle(e) {
    setselectedAddressTypeDropdown(e?.value);
    addressInfo.forEach((values, index) => {
      if (e?.value?.name === values?.name) {
        setSelectedAddressData(values);
        setPreferAddressCheckedBox(addressInfo[index]?.isPreferredMailingAddress);
        setIsCheckBoxDisable(!addressInfo[index]?.isPreferredAddressAvailable);
      }
    });
  }

  async function preferAddresCheckedBoxHandle(e) {
    setPreferAddressCheckedBox(e?.checked);
    addressInfo.forEach((values, index) => {
      if (selectedAddressTypeDropdown?.name === values?.name) {
        addressInfo[index].isPreferredMailingAddress = true;
      } else {
        addressInfo[index].isPreferredMailingAddress = false;
      }
    });

    let url =
      "v1/ProfilePersons/" +
      UserId +
      "/ProfileAddresses/" +
      selectedAddressTypeDropdown.name +
      "/makePreferredMailing";
    if (profileAddress.includes(selectedAddressTypeDropdown.name)) {
      url =
        "v1/ProfilePersons/" +
        UserId +
        "/ProfileAddresses/" +
        selectedAddressTypeDropdown.name +
        "/makePreferredMailing";
    } else {
      url =
        "v1/ProfilePersons/" +
        UserId +
        "/PersonAddresses/" +
        selectedAddressTypeDropdown.name +
        "/makePreferredMailing";
    }
    const preferredAddressDetails = await _patch(url, selectedAddressTypeDropdown.id, {
      withCredentials: true
    });

    if (preferredAddressDetails.status === HTTP_STATUS_CODES.NO_CONTENT) {
      showToastSuccess({
        summary: "Success",
        detail: "Preferred Address updated successfully"
      });
    } else {
      showToastWarn({
        summary: "warning",
        detail: "Unable to updated preferred address."
      });
    }
  }

  return (
    <main>
      {loading && <Loader />}
      <div className="grid my-3">
        <div className="col-12 md:col-4">
          <label className="m-0 w-full" id="Address Type" htmlFor="Address Type">
            Address Type
          </label>
          <CustomDropdown
            options={addressTypeList}
            onChange={dropdownAddressTypeHandle}
            value={selectedAddressTypeDropdown}
            checkmark
            highlightOnSelect
            placeholder={"Address Type"}
            className="w-full"
            name="Address Type"
          />
        </div>
        <div className="col-12 md:col-4 flex align-items-center md:justify-content-center">
          <CustomCheckBox
            onChange={preferAddresCheckedBoxHandle}
            checked={preferAddresscheckedBox}
            id="preferredAddress"
            label={"Preferred Address"}
            disabled={isCheckBoxDisable}
          />
        </div>
        {/* Keeping this as commented for now as will be needing when implementing Verify Address functionality */}
        {/* <div className="col-12 md:col-4 flex align-items-center">
          <SimpleButton
            navigatelink={"false"}
            label={"Verify Address"}
            className={"simpleButtonStyle"}
            disabled
          />
        </div> */}
      </div>
      <AddressForm
        existingData={selectedAddressData}
        onSubmit={saveAddressDetails}
        onValueChange={onValueChange}
        loading={loading}
        buttonStyleFlag
        changeFlag={changesAddressList.length === 0 ? true : false}
      />
    </main>
  );
}

export default AddressDetails;
