import { InputText } from "primereact/inputtext";
import PropTypes from "prop-types";
import React from "react";
import "primeflex/primeflex.css";

import "@css/SearchBar.scss";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="p-d-flex p-flex-column w-full">
      <span className="p-input-icon-right w-full">
        <i className="pi pi-search" />
        <InputText
          id="searchInput"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search"
          className="w-full"
          aria-label="Search"
          aria-labelledby="Search"
          name={"Search"}
        />
      </span>
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired, // Current value of the search input
  onChange: PropTypes.func.isRequired // Function to handle changes in the search input
};

export default SearchBar;
