export const SIGN_UP_ERRORS = {
  USER_ALREADY_EXISTS: "User Already Exists",
  PASSWORD_REQUIREMENT_FAILED: "Password Requirement Failed",
  EMAIL_REQUIREMENT_FAILED: "Email Requirement Failed",
  DEFAULT_ERROR:
    "Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.",
  FIRST_NAME_REQUIRED: "First Name is required",
  LAST_NAME_REQUIRED: "Last Name is required",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  CONFIRM_PASSWORD_REQUIRED: "Confirm Password is required",
  PASSWORDS_NOT_MATCH: "Passwords do not match"
};

export const LOGIN_ERRORS = {
  USERNAME_REQUIRED: "Username is required",
  PASSWORD_REQUIRED: "Password is required"
};

const errorMessages = {
  520: SIGN_UP_ERRORS.USER_ALREADY_EXISTS,
  521: SIGN_UP_ERRORS.USER_ALREADY_EXISTS,
  523: SIGN_UP_ERRORS.PASSWORD_REQUIREMENT_FAILED,
  524: SIGN_UP_ERRORS.EMAIL_REQUIREMENT_FAILED,
  default:
    "Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance."
};

export const getErrorMessage = (errorCode) => {
  return errorMessages[errorCode] || errorMessages["default"];
};

export const BASIC_DETAILS_ERRORS = {
  FIRST_NAME_REQUIRED: "First Name is required",
  LAST_NAME_REQUIRED: "Last Name is required",
  EMAIL_INVALID: "Invalid Email address"
};

export const INPUT_ERRORS = {
  NUMBER_REQUIRED: "Value must be numeric",
  CARD_EXPIRATION_DATE_PAST: "Card expired",
  QTY_LESS_THAN_ONE: "Quantity cannot be less than 1"
};
