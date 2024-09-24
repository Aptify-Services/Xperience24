/* eslint-disable no-empty */
import axios from "axios";

import { ebConfig } from "@configuration/ebConfig";

const BASE_URL = ebConfig.ServicePath || "https://student-base-ebusiness.aptify.com:500";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

apiClient.interceptors.response.use(
  (response) => {
    // Return the response if it's successful
    return response;
  },
  (error) => {
    // Handle errors
    if (error?.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.error("Response Error:", error?.response?.data, error);
      const eventData = {
        action: "axiosFailed",
        data: error?.response?.data ?? "Unknown error"
      };
      window.postMessage(eventData, window.origin);
      return Promise.reject(error?.response?.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request Error:", error?.request);
      // var eventData = {
      //   action: "axiosFailed",
      //   data: "dispatchUserInfo",
      // };
      // window.postMessage(eventData, "http://localhost:3000");
      return Promise.reject("Request Error");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error?.message);
      return Promise.reject(error?.message);
    }
  }
);

// let store;

// export const injectStore = (_store) => {
//   store = _store;
// };

// apiClient.interceptors.request.use((config) => {
//   // config.headers.authorization = store.getState().auth.token
//   const user = store.getState().user;
//   if (user.UserId === null || user.UserId === undefined) {
//     const personId = sessionStorage.getItem("LinkId");
//   }
//   return config;
// });

const retrieveCSRFTokens = async () => {
  // axios.get("http://localhost:51809/services/UserInformation", { withCredentials: true })
  //     .then(response => {
  //     const headers = {
  //         __requestverificationtoken : "",
  //         CSRFDefenseInDepthToken : ""
  //         };
  //     headers.__requestverificationtoken = response.request.getResponseHeader("__requestverificationtoken");
  //     headers.CSRFDefenseInDepthToken = response.request.getResponseHeader("CSRFDefenseInDepthToken");
  //     return headers;
  // const response = await axios.get("http://localhost:51809/services/UserInformation", { withCredentials: true })
  const response = await axios.get(ebConfig.ServicePath + "/services/UserInformation", {
    withCredentials: true
  });
  const headers = {
    __requestverificationtoken: "",
    CSRFDefenseInDepthToken: ""
  };
  headers.__requestverificationtoken = response.request.getResponseHeader(
    "__requestverificationtoken"
  );
  headers.CSRFDefenseInDepthToken = response.request.getResponseHeader("CSRFDefenseInDepthToken");
  return headers;
};

// Define common API methods
const _get = async (url, config = {}) => {
  // const user = store.getState().user;
  // if (user.UserId === null || user.UserId === undefined) {
  //   const personId = sessionStorage.getItem("LinkId");
  //   userSlice.caseReducers.setPersonId({...user}, { LinkId: personId, isUserLoggedIn: true });
  // }
  return apiClient.get(url, config);
};

const _delete = async (url, config = {}) => {
  if (config.headers && config.headers.CSRFDefenseInDepthToken !== null) {
  } else if (config.headers && config.headers.CSRFDefenseInDepthToken === null) {
    const csrfHeaders = await retrieveCSRFTokens();
    config = { ...config, headers: csrfHeaders };
  } else {
    //config.headers === null
    const csrfHeaders = await retrieveCSRFTokens();
    config = { ...config, headers: csrfHeaders };
  }
  return apiClient.delete(url, config);
};

const _patch = async (url, data = {}, config = {}) => {
  if (config.headers && config.headers.CSRFDefenseInDepthToken !== null) {
  } else if (config.headers && config.headers.CSRFDefenseInDepthToken === null) {
    const csrfHeaders = await retrieveCSRFTokens();
    config = { ...config, headers: csrfHeaders };
  } else {
    //config.headers === null
    const csrfHeaders = await retrieveCSRFTokens();
    config = { ...config, headers: csrfHeaders };
  }
  return await apiClient.patch(url, data, config);
};

const _post = async (url, data = {}, config = {}) => {
  if (config.headers && config.headers.CSRFDefenseInDepthToken !== null) {
  } else if (config.headers && config.headers.CSRFDefenseInDepthToken === null) {
    const csrfHeaders = await retrieveCSRFTokens();
    config = { ...config, headers: csrfHeaders };
  } else {
    //config.headers === null
    const csrfHeaders = await retrieveCSRFTokens();
    config = { ...config, headers: csrfHeaders };
  }

  return apiClient.post(url, data, config);
};

// Export API methods
export { _get, _delete, _patch, _post, retrieveCSRFTokens };
