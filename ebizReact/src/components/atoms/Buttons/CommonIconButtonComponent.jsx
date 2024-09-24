// import React, { useState } from "react";
import { Button } from "primereact/button";

function CommonButtonComponent(props) {
  return (
    <div>
      {/* <Link to={data}> */}
      <Button {...props} />
      {/* </Link> */}
    </div>
  );
}

export default CommonButtonComponent;
