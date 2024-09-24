import React, { useState, useEffect, useMemo, useTransition, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { contactDetailsValidationSchema } from "@validations/contactDetailsValidation";
import { useStateUser } from "@hooks/useStateUser.js";
import { _get, _patch } from "@api/APIClient";
import { useToast } from "@context/ToasterProvider.jsx";
import { SimpleButton } from "@components/atoms";
import { FormBuilder, Loader } from "@components/molecules";
import { HTTP_STATUS_CODES } from "@constants";

function PhoneDetails() {
  const [, startTransition] = useTransition();
  const form = useForm({
    mode: "onChange",
    resolver: yupResolver(contactDetailsValidationSchema)
  });

  const {
    setValue,
    watch,
    formState: { isSubmitting, isValid }
  } = form;
  const [isDirty, setIsDirty] = useState(false);
  const user = useStateUser({});
  const UserId = user.LinkId;
  const { showToastSuccess, showToastWarn, showToastInfo } = useToast();
  const [phoneInfo, setPhoneInfo] = useState([]);
  const [businessType, setbusinessType] = useState([]);
  const [changeInfoList, setChangeInfoList] = useState([]);
  const [profilePhones, setProfilePhones] = useState([]);
  const [phoneType] = watch(["phoneType"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setbusinessType([]);
        setProfilePhones([]);

        const [profilePhonesResponse, personPhonesResponse] = await Promise.all([
          profilePhoneDetails(),
          personPhoneDetails()
        ]);

        const combinedPhoneList = [...profilePhonesResponse, ...personPhonesResponse];

        setPhoneInfo(combinedPhoneList);

        await Promise.all([setPhoneValues(combinedPhoneList, profilePhonesResponse.length)]);
        setLoading(false);
      } catch (error) {
        console.error("An error occurred:", error);
        setLoading(false);
        // Handle error appropriately
      }
    };

    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profilePhoneDetails = async () => {
    try {
      const response = await _get("v1/ProfilePersons/" + UserId + "/ProfilePhones", {
        withCredentials: true
      });
      return response.data; // Assuming response.data contains person address details
    } catch (error) {
      console.error("Error fetching for profile details:", error);
      throw error; // Propagate the error
    }
  };

  const personPhoneDetails = async () => {
    try {
      const response = await _get("v1/ProfilePersons/" + UserId + "/PersonPhones", {
        withCredentials: true
      });
      return response.data; // Assuming response.data contains Profile Address details
    } catch (error) {
      console.error("Error fetching for profile details:", error);
      throw error; // Propagate the error
    }
  };

  const setPhoneValues = async (combinedPhoneList, profileLenght) => {
    if (combinedPhoneList) {
      combinedPhoneList.forEach((values, index) => {
        const temp = {
          name: values.name,
          code: `${index}`
        };
        setbusinessType((_businessType) => [..._businessType, temp]);
        if (index < profileLenght) {
          setProfilePhones((_profilePhones) => [..._profilePhones, values.name]);
        }
        if (values.isPreferredPhone) {
          setValue("phoneType", temp);
          setValue("name", values.name);
          setValue("countryCode", values.countryCode);
          setValue("areaCode", values.areaCode);
          setValue("phone", values.phone);
          setValue("phoneExtension", values.phoneExtension);
        }
      });
    }
  };

  function handlePhoneTypeChange(_name, value) {
    phoneInfo.forEach((values) => {
      if (value.name === values.name) {
        setValue("name", values.name);
        setValue("countryCode", values.countryCode);
        setValue("areaCode", values.areaCode);
        setValue("phone", values.phone);
        setValue("phoneExtension", values.phoneExtension);
      }
    });
  }

  const onValueChange = useCallback(
    async (name, value) => {
      const tempPhoneInfo = phoneInfo;
      let selectedPhoneType = phoneType.name;
      if (name === "phoneType") {
        selectedPhoneType = value?.name;
      }
      startTransition(() => {
        tempPhoneInfo.forEach((values, index) => {
          if (selectedPhoneType === values.name || value?.name === values.name) {
            let temp = values;
            if (name === "countryCode" || name === "areaCode") {
              if (value.length <= 3) {
                temp = { ...temp, [name]: value };
                setValue(name, value);
              } else {
                temp = { ...temp, [name]: value.slice(0, 3) };
                setValue(name, value.slice(0, 3));
              }
            } else if (name !== "phoneType") {
              temp = { ...temp, [name]: value };
              setValue(name, value);
            }
            tempPhoneInfo[index] = temp;
            changeInfoList[index] = temp;
            changeInfoList[index].isDirty = selectedPhoneType === values.name;
          }
        });
        setChangeInfoList(changeInfoList.filter((x) => x.isDirty));
        setPhoneInfo(tempPhoneInfo);
      });
    },
    [changeInfoList, phoneInfo, phoneType, setValue]
  );

  async function savePhoneDetails() {
    setLoading(true);
    setIsDirty(false);
    const addContactDetailsService = async (dataName) => {
      const { countryCode, areaCode, phone, phoneExtension } = dataName ?? {};
      const payload = {
        countryCode,
        areaCode,
        phone,
        phoneExtension
      };
      dataName.formattedPhone = `(${dataName?.areaCode}) ${dataName?.phone}`;
      let url = "v1/ProfilePersons/" + UserId + "/ProfilePhones/" + dataName.name;
      if (profilePhones.includes(dataName.name)) {
        url = "v1/ProfilePersons/" + UserId + "/ProfilePhones/" + dataName.name;
      } else {
        url = "v1/ProfilePersons/" + UserId + "/PersonPhones/" + dataName.name;
      }
      const updateContactDetails = await _patch(url, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (updateContactDetails.status === HTTP_STATUS_CODES.OK) {
        return true;
      }
    };

    const tempUserInfo = changeInfoList;

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
      setChangeInfoList([]);
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

    setChangeInfoList([]);
  }

  const fields = useMemo(
    () => [
      {
        type: "group",
        group: [
          {
            type: "dropdown",
            name: "phoneType",
            options: businessType,
            label: "Phone Type"
          },
          {
            type: "text",
            name: "countryCode",
            label: "Country Code",
            inputMaxLength: 3
          },
          {
            type: "text",
            name: "areaCode",
            label: "Area Code",
            inputMaxLength: 3
          }
        ]
      },
      {
        type: "group",
        group: [
          {
            type: "text",
            name: "phone",
            label: "Phone",
            className: "col-12 md:col-4",
            isRequired: true,
            inputMaxLength: 15
          },
          {
            type: "text",
            name: "phoneExtension",
            label: "Extension",
            className: "col-12 md:col-4"
          }
        ]
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [businessType, phoneType?.name]
  );

  return (
    <div className="mt-4">
      {loading && <Loader />}
      <FormBuilder
        onValueChange={(name, value) => {
          setIsDirty(true);
          if (name === "phoneType") {
            handlePhoneTypeChange(name, value);
          } else {
            onValueChange(name, value);
          }
        }}
        onSubmit={savePhoneDetails}
        fields={fields}
        form={form}
      >
        <div className="col-12 md:col-4 mt-5 mb-3 p-0">
          <SimpleButton
            type="submit"
            label={"Save Changes"}
            disabled={isSubmitting || !isDirty || !isValid}
            loading={loading}
          />
        </div>
      </FormBuilder>
    </div>
  );
}

export default PhoneDetails;
