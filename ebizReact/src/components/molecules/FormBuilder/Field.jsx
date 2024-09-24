/* eslint-disable react/forbid-prop-types */
import React, { useId, useState, useTransition } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { AutoComplete } from "primereact/autocomplete";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@components/atoms/FormElements";
import {
  CommonDatePicker,
  CustomCheckBox,
  CustomDropdown,
  CustomInputField,
  CustomPasswordField,
  CheckboxGroup
} from "@components/atoms";
import { FORM_FIELDS } from "@constants";

const Field = ({
  type,
  name,
  label,
  isRequired = false,
  component: Component,
  element,
  className,
  options,
  disabled,
  inputMaxLength,
  autoCompleteFilterKey,
  optionLabel,
  onFieldValueChange = () => {},
  onDropdownChange = () => {}
}) => {
  const [, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState([]);
  const { control, setValue, getFieldState } = useFormContext();
  const { invalid, isTouched } = getFieldState(name);
  const id = useId();

  switch (type) {
    case FORM_FIELDS.TEXT:
      return (
        <FormField
          key={id}
          control={control}
          name={name}
          render={({ field }) => {
            return (
              <FormItem className={className}>
                <FormControl className="flex flex-column">
                  <FormLabel label={label} name={name ?? label} isRequired={isRequired} />
                  <CustomInputField
                    {...field}
                    id={name}
                    disabled={disabled}
                    name={name ?? label}
                    placeholder={label}
                    aria-label={label}
                    invalid={isTouched && invalid}
                    maxLength={inputMaxLength}
                    onChange={(e) => {
                      field.onChange(e);
                      onFieldValueChange(name, e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );
    case FORM_FIELDS.PASSWORD:
      return (
        <FormField
          key={id}
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              <FormControl className="flex flex-column">
                <FormLabel label={label} name={name ?? label} isRequired={isRequired} />
                <CustomPasswordField
                  {...field}
                  id={name}
                  name={name ?? label}
                  aria-label={label}
                  disabled={disabled}
                  invalid={isTouched && invalid}
                  className={`w-full`}
                  isiconpresent={false}
                  weakLabel="Too simple"
                  mediumLabel="Average complexity"
                  strongLabel="Complex password"
                  toggleMask
                  placeholder={label}
                  feedback={false}
                  inputClassName="w-full"
                  onChange={(e) => {
                    field.onChange(e);
                    onFieldValueChange(name, e.target.value);
                  }}
                />
                <FormMessage />
              </FormControl>
            </FormItem>
          )}
        />
      );
    case FORM_FIELDS.DROPDOWN:
      return (
        <FormField
          key={id}
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              <FormControl className="flex flex-column">
                <FormLabel label={label} name={name ?? label} isRequired={isRequired} />
                <CustomDropdown
                  {...field}
                  id={name}
                  name={name ?? label}
                  disabled={disabled}
                  placeholder={label}
                  aria-label={label}
                  options={options}
                  className="w-full"
                  invalid={isTouched && invalid}
                  optionLabel={optionLabel ?? "name"}
                  onChange={(e) => {
                    field.onChange(e);
                    const selectedOption = options.find(
                      (x) => x?.[autoCompleteFilterKey] == e.value
                    );
                    onFieldValueChange(name, e.target.value, selectedOption);
                  }}
                  onSelect={(e) => {
                    const selectedOption = options.find(
                      (x) => x?.[autoCompleteFilterKey] == e.value
                    );
                    onDropdownChange(name, e.value, selectedOption);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case FORM_FIELDS.AUTOCOMPLETE:
      return (
        <FormField
          key={id}
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              <FormControl className="flex flex-column">
                <FormLabel label={label} name={name ?? label} isRequired={isRequired} />
                <AutoComplete
                  {...field}
                  id={name}
                  name={name ?? label}
                  disabled={disabled}
                  placeholder={label}
                  aria-label={label}
                  virtualScrollerOptions={{
                    itemSize: 30,
                    items: options
                  }}
                  invalid={isTouched && invalid}
                  options={options}
                  className="w-full"
                  dropdown
                  suggestions={suggestions ?? []}
                  showEmptyMessage
                  completeMethod={({ query }) => {
                    startTransition(() => {
                      const filterSuggestions = options.filter((data) => {
                        return !!data?.[autoCompleteFilterKey]
                          ?.toLowerCase()
                          .includes(query?.toLowerCase());
                      });
                      const s = filterSuggestions.map((d) => d?.[autoCompleteFilterKey]) ?? [];
                      setSuggestions(s);
                    });
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    const selectedOption = options.find(
                      (x) => x?.[autoCompleteFilterKey] == e.value
                    );

                    onFieldValueChange(name, e.target.value, selectedOption);
                  }}
                  onSelect={(e) => {
                    const selectedOption = options.find(
                      (x) => x?.[autoCompleteFilterKey] == e.value
                    );

                    onDropdownChange(name, e.value, selectedOption);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case FORM_FIELDS.DATE:
      return (
        <FormField
          key={id}
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              <FormControl className="flex flex-column">
                <FormLabel label={label} name={name ?? label} isRequired={isRequired} />
                <CommonDatePicker
                  {...field}
                  id={name}
                  className={"w-full"}
                  disabled={disabled}
                  name={name ?? label}
                  aria-label={label}
                  invalid={isTouched && invalid}
                  dateFormat={"mm/dd/yy"}
                  placeholder={label}
                  showIcon
                  onChange={(e) => {
                    field.onChange(e);
                    onFieldValueChange(name, e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case FORM_FIELDS.CHECKBOX:
      return (
        <FormField
          key={id}
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormControl className="flex">
                <CustomCheckBox {...field} id={name} checked={field?.value} disabled={disabled} />
                <FormLabel label={label} className="mx-1" />
                <FormMessage />
              </FormControl>
            </FormItem>
          )}
        />
      );
    case FORM_FIELDS.CHECKBOX_GROUP:
      return (
        <FormField
          key={id}
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormControl className="flex">
                <CheckboxGroup
                  {...field}
                  id={name}
                  options={options}
                  onChange={(event) => {
                    const checkedOptions = options?.map((option) => {
                      if (option.value === event?.value) {
                        option.checked = event?.checked;
                      }
                      return option;
                    });
                    onFieldValueChange(name, checkedOptions);
                    setValue(name, checkedOptions);
                  }}
                />
                <FormMessage />
              </FormControl>
            </FormItem>
          )}
        />
      );
    case FORM_FIELDS.COMPONENT:
      return Component && <Component key={id} />;
    case FORM_FIELDS.ELEMENT:
      return React.cloneElement(element ?? <div />);
    default:
      return <></>;
  }
};

Field.propTypes = {
  inputMaxLength: PropTypes.number,
  name: PropTypes.string,
  label: PropTypes.string,
  autoCompleteFilterKey: PropTypes.string,
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
  ),
  className: PropTypes.string,
  component: PropTypes.node,
  element: PropTypes.node,
  disabled: PropTypes.bool,
  onFieldValueChange: PropTypes.func,
  onDropdownChange: PropTypes.func,
  isRequired: PropTypes.bool,
  optionLabel: PropTypes.string
};

export default Field;
