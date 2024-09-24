import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import PropTypes from "prop-types";
import React, { useState } from "react";

import "primereact/resources/themes/saga-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import SearchBar from "./SearchBar";

const GridComponent = ({ data = [], columns }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (value) => {
    setSearchText(value);
    filterData(value);
  };
  const filterData = (value) => {
    const filtered = data.filter((item) =>
      Object.values(item).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  return (
    <div className="datatable-demo">
      <div className="card">
        <SearchBar value={searchText} onChange={handleSearchChange} />
        <DataTable value={filteredData}>
          {columns.map((column, index) => (
            <Column
              filter
              sortable
              key={index}
              field={column.field}
              header={column.header}
              body={column.body}
            />
          ))}
        </DataTable>
      </div>
    </div>
  );
};

GridComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object), // Array of objects representing the data for the grid
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      // Array of column configuration objects
      field: PropTypes.string.isRequired, // Field name from data object
      header: PropTypes.string.isRequired, // Header text for the column
      body: PropTypes.func // Function to customize the content of the cell
    })
  ).isRequired
};

export default GridComponent;
