/* eslint-disable max-len */
export const USER_CONTEXT_FIELDS = {
  USER_NAME: "UserName",
  FIRST_NAME: "FirstName",
  LAST_NAME: "LastName",
  EMAIL: "Email",
  AUTHENTICATED_PERSON_ID: "AuthenticatedPersonId",
  USER_ID: "UserId",
  LINK_ID: "LinkId",
  COMPANY_ID: "companyId",
  COMPANY_NAME: "CompanyName",
  CACHE_USER_CONTEXT_EXPIRATION: "CacheUserContextExpiration"
};

export const AXIOS_ERROR_TYPES = {
  AXIOS_FAILED: "axiosFailed",
  SECURITY_REQUIREMENT_FAILED: "SecurityRequirementFailed",
  NO_CREDENTIALS: "No credentials are available for the current user.",
  FAIL: "fail"
};

export const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  NO_CONTENT: 204
};

export const RESPONSE_STATUS = {
  OK: "ok"
};

export const CATEGORY_TYPE = {
  ALL: "All"
};

export const PAYMENT_TYPES = {
  CREDIT_CARD: "Credit Card",
  CREDIT_CARD_REF_TRANSACTION: "Credit Card Reference Transaction",
  CREDIT_CARD_HOSTED_REF_TRANSACTION: "Credit Card Hosted Payment Reference Transaction",
  WIRE_TRANSFER: "Wire Transfer",
  HOSTED_IFRAME_TOKENIZER: "Hosted iFrame Tokenizer",
  ACH: "ACH",
  G_PAY: "Google Pay"
};

export const EMAIL_TYPES = {
  PRIMARY: "Primary Email",
  SECONDARY: "Secondary Email",
  TERTIARY: "Tertiary Email"
};

export const PAYMENT_METHOD_TYPES = {
  PAY_CHECKOUT: "PayCheckout",
  PAY_MAKE_MY_PAYMENT: "PayMakeMyPayment"
};

export const PRODUCT_TYPES = {
  MEETINGS: "Meetings",
  PUBLICATION: "Publication"
};

export const PAYMENT_FUNCTIONS = {
  PAY_BY_HOSTED_IFRAME_TOKENIZER: "payByHostediFrameTokenizer",
  MAKE_PAYMENT_BY_HOSTED_IFRAME_TOKENIZER: "makePaymentByHostediFrameTokenizer",
  MAKE_PAYMENT_WITHOUT_LOGIN_BY_HOSTED_IFRAME_TOKENIZER:
    "makePaymentWithoutLoginByHostediFrameTokenizer"
};

export const FTS_UAT_CARD_CONNECT = "https://fts-uat.cardconnect.com";

export const CC_PAYMENT_FUNCTIONS = {
  CHECKOUT: "checkout",
  MAKE_MY_PAYMENT: "makeMyPayment",
  MAKE_MY_PAYMENT_WITHOUT_LOGIN: "makeMyPaymentWithoutLogin",
  ADCC: "AddCC"
};

export const ACH_PAYMENT_FUNCTIONS = {
  CHECKOUT: "checkoutACH",
  MAKE_MY_PAYMENT: "makeMyPaymentACH",
  MAKE_MY_PAYMENT_WITHOUT_LOGIN: "makeMyPaymentWithoutLoginACH"
};

export const GPAY_PAYMENT_FUNCTIONS = {
  CHECKOUT: "payByGPay",
  MAKE_MY_PAYMENT: "makePaymentByGPay",
  MAKE_MY_PAYMENT_WITHOUT_LOGIN: "makePaymentByGPayWithoutLogin"
};

export const LABEL_OPTIONS = {
  EMPTY_CART: "EmptyCart",
  EMPTY_ORDER_LIST: "EmptyOrderList",
  UNPAID_ORDERS: "unPaidOrders",
  NO_PRODUCT_FOUND: "NoProductFound",
  NO_ADDRESS_AVAILABLE: "NoAddressAvailable"
};

export const USER_CONTEXT_FIELDS_ARRAY = [
  "UserName",
  "FirstName",
  "LastName",
  "Email",
  "AuthenticatedPersonId",
  "UserId",
  "LinkId",
  "companyId",
  "CompanyName",
  "CacheUserContextExpiration"
];

export const SORT_OPTIONS = [
  { label: "Price High to Low", value: "!defaultPrice" },
  { label: "Price Low to High", value: "defaultPrice" }
];

export const FILTER_SORT_OPTIONS = [
  { label: "All Time", value: "0" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
  { label: "Last 180 Days", value: "180" },
  { label: "Last year", value: "365" },
  { label: "Last 5 year", value: "1825" }
];

export const SUFFIX_LIST = [
  { name: "Jr.", code: "Jr." },
  // As per database requirement the "." after PhD is not required
  // It give error from database "The field suffix is invalid\r\n"
  { name: "PhD", code: "PhD" },
  { name: "Sr.", code: "Sr." }
];

export const BUSSINESS_TYPE = [
  { name: "Business Phone", code: "BUSPHO" },
  { name: "Cell Phone", code: "CELLPHO" },
  { name: "Home Phone", code: "HOMEPHO" },
  { name: "Pager Phone", code: "PAGEPHO" },
  { name: "Assistants Phone", code: "ASSIPHO" }
];

export const EMAIL_TYPE_WITH_CODE = [
  { name: "Primary Email", code: "PE" },
  { name: "Secondary Email", code: "SE" },
  { name: "Tertiary Email", code: "TE" }
];

export const ADDRESS_TYPE_LIST = [
  { name: "Home Address", code: "HA" },
  { name: "PO Box Address", code: "POBOXA" },
  { name: "Business Address", code: "BUA" },
  { name: "Billing Address", code: "BIA" }
];

export const COUNTRY_LIST = [
  { name: "India.", code: "IND" },
  { name: "United Stated.", code: "US" },
  { name: "Germany.", code: "GEN" }
];

export const STATE_LIST = [
  { name: "Maharashtra.", code: "MH" },
  { name: "Gujrat", code: "GJ" },
  { name: "Kerla.", code: "KL" }
];

export const IFRAME_TOKENIZER_URL =
  "https://fts-uat.cardconnect.com/itoke/ajax-tokenizer.html?useexpiry=true&usecvv=true&enhancedresponse=true&invalidcreditcardevent=true&invalidexpiryevent=true&css=select%2Cinput%7B%0D%0Aborder%3A+2px+solid+%23e1e1e1%3B%0D%0Aborder-radius%3A6px%3B%0D%0Afont-size%3A16px%3B%0D%0Afont-weight%3A+400%3B%0D%0Aline-height%3A+1.65em%3B%0D%0Abackground%3A+%23ffffff%3B%0D%0Afont-family%3A+Poppins%2C+sans-serif%3B%0D%0Afont-color%3A%236c6c6c%3B%0D%0Amin-width%3A70px%3B%0D%0Amargin-bottom%3A+20px%3B%0D%0Acolor%3A+%23555%3B%0D%0Apadding%3A+0.5rem+0.75rem%3B%0D%0Abox-sizing%3A+border-box%3B%0D%0A%7D%0D%0Aselect.error%2C%0D%0Ainput.error%7B%0D%0Aborder%3A+1px+solid+%23db5c71%3B%0D%0A%7D%0D%0Aselect%3Afocus%2C%0D%0Ainput%3Afocus%2C%0D%0Aselect%3Ahover%2C%0D%0Ainput%3Ahover%7B%0D%0Aborder-color%3A+rgba%2882%2C168%2C236%2C.8%29%3B%0D%0Abox-shadow%3A+inset+0+1px+3px+rgba%280%2C0%2C0%2C.1%29%2C+0+0+8px+rgba%2882%2C168%2C236%2C.6%29%3B%0D%0Aoutline%3A+none%3B%0D%0A%7D%0D%0A%23ccexpiryyear%7B%0D%0Amargin-left%3A+10px+%21important%3B%0D%0A%7D%0D%0A%23ccnumfield%7B%0D%0Awidth%3A+100%25%3B%0D%0Aheight%3A+39px%3B%0D%0A%7D%0D%0A%0D%0A%23cccvvfield%7B%0D%0Awidth%3A47%25%3B%0D%0Aheight%3A+39px%3B%0D%0A%7D%0D%0Aselect%7B%0D%0Awidth%3A47%25%3B%0D%0A%7D%0D%0Alabel%7B%0D%0Afont-family%3A+Poppins%2C+arial%2C+sans-serif%3B%0D%0Afont-size%3A14px%3B+%0D%0Afont-weight%3A400%3B+%0D%0Acolor%3A%23555%3B%0D%0Adisplay%3A+block%3B%0D%0Amargin-bottom%3A+5px%3B%0D%0A%7D%0D%0Alabel%2Bbr%7B%0D%0Adisplay%3A+none%3B%0D%0A%7D";

export const IFRAME_TOKENIZER_URL_ACH =
  "https://fts-uat.cardconnect.com/itoke/ajax-tokenizer.html?useexpiry=false&usecvv=false&enhancedresponse=true&invalidcreditcardevent=true&invalidexpiryevent=true&cardtitle=InputValue&css=select%2Cinput%7B%0D%0Aborder%3A+2px+solid+%23e1e1e1%3B%0D%0Aborder-radius%3A6px%3B%0D%0Afont-size%3A16px%3B%0D%0Afont-weight%3A+400%3B%0D%0Aline-height%3A+1.65em%3B%0D%0Abackground%3A+%23ffffff%3B%0D%0Afont-family%3A+Poppins%2C+sans-serif%3B%0D%0Afont-color%3A%236c6c6c%3B%0D%0Amin-width%3A70px%3B%0D%0Amargin-bottom%3A+20px%3B%0D%0Acolor%3A+%23555%3B%0D%0Apadding%3A+0.5rem+0.75rem%3B%0D%0Abox-sizing%3A+border-box%3B%0D%0A%7D%0D%0Aselect.error%2C%0D%0Ainput.error%7B%0D%0Aborder%3A+1px+solid+%23db5c71%3B%0D%0A%7D%0D%0Aselect%3Afocus%2C%0D%0Ainput%3Afocus%2C%0D%0Aselect%3Ahover%2C%0D%0Ainput%3Ahover%7B%0D%0Aborder-color%3A+rgba%2882%2C168%2C236%2C.8%29%3B%0D%0Abox-shadow%3A+inset+0+1px+3px+rgba%280%2C0%2C0%2C.1%29%2C+0+0+8px+rgba%2882%2C168%2C236%2C.6%29%3B%0D%0Aoutline%3A+none%3B%0D%0A%7D%0D%0A%23ccexpiryyear%7B%0D%0Amargin-left%3A+10px+%21important%3B%0D%0A%7D%0D%0A%23ccnumfield%7B%0D%0Awidth%3A+100%25%3B%0D%0Aheight%3A+39px%3B%0D%0A%7D%0D%0A%0D%0A%23cccvvfield%7B%0D%0Awidth%3A47%25%3B%0D%0Aheight%3A+39px%3B%0D%0A%7D%0D%0Aselect%7B%0D%0Awidth%3A47%25%3B%0D%0A%7D%0D%0Alabel%7B%0D%0Afont-family%3A+Poppins%2C+arial%2C+sans-serif%3B%0D%0Afont-size%3A14px%3B+%0D%0Afont-weight%3A400%3B+%0D%0Acolor%3A%23555%3B%0D%0Adisplay%3A+block%3B%0D%0Amargin-bottom%3A+5px%3B%0D%0A%7D%0D%0Alabel%2Bbr%7B%0D%0Adisplay%3A+none%3B%0D%0A%7D";

export const PREFIX_LIST = [
  { name: "Dr.", code: "DR" },
  { name: "Miss", code: "MISS" },
  { name: "Mrs.", code: "MRS" },
  { name: "Mr.", code: "MR" },
  { name: "Ms.", code: "MS" },
  { name: "Sir.", code: "SIR" }
];

export const GENDER_LIST = [
  { name: "Male", code: "M" },
  { name: "Female", code: "F" },
  { name: "Unknown", code: "U" }
];

export const PROFILE_TABS = {
  PROFILE: "profile",
  ORDER_HISTORY: "order-history",
  PAYOFF_ORDER: "payoff-order",
  SAVED_PAYMENTS: "saved-payments"
};

export const FORM_FIELDS = {
  TEXT: "text",
  PASSWORD: "password",
  CHECKBOX: "checkbox",
  GROUP: "group",
  DROPDOWN: "dropdown",
  CHECKBOX_GROUP: "checkbox-group",
  DATE: "date",
  COMPONENT: "component",
  ELEMENT: "element",
  AUTOCOMPLETE: "autocomplete"
};

export const COMMUNICATION_PREFERENCE = [
  {
    label: "Mail",
    value: "optsOutOfMailCommunication"
  },
  {
    label: "Fax",
    value: "optsOutOfFaxCommunication"
  },
  {
    label: "Email",
    value: "optsOutOfEmailCommunication"
  },
  {
    label: "Directory",
    value: "excludeFromMembershipDirectory"
  }
];

export const DEFAULT_DATE = "01/01/1";

export const DEFAULT_ROW_PRODUCTCATALOG = 12;
