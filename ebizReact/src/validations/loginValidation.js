import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(1, "Username must be at least 1 character"),
  password: Yup.string()
    .required("Password is required")
    .min(1, "Password must be at least 1 character")
});
