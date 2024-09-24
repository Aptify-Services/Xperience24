import { Toast } from "primereact/toast";
import React from "react";
import ReactDOM from "react-dom";

import { useToast } from "@context/ToasterProvider";

const ToastContainer = () => {
  const { toastRef } = useToast();

  return ReactDOM.createPortal(
    <>
      <Toast ref={toastRef} position="top-right" />
    </>,
    document.getElementById("toast-container")
  );
};

export default ToastContainer;
