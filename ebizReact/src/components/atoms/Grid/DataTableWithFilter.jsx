import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import PropTypes from "prop-types";
import React from "react";

function DataTableWithFilter(props) {
  const HeaderFields = props.TableFieldsHeader;
  const filterDataVariable = props.filterData;

  return (
    <div>
      <DataTable
        removableSort
        value={filterDataVariable}
        // globalFilterFields={TableFields}
        // filterDisplay="row"
        emptyMessage="No product found."
        filters={props.filterData}
      >
        {HeaderFields.map((tableHeader) => (
          <Column
            sortable
            showFilterMenu={false}
            key={tableHeader.key}
            field={tableHeader.field}
            header={tableHeader.header}
            filter
            //   body={tableHeader.body}
          />
        ))}
      </DataTable>
    </div>
  );
}

DataTableWithFilter.propTypes = {
  TableFieldsHeader: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired
    })
  ).isRequired,
  filterData: PropTypes.array.isRequired
};

export default DataTableWithFilter;
