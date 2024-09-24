import { AutoComplete } from "primereact/autocomplete";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { propTypes } from "react-bootstrap/esm/Image";
import { yupResolver } from "@hookform/resolvers/yup";

import { _get } from "@api/APIClient.js";
import SimpleButton from "@components/atoms/Buttons/SimpleButton.jsx";
import CustomInputField from "@components/atoms/TextFields/CustomInputField.jsx";
import { addressValidation } from "@validations/addressValidation";

const AddressForm = ({
  existingData,
  onSubmit,
  onValueChange,
  buttonStyleFlag,
  countryList,
  changeFlag
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isValid } //,
    //etValues
  } = useForm({
    defaultValues: existingData || {
      id: -1,
      name: "",
      line1: "",
      line2: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
      isPreferredBillingAddress: true,
      isPreferredShippingAddress: true,
      isPreferredMailingAddress: true
    },
    resolver: yupResolver(addressValidation),
    mode: "onBlur"
  });

  const [data, setData] = useState({
    stateProvince: "FM",
    country: "United+States"
  });
  const [countries, setCountries] = useState(countryList || []);
  const [statesProvinces, setStatesProvinces] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredStatesProvinces, setFilteredStatesProvinces] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(
    existingData ? existingData.country : null
  );
  const [selectedStateProvince, setSelectedStateProvince] = useState(
    existingData ? existingData.stateProvince : null
  );

  useEffect(() => {
    setSelectedCountry(existingData ? existingData?.country : null);

    if (existingData) {
      reset(existingData);
    } else {
      setValue("validate", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingData, reset]);

  useEffect(() => {
    if (countries.length < 1) {
      const fetchCountries = async () => {
        const resCountries = await _get("/v1/countries", {
          withCredentials: true
        });
        setCountries(resCountries.data);
      };
      fetchCountries();
    }
  }, [countries.length]);

  useEffect(() => {
    //fetch state province for selected country if applicable
    const fetchSelectedProvince = async () => {
      try {
        if (selectedCountry) {
          const filteredIds = countries
            .filter(
              (countryObj) => countryObj?.country?.toLowerCase() === selectedCountry?.toLowerCase()
            )
            .map((countryObj) => countryObj.id);

          if (filteredIds.length > 0) {
            const stateProvinces = await fetchStateProvince(filteredIds[0]);

            const selectedState = stateProvinces
              .filter(
                (stateProvinceObj) =>
                  stateProvinceObj.state.toLowerCase() ===
                  existingData?.stateProvince?.toLowerCase()
              )
              .map((stateProvinceObj) => stateProvinceObj.stateName);
            if (selectedState.length > 0) {
              setSelectedStateProvince(selectedState[0]);
            }
          }
        }
      } catch (error) {
        //do nothing as of now
      }
    };
    fetchSelectedProvince();
  }, [selectedCountry, countries, existingData?.stateProvince]);

  useEffect(() => {
    const selectedState =
      statesProvinces?.find((x) => x.state === existingData?.stateProvince)?.stateName ?? "";
    setSelectedStateProvince(selectedState);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingData?.name, existingData?.stateProvince]);

  const submitHandler = async (_data) => {
    await onSubmit(_data);
  };

  const fetchStateProvince = async (countryId) => {
    const resStateProvince = await _get("/v1/country/" + countryId + "/states", {
      withCredentials: true
    });
    setStatesProvinces(resStateProvince.data);
    return resStateProvince.data;
  };

  const onCountryChangeHandler = (country) => {
    setSelectedStateProvince(null);

    const isValidCountry = checkIfValidCountry(country);

    setSelectedCountry(country);
    setData({
      ...data,
      country: country.country,
      stateProvince: ""
    });
    if (country.country !== undefined) {
      setSelectedStateProvince("");
      fetchStateProvince(country.id);
    }

    return isValidCountry;
  };

  const checkIfValidCountry = (country) => {
    return countries.some((countryObj) => countryObj.country === country);
  };

  const onStateChangeHandler = (state) => {
    setSelectedStateProvince(state);
    setData({
      ...data,
      stateProvince: state.state
    });
  };

  const searchCountry = (event) => {
    setFilteredCountries(
      countries.filter((country) =>
        country.country.toLowerCase().includes(event.query.toLowerCase())
      )
    );
  };

  const searchStateProvince = (event) => {
    setFilteredStatesProvinces(
      statesProvinces.filter((state) =>
        state.stateName.toLowerCase().includes(event.query.toLowerCase())
      )
    );
  };

  function onValueChanged(_data) {
    if (existingData) {
      let temp = existingData;
      // Replace the field value which matched with the field name which is changed.
      if (_data?.target?.name === "stateProvince") {
        temp = { ...temp, [_data?.target?.name]: _data?.target?.value?.state };
        onValueChange(temp);
      } else if (_data?.target?.name === "country") {
        if (checkIfValidCountry(_data?.target?.value?.country)) {
          temp = { ...temp, [_data?.target?.name]: _data?.target?.value?.country };

          temp = { ...temp, ["stateProvince"]: "" };
          onValueChange(temp);
        }
      } else {
        temp = { ...temp, [_data?.target?.name]: _data?.target?.value };
        onValueChange(temp);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} onChange={onValueChanged}>
      <div className="grid mt-2 md:mt-0">
        {!existingData && (
          <div className="col-12">
            <Controller
              name="addressName"
              control={control}
              rules={{ required: !existingData }}
              render={({ field }) => (
                <CustomInputField
                  {...field}
                  type="text"
                  isIconPresent={false}
                  label={!existingData && "Address Name"}
                  placeholder="Address Name"
                  disabled={isSubmitting || existingData}
                  // eslint-disable-next-line react/forbid-component-props
                  style={{ display: !existingData ? "block" : "none" }}
                  isRequired
                />
              )}
            />
            {errors?.addressName && (
              <small className="p-error">{errors?.addressName?.message}</small>
            )}
          </div>
        )}
        <div className="col-12 md:col-6">
          <Controller
            name="line1"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                type="text"
                isIconPresent={false}
                label="Address Line 1"
                placeholder="Address Line 1"
                disabled={isSubmitting}
                isRequired
              />
            )}
          />
          {errors?.line1 && <small className="p-error">{errors?.line1?.message}</small>}
        </div>
        <div className="col-12 md:col-6">
          <Controller
            name="line2"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                type="text"
                isIconPresent={false}
                label="Address Line 2"
                placeholder="Address Line 2"
                disabled={isSubmitting}
              />
            )}
          />
        </div>
        <div className="col-12 md:col-6">
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                type="text"
                isIconPresent={false}
                label="City"
                placeholder="City"
                disabled={isSubmitting}
                isRequired
              />
            )}
          />
          {errors?.city && <small className="p-error">{errors?.city?.message}</small>}
        </div>
        <div className="col-12 md:col-6">
          <Controller
            name="postalCode"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                type="text"
                isIconPresent={false}
                label="Zip"
                placeholder="Zip"
                disabled={isSubmitting}
              />
            )}
          />
        </div>
        <div className="col-12 md:col-6">
          <label htmlFor="country" className="eb-required">
            Country
          </label>
          <Controller
            name="country"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <AutoComplete
                {...field}
                id={field.name}
                name={field.name}
                value={selectedCountry}
                suggestions={filteredCountries}
                completeMethod={searchCountry}
                field="country"
                dropdown
                onChange={(e) => {
                  if (e.value !== undefined) {
                    field.onChange(e.value.country);
                    setValue("stateProvince", "");
                    onCountryChangeHandler(e.value);
                    onValueChanged(e);
                  }
                }}
                placeholder="Select a Country"
                className="w-full"
              />
            )}
          />
          {errors?.country && <small className="p-error">{errors?.country?.message}</small>}
        </div>
        <div className="col-12 md:col-6">
          <label htmlFor="stateProvince">State/Province</label>
          <Controller
            name="stateProvince"
            control={control}
            render={({ field }) => (
              <AutoComplete
                id={field.name}
                name={field.name}
                value={selectedStateProvince}
                suggestions={filteredStatesProvinces}
                completeMethod={searchStateProvince}
                field="stateName"
                dropdown
                showEmptyMessage
                emptyMessage="No results found"
                onChange={(e) => {
                  field.onChange(e.value.state);
                  onStateChangeHandler(e.value);
                  onValueChanged(e);
                }}
                placeholder="Select a State/Province"
                className="w-full"
              />
            )}
          />
        </div>
        <div className={buttonStyleFlag === true ? "col-4 mt-3" : "col-12"}>
          <SimpleButton
            type="submit"
            label={existingData ? "Save Address" : "Add Address"}
            disabled={isSubmitting || !isValid || changeFlag}
            loading={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};

AddressForm.propTypes = {
  existingData: PropTypes.shape({
    name: PropTypes.string,
    addressName: PropTypes.string,
    line1: PropTypes.string,
    line2: PropTypes.string,
    city: PropTypes.string,
    postalCode: PropTypes.string,
    country: PropTypes.string,
    stateProvince: PropTypes.string
  }),
  onValueChange: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  buttonStyleFlag: PropTypes.bool,
  countryList: propTypes.object,
  changeFlag: PropTypes.bool
};

export default AddressForm;
