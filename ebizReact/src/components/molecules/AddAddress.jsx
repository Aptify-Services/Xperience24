import { AutoComplete } from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { _get, _post } from "@api/APIClient.js";
import { useStateUser } from "@hooks/useStateUser.js";
import { LoadingSpinner, SimpleButton, CustomInputField } from "@components/atoms/index.jsx";

function AddAddress({ reRenderBillingShipping }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid }
  } = useForm({ mode: "onChange" });

  const user = useStateUser({});

  const [data, setData] = useState({
    countryId: 0,
    addressName: "addr+name",
    line1: "srfts",
    line2: "srtg",
    city: "srtbsrt",
    stateProvince: "FM",
    postalCode: "782578",
    country: "United+States"
  });

  const [countries, setCountries] = useState([]);
  const [statesProvinces, setStatesProvinces] = useState([]);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredStatesProvinces, setFilteredStatesProvinces] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedStateProvince, setSelectedStateProvince] = useState(null);

  const onSubmit = async (formdata) => {
    //formdata.country = data.country;
    formdata.stateProvince = data.stateProvince;
    if (formdata.country !== undefined) {
      const response = await addAddressService(formdata);
      setVisibleDialog(false);
      reRenderBillingShipping(response);
    }
  };

  const addAddressService = async (postData) => {
    await _post("/v1/ProfilePersons/" + user.LinkId + "/PersonAddresses", postData, {
      withCredentials: true
    });
  };

  const fetchStateProvince = async (countryId) => {
    const resStateProvince = await _get("/v1/country/" + countryId + "/states", {
      withCredentials: true
    });
    setStatesProvinces(resStateProvince.data);
  };

  const onCountryChangeHandler = (country) => {
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

  useEffect(() => {
    const fetchCountries = async () => {
      const resCountries = await _get("/v1/countries", {
        withCredentials: true
      });
      setCountries(resCountries.data);
    };
    fetchCountries();
  }, []);

  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-5">
          <SimpleButton label="Add New Address" onClick={() => setVisibleDialog(true)} />
        </div>
      </div>
      <Dialog
        header="Add Address"
        visible={visibleDialog}
        className="w-6"
        breakpoints={{ "991px": "75vw", "767px": "95vw" }}
        onHide={() => setVisibleDialog(false)}
      >
        {isSubmitting && <LoadingSpinner />}
        <div className="eb-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid">
              <div className="col-12">
                <Controller
                  name="addressName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomInputField
                      {...field}
                      type="text"
                      isiconpresent={false}
                      label="Address Name"
                      placeholder="Address Name"
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.addressName && <span>Address Name is required</span>}
              </div>
              <div className="col-6">
                <Controller
                  name="line1"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomInputField
                      {...field}
                      type="text"
                      isiconpresent={false}
                      label="Address Line 1"
                      placeholder=""
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.line1 && <span>Address Line 1 is required</span>}
              </div>
              <div className="col-6">
                <Controller
                  name="line2"
                  control={control}
                  render={({ field }) => (
                    <CustomInputField
                      {...field}
                      type="text"
                      isiconpresent={false}
                      label="Address Line 2"
                      placeholder=""
                      disabled={isSubmitting}
                    />
                  )}
                />
              </div>
              <div className="col-6">
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomInputField
                      {...field}
                      type="text"
                      isiconpresent={false}
                      label="City"
                      placeholder=""
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.city && <span>City is required</span>}
              </div>
              <div className="col-6">
                <Controller
                  name="postalCode"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomInputField
                      {...field}
                      type="text"
                      isiconpresent={false}
                      label="Zip"
                      placeholder=""
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.postalCode && <span>Zip/Postal Code is required</span>}
              </div>
              <div className="col-6">
                <label htmlFor="country">Country</label>
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <AutoComplete
                      id={field.name}
                      value={selectedCountry}
                      suggestions={filteredCountries}
                      completeMethod={searchCountry}
                      field="country"
                      dropdown
                      onChange={(e) => {
                        if (e.value !== undefined) {
                          field.onChange(e.value.country);
                          onCountryChangeHandler(e.value);
                        }
                      }}
                      placeholder="Select a Country"
                      className="w-full"
                    />
                  )}
                />
              </div>
              <div className="col-6">
                <label htmlFor="stateProvince">State/Province</label>
                <Controller
                  name="stateProvince"
                  control={control}
                  render={({ field }) => (
                    <AutoComplete
                      id={field.name}
                      value={selectedStateProvince}
                      suggestions={filteredStatesProvinces}
                      completeMethod={searchStateProvince}
                      field="stateName"
                      dropdown
                      onChange={(e) => {
                        field.onChange(e.value.state);
                        onStateChangeHandler(e.value);
                      }}
                      placeholder="Select a State/Province"
                      className="w-full"
                    />
                  )}
                />
              </div>
              <div className="col-12">
                <SimpleButton
                  type="submit"
                  label="Add Address"
                  disabled={isSubmitting || !isValid}
                />
              </div>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
}

AddAddress.propTypes = {
  reRenderBillingShipping: PropTypes.func.isRequired
};

export default AddAddress;
