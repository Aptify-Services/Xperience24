import { useEffect } from "react";

const useMutationObserver = (callback, dependencies = []) => {
  useEffect(() => {
    if (typeof callback !== "function") {
      console.warn("Invalid callback or ref.current");
      return;
    }

    // Create a MutationObserver instance
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          callback();
        }
      }
    });

    // Initial call to handle existing elements
    callback();

    // Start observing the target element for added nodes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
    // Dependencies array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...dependencies]); // Include callback, ref, and other dependencies
};

export default useMutationObserver;
