import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { _get, _post, retrieveCSRFTokens } from "@api/APIClient";
import { ebConfig } from "@configuration/ebConfig";
import {
  AXIOS_ERROR_TYPES,
  HTTP_STATUS_CODES,
  RESPONSE_STATUS,
  USER_CONTEXT_FIELDS,
  USER_CONTEXT_FIELDS_ARRAY
} from "@constants";

export const setupDispatch = (dispatch) => {
  window.addEventListener("message", (event) => {
    if (event.origin !== window.origin) return; // Check event origin

    if (event.data && event.data.action && event.data.action === AXIOS_ERROR_TYPES.AXIOS_FAILED) {
      if (
        event.data.data &&
        event.data.data.type &&
        event.data.data.type === AXIOS_ERROR_TYPES.SECURITY_REQUIREMENT_FAILED &&
        event.data.data.message &&
        (event.data.data.message
          .toLowerCase()
          .includes("AuthenticationRequiredByDefault".toLowerCase()) ||
          event.data.data.message.toLowerCase().includes("IsYourRecord".toLowerCase()))
      ) {
        dispatch(getUserInformation());
      }
    }
  });
};

export const getContextData = createAsyncThunk("user/getContextData", async (useCache) => {
  const dataOut = [];
  if (isSessionTimeOut()) {
    sessionStorage.clear();
  }
  const AuthenticatedPersonId = sessionStorage.getItem("UserId");
  if (AuthenticatedPersonId && useCache) {
    for (let i = 0; i < USER_CONTEXT_FIELDS_ARRAY.length; i++) {
      const field = USER_CONTEXT_FIELDS_ARRAY[i];
      dataOut[field] = sessionStorage.getItem(field);
    }
    return dataOut;
  } else {
    //await thunkAPI.dispatch(getUserInformation());
    return await _get("/services/UserInformation").then((result) => {
      if (result) {
        setUserContextDataInStorage(USER_CONTEXT_FIELDS_ARRAY, result);
      } else {
        sessionStorage.clear();
      }
    });
  }
});

export const login = createAsyncThunk("user/login", async (data, { rejectWithValue }) => {
  try {
    const headers = await retrieveCSRFTokens();
    const response = await _post("/services/Authentication/Login/eBusinessWebUser", data, {
      crossDomain: true,
      withCredentials: true,
      headers: headers,
      ContentType: "application/x-www-form-urlencoded"
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return rejectWithValue(error);
  }
});

export const Logout = createAsyncThunk("user/logout", async () => {
  try {
    const headers = await retrieveCSRFTokens();
    const response = await fetch(`${ebConfig.ServicePath}/services/Authentication/Logout`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json" // Assuming content type is JSON
      },
      credentials: "include" // Include credentials for CORS
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
});

export const SignUp = createAsyncThunk(
  "user/signup",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      // Make the POST request
      const response = await _post("/v1/User/Register", data, {
        crossDomain: true,
        ContentType: "application/json"
      });

      if (response.status === HTTP_STATUS_CODES.OK) {
        // Dispatch login action if sign up is successful
        const logindata = {
          UserName: data.email,
          Password: data.password,
          RememberMe: false
        };
        dispatch(login(logindata));
      } else {
        rejectWithValue(response.statusText);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUserInformation = createAsyncThunk("/userInformation", async () => {
  try {
    const response = await _get("/services/UserInformation", {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error(error);
  }
});

export const getUserDetails = createAsyncThunk("/userDetails", async (userID) => {
  try {
    const response = await _get(`/v1/ProfilePersons/${userID}`, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.error(error);
  }
});

const calculateSessionExpirationDate = () => {
  return new Date(new Date().getTime() + 60000 * ebConfig.sessionExpirationInMin);
};

const isSessionTimeOut = () => {
  const sessionExpirationDate = sessionStorage.getItem(
    USER_CONTEXT_FIELDS.CACHE_USER_CONTEXT_EXPIRATION
  );
  const expirationDate = new Date(sessionExpirationDate);
  const currentDateTime = new Date();
  if (expirationDate > currentDateTime) {
    return false;
  } else {
    return true;
  }
};

const setUserContextDataInStorage = (fields, userData) => {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (field === USER_CONTEXT_FIELDS.CACHE_USER_CONTEXT_EXPIRATION) {
      sessionStorage.setItem(
        USER_CONTEXT_FIELDS.CACHE_USER_CONTEXT_EXPIRATION,
        calculateSessionExpirationDate()
      );
    } else {
      sessionStorage.setItem(field, userData[field]);
    }
  }
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    error: null,
    loading: false
  },
  reducers: {
    loadDataInUserContext: (state, action) => {
      const data = action.payload;
      if (data !== "undefined") {
        for (let i = 0; i < USER_CONTEXT_FIELDS_ARRAY.length; i++) {
          const field = USER_CONTEXT_FIELDS_ARRAY[i];
          if (
            typeof data !== "undefined" &&
            typeof field !== "undefined" &&
            typeof data[field] !== "undefined"
          )
            state[field] = data[field];
        }
      }

      if (
        state.UserName &&
        state.UserName !== null &&
        state.UserName !== undefined &&
        state.LinkId !== null &&
        state.LinkId !== undefined
      ) {
        state.isUserLoggedIn = true;
      } else {
        state.isUserLoggedIn = false;
      }
    },
    setPersonId: (state, action) => {
      state.LinkId = action.LinkId;
      state.isUserLoggedIn = action.isUserLoggedIn;
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        delete action.payload.Database;
        delete action.payload.Server;
        delete action.payload.AuthenticationTime;
        delete action.payload.AptifyUser;
        delete action.payload.AptifyUserID;
        delete action.payload.TokenId;
        state.user = action.payload;
        if (action.payload && action.payload.LinkId && action.payload.LinkId > 0) {
          state.user.isUserLoggedIn = true;
        }
      })
      .addCase(getUserDetails.fulfilled, (_state, action) => {
        _state.user = {
          ...(_state?.user ?? {}),
          ...({
            FirstName: action?.payload?.data?.firstName,
            LastName: action?.payload?.data?.lastName
          } ?? {})
        };
      })
      .addCase(login.rejected, (_state, action) => {
        console.error("Login Error:", action);
      })
      .addCase(SignUp.pending, (state) => {
        console.warn("Register pending");
        state.error = null;
      })
      .addCase(SignUp.fulfilled, (_state, action) => {
        console.info("Registered");
        console.info(action.payload);
      })
      .addCase(SignUp.rejected, (state, action) => {
        console.info("Register Error:", action);
        state.registerError = action;
        state.error = action.payload;
      })
      .addCase(Logout.pending, () => {
        console.info("Logout pending");
      })
      .addCase(Logout.fulfilled, () => {
        // userSlice.caseReducers.destroyContext(state, action);
        return userSlice.getInitialState();
      })
      .addCase(Logout.rejected, (state, action) => {
        state.LogoutError = action.payload;
      })
      .addCase(getContextData.fulfilled, (state, action) => {
        console.info("Got Context Data from Session Storage:", action);
      })
      .addCase(getUserInformation.fulfilled, (state, action) => {
        if (action.payload.data.result == RESPONSE_STATUS.OK) {
          if (action.payload.data.userInfo) {
            const data = action.payload.data.userInfo;

            delete data.Database;
            delete data.Server;
            delete data.AuthenticationTime;
            delete data.AptifyUser;
            delete data.AptifyUserID;
            delete data.TokenId;
            state.user = data;
            if (data && data.LinkId && data.LinkId > 0) {
              state.user.isUserLoggedIn = true;
            }
          }
        } else if (action.payload.data.result == AXIOS_ERROR_TYPES.FAIL) {
          if (action.payload.data.error == AXIOS_ERROR_TYPES.NO_CREDENTIALS) {
            return userSlice.getInitialState();
          }
        }
      });
  }
});

export default userSlice.reducer;
