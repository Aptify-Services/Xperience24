import { createSlice } from "@reduxjs/toolkit";

export const productCatalogSlice = createSlice({
  name: "productCatalog",
  initialState: {
    filters: null
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetFilter: (state, _action) => {
      state.filters = null;
    }
  }
});

export const { setFilters, resetFilter } = productCatalogSlice.actions;
export default productCatalogSlice.reducer;
