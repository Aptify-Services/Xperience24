# FormBuilder

## Overview

The Form Builder Component is a versatile tool designed to dynamically generate forms based on JSON configuration. This allows for flexible and dynamic form creation, which can be particularly useful in scenarios where forms need to be generated based on user inputs, database configurations, or other dynamic sources.

## Props

### FormBuilder

| **Prop**         | **Type**                                           | **Description**                       |
| ---------------- | -------------------------------------------------- | ------------------------------------- |
| form             | react hook form                                    | react hook form                       |
| onSubmit         | function                                           | handler for submit                    |
| fields           | Fields[]                                           | array of fields                       |
| onDropdownChange | function(name:string, value:string, option:object) | handler for dropdown value change     |
| onValueChange    | function(name:string, value:string)                | handler for change in value of fields |

### Fields

| Props                 | Types                                                                                         | Description                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| autoCompleteFilterKey | string                                                                                        | for auto complete drodown to suggest menu against this key                                                                                                    |
| className             | string                                                                                        | classname for styling                                                                                                                                         |
| component             | React Node                                                                                    | for custom component to show                                                                                                                                  |
| disabled              | boolean                                                                                       | to disable field                                                                                                                                              |
| element               | React Node                                                                                    | for custom element to show                                                                                                                                    |
| inputMaxLength        | number                                                                                        | for input validation                                                                                                                                          |
| label                 | string                                                                                        | label of the feild                                                                                                                                            |
| name                  | string                                                                                        | generated data again name key                                                                                                                                 |
| options               | { label: string, value:string, name: string}                                                  | options for dropdown                                                                                                                                          |
| type                  | text,password,checkbox,group,dropdown, checkbox-group, date, component, element, autocomplete |
| optionLabel           | string                                                                                        | used for configure dropdown to use same key as label lets say {label:I,name:II, value:1} if optionLabel is name then name will be shown as label in dropdown. |

## Usage

```code
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export const signUpValidationSchema = Yup.object().shape({
  firstname: Yup.string().required("First Name is required"),
  lastname: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required")
});

const DummyFormPage = ()=>{
const form = useForm({
    mode: "onBlur",
    resolver: yupResolver(signUpValidationSchema)
});

 const fields = useMemo(
    () => [
      {
		 /*For showing multiple fields in a row*/
        type: "group",
        group: [
          {
            type: "text",
            name: "firstname",
            label: "First Name",
            hasNoFieldClass: true
          },
          {
            type: "text",
            name: "lastname",
            label: "Last Name",
            hasNoFieldClass: true
          }
        ]
      },
	   {
            type: "element",
            element: <span></span>
       },
      {
        type: "text",
        name: "email",
        label: "Email Address",
        classStyle: "userNameStyle"
      },
      {
        type: "dropdown",
        name: "gender",
        label: "Gender",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },],
        optionLabel: 'label
      },
      {
        type: "password",
        name: "password",
        label: "Password"
      },
      {
        type: "password",
        name: "confirmpassword",
        label: "Confirm Password"
      }
    ],
    []
  );

return (<FormBuilder
  onSubmit={handleSubmit}
  form={form}
  fields={fields}>
 	<SimpleButton
     type="submit"
    />
</FormBuilder>);
}

```
