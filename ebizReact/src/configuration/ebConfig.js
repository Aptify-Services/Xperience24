/**
 * Define ebConfig class.
 * @class ebConfig
 * */
export const ebConfig = {
  /**
   * Configuration setting: This is Service URL.
   * @property ServicePath
   * @type {String}
   */
  ServicePath: import.meta.env.VITE_API_URL,
  ServicePathV1: import.meta.env.VITE_API_URL + "/v1",

  /**
   * Configuration setting: This property will load default image [No Photo Available Image] instead original one for product.
   * @property loadDefaultImage
   * @type {String}
   */
  loadDefaultImage: false,
  thumbnailImageURL: "/images/products",
  largeImageURL: "/images/large/",
  imageExtension: ".jpg",

  /**
   * Configuration setting: CSRF Defense In Depth Token Key.
   * @property CSRFDefenseInDepthToken
   * @type {String}
   */
  CSRFDefenseInDepthToken: "CSRFDefenseInDepthToken",

  /**
   * Configuration setting: CSRF Defense In Depth Token Value.
   * @property CSRFDefenseInDepthTokenValue
   * @type {String}
   */
  CSRFDefenseInDepthTokenValue: "",

  /**
   * Configuration setting: request verification token key
   * @property __requestverificationtoken
   * @type {String}
   */
  __requestverificationtoken: "__requestverificationtoken",

  /**
   * Configuration setting: request verification token value
   * @property __requestverificationtokenValue
   * @type {String}
   */
  __requestverificationtokenValue: "",

  /**
   * Session expired in minutes.
   * @property sessionExpirationInMin
   * @type {bool}
   * */
  sessionExpirationInMin: 10,

  /**
   * Array for Expiration Years in areas concerning CC expiration like Payments/SPM, etc.
   * @property expirationYearOptions
   * @type {Array}
   * */
  expirationYearOptions: [
    "Year",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
    "2031",
    "2032",
    "2033",
    "2034",
    "2035",
    "2036",
    "2037",
    "2038",
    "2039",
    "2040",
    "2041",
    "2042"
  ],

  bluepayHPPCreditCardExpiryMonth: new Date().getMonth() + 1,
  bluepayHPPCreditCardExpiryYear: new Date().getFullYear() + 1,

  /**
   * Configuration setting: Digit after decimal number.
   * @property roundOffDigitsAfterDecimal
   * @type {number}
   */
  roundOffDigitsAfterDecimal: 2,

  /**
   * Configuration setting: CardPointe configurations for GPay and ApplePay
   * */
  cardConnectEnvironment: "TEST",
  cardConnectMerchantId: "890000000095",
  cardConnectMerchantName: "aptify",
  gPayButtonSettings: {
    buttonColor: "black",
    buttonType: "pay"
  }
};
