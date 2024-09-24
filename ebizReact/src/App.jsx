import { RouterProvider } from "react-router-dom";

import Loader from "./components/molecules/Loader";
import ToastContainer from "./components/molecules/Toast";
import { ToastProvider } from "./context/ToasterProvider";
import store from "./store/store";
import { setupDispatch } from "./store/UserSlice";
import router from "./routes";

setupDispatch(store.dispatch);

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} fallbackElement={<Loader />} />
      <ToastContainer />
    </ToastProvider>
  );
}

export default App;
