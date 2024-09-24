import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import cartReducer from "./CartSlice";
import countryCurrencyReducer from "./CountryCurrencySlice";
import userReducer from "./UserSlice";
import productCatalogReducer from "./ProductCatalogSlice";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user"]
};

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  countryCurrency: countryCurrencyReducer,
  productCatalog: productCatalogReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.DEV
});

export default store;

export const persistor = persistStore(store);
