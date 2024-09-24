import * as Yup from "yup";

export const addressValidation = Yup.object().shape({
  addressName: Yup.string().test({
    name: "addressName",
    test: function (value, { createError }) {
      if (this.parent.validate && !value?.length) {
        return createError({
          message: "Address Name is Required"
        });
      } else {
        return true;
      }
    }
  }),
  line1: Yup.string().trim().required("Address Line 1 is required."),
  city: Yup.string().trim().required("City is required."),
  country: Yup.string().required("Country is required.")
});
