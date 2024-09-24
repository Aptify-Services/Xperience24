import * as Yup from "yup";

export const signUpValidationSchema = Yup.object().shape({
  firstname: Yup.string().trim().required("First Name is required"),
  lastname: Yup.string().trim().required("Last Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required")
});
