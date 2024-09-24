import { PrimeReactProvider } from "primereact/api";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import store, { persistor } from "./store/store";
import "./css/theme.scss";
import "primeicons/primeicons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <PrimeReactProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </PrimeReactProvider>
);
