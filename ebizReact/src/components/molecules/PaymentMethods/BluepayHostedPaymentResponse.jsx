import { useEffect } from "react";

export default function BluepayHostedPaymentResponse() {
  const postBluepayHPPResponse = async (data) => {
    handleBluepayHostedPaymentResponse(data);
  };

  const handleBluepayHostedPaymentResponse = (bluepayResponse) => {
    const eventData = {
      action: "processBluepayResponse",
      data: bluepayResponse
    };
    window.parent.postMessage(eventData, "*");
  };

  useEffect(() => {
    const responseData = { responsedata: window.location.href };
    postBluepayHPPResponse(responseData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
