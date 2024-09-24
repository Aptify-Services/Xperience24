import { Dialog } from "primereact/dialog";
import PropTypes from "prop-types";
import React from "react";
import { propTypes } from "react-bootstrap/esm/Image";

import { addAriaLabelOnCloseButton, addAriaLabelOnExpandIcon } from "@utils/accessibilty";
import useMutationObserver from "@hooks/useMutationObserver";

import AddressForm from "./AddressForm";

const AddressDialog = ({ visible, onHide, handleSubmit, existingData, countryList }) => {
  useMutationObserver(addAriaLabelOnCloseButton, []);
  useMutationObserver(addAriaLabelOnExpandIcon, []);

  const onValueChange = async () => {
    // OnChange method if required for operation.
    // Here it is no need for now
  };
  return (
    <Dialog
      header={existingData ? "Edit Address" : "Add New Address"}
      visible={visible}
      className="w-6"
      breakpoints={{ "991px": "75vw", "767px": "95vw" }}
      onHide={onHide}
    >
      <AddressForm
        existingData={existingData}
        onSubmit={handleSubmit}
        onValueChange={onValueChange}
        buttonStyleFlag={false}
        countryList={countryList}
      />
      {/* <AddressForm existingData={existingData} handleOnSubmit={handleSubmit} /> */}
    </Dialog>
  );
};

AddressDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  existingData: PropTypes.object, // Assuming existingData is an object, adjust as per its actual type
  countryList: propTypes.object
};

export default AddressDialog;
