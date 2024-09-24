import * as Yup from "yup";

export const contactDetailsValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(
      /^[0-9\s()-]*$/,
      "Phone number can only contain digits, spaces, parentheses, and hyphens"
    )
    .required("Phone number is required."),
  phoneExtension: Yup.string().nullable(),
  countryCode: Yup.string().matches(/^[0-9]*$/, "Country code should contains only numbers."),
  areaCode: Yup.string().matches(/^[0-9]*$/, "Area code should contains only numbers.")
});
