import * as Yup from "yup";

export const basicDetailsValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(20, "First name cannot be longer than 20 characters")
    .matches(
      /^[a-zA-ZÀ-ÿ-'\s]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  lastName: Yup.string()
    .matches(
      /^[a-zA-ZÀ-ÿ-'\s]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    )
    .max(20, "Last name cannot be longer than 20 characters"),
  emailField: Yup.string().email("Please enter a valid email"),
  title: Yup.string().max(30, "Title cannot be longer than 20 characters"),
  birthday: Yup.string()
    .nullable()
    .test("is-valid-date", "Birthday cannot be in the future", (value) => {
      const today = new Date();
      const birthDate = new Date(value);
      return birthDate <= today;
    })
});
