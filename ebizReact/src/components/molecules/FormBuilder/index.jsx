import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import "@css/Form.scss";

import { Form } from "@components/atoms/FormElements";
import { FORM_FIELDS } from "@constants";

import Field from "./Field";

const FormBuilder = ({ children, ...props }) => {
  const { fields, form, onSubmit, onValueChange, onDropdownChange } = props;

  const formFields = useCallback(
    () => {
      return fields.map((fieldGroup, index) => {
        if (fieldGroup.type === FORM_FIELDS.GROUP) {
          return (
            <div key={index} className="formgrid grid">
              {fieldGroup.group.map((field, grpIndex) => (
                <Field
                  {...field}
                  key={`${grpIndex} ${field?.name}`}
                  form={form}
                  className={`${!field?.hasNoFieldClass && "field"} ${field?.className ?? "col-12 md:col"}`}
                  onFieldValueChange={onValueChange}
                  onDropdownChange={onDropdownChange}
                />
              ))}
            </div>
          );
        }
        return (
          <Field
            {...fieldGroup}
            form={form}
            key={`${index} ${fieldGroup?.name}`}
            className={`${fieldGroup?.className ?? ""}`}
            onFieldValueChange={onValueChange}
            onDropdownChange={onDropdownChange}
          />
        );
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields, form]
  );

  const memoizedFormFields = useMemo(() => formFields(), [formFields]);

  const handleSubmit = useCallback(
    (data) => {
      const cloneData = JSON.parse(JSON.stringify(data));
      onSubmit(cloneData);
    },
    [onSubmit]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-1">
        {memoizedFormFields}
        {children}
      </form>
    </Form>
  );
};

FormBuilder.propTypes = {
  onValueChange: PropTypes.func,
  onDropdownChange: PropTypes.func,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      hasNoFieldClass: PropTypes.bool,
      autoCompleteFilterKey: PropTypes.string,
      className: PropTypes.string,
      name: PropTypes.string,
      label: PropTypes.string,
      type: PropTypes.oneOf([
        "text",
        "password",
        "checkbox",
        "group",
        "dropdown",
        "checkbox-group",
        "date",
        "component",
        "element",
        "autocomplete"
      ]).isRequired,
      id: PropTypes.string,
      required: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired
        })
      )
    })
  ).isRequired,
  form: PropTypes.any.isRequired,
  onSubmit: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.node,
  optionLabel: PropTypes.string
};

export default FormBuilder;
