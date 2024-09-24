import PropTypes from "prop-types";
import React, { createContext, useContext, useRef } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const toastRef = useRef();

  const showToast = ({ severity, detail, summary, ...rest }) => {
    toastRef.current.show({
      severity,
      sticky: false,
      summary: summary,
      detail,
      life: 3000,
      ...rest
    });
  };

  const hideToast = ({ severity, detail, summary, ...rest }) => {
    toastRef.current.remove({
      severity,
      sticky: false,
      summary: summary,
      detail,
      life: 3000,
      ...rest
    });
  };

  const showToastSuccess = ({ summary, detail, ...rest }) => {
    hideToast({
      severity: "success",
      summary,
      detail,
      ...rest
    });
    showToast({
      severity: "success",
      summary: summary ?? "Success",
      detail,
      ...rest
    });
  };

  const showToastError = ({ summary, detail, ...rest }) => {
    hideToast({
      severity: "error",
      summary,
      detail,
      ...rest
    });
    showToast({
      severity: "error",
      summary: summary ?? "Error",
      detail,
      ...rest
    });
  };

  const showToastWarn = ({ summary, detail, ...rest }) => {
    hideToast({
      severity: "warn",
      summary,
      detail,
      ...rest
    });
    showToast({
      severity: "warn",
      summary: summary ?? "Warning",
      detail,
      ...rest
    });
  };

  const showToastInfo = ({ summary, detail, ...rest }) => {
    hideToast({
      severity: "info",
      summary,
      detail,
      ...rest
    });
    showToast({
      severity: "info",
      summary: summary ?? "Information",
      detail,
      ...rest
    });
  };

  return (
    <ToastContext.Provider
      value={{
        showToastSuccess,
        showToastError,
        showToastWarn,
        showToastInfo,
        showToast,
        toastRef,
        hideToast
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.node.isRequired
};
