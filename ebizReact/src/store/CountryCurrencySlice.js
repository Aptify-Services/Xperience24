import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { _get, retrieveCSRFTokens } from "@api/APIClient";

export const getCountryCurrency = createAsyncThunk(
  "countryCurrency/getCountryCurrency",
  async () => {
    const response1 = await retrieveCSRFTokens();
    const response2 = await _get("/v1/CountryCurrency", {
      withCredentials: true,
      headers: response1
    });

    return response2.data;
  }
);

export const countryCurrencySlice = createSlice({
  name: "countryCurrency",
  initialState: {
    countryCurrency: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCountryCurrency.fulfilled, (state, action) => {
      state.countryCurrency = action.payload;
    });
  }
});

// eslint-disable-next-line no-empty-pattern
export const {} = countryCurrencySlice.actions;
export default countryCurrencySlice.reducer;
