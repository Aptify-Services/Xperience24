import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import PageNotFoundImage from "@assets/images/generic/PageNotFound.png";
import SimpleButton from "@components/atoms/Buttons/SimpleButton";

function PageNotFound() {
  const [imageURL, setImageURL] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setImageURL(PageNotFoundImage);
  }, []);

  function navigateOnButton() {
    navigate("/product-catalog");
  }

  return (
    <div className="grid text-center justify-content-center">
      <div className="col-12 py-0 mt-5">
        <img alt="emptyCart" className="w-4 h-4" src={imageURL} />
      </div>
      <div className="col-12 pt-0">
        <h2>Page Not Found</h2>
      </div>
      <div className="col-12 md:w-3">
        <SimpleButton text label="Back to Home" onClick={() => navigateOnButton()} />
      </div>
    </div>
  );
}

PageNotFound.propTypes = {};

export default PageNotFound;
