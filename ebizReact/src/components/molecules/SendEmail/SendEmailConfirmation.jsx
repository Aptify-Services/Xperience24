import PropTypes from "prop-types";
import React, { useState } from "react";

import { _post } from "@api/APIClient.js";
import { useToast } from "@context/ToasterProvider.jsx";
import SimpleButton from "@components/atoms/Buttons/SimpleButton.jsx";
import CustomInputField from "@components/atoms/TextFields/CustomInputField.jsx";

const SendEmailConfirmation = (props) => {
  const serviceURL = props.options.serviceURL;
  const [errors, setErrors] = useState("");
  const [emailList, setEmailList] = useState("");
  const { showToastSuccess, showToastError } = useToast();

  const validateEmailList = (emails) => {
    const emailRegex = /[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,3}/;
    let areAllValidEmails = true;

    emails.map((email) => {
      if (!emailRegex.test(email.trim())) {
        areAllValidEmails = false;
      }
    });

    return areAllValidEmails;
  };
  const handleSubmit = async () => {
    if (emailList != "") {
      const emails = emailList.trim().split(",");
      const allValidEmails = validateEmailList(emails);
      if (allValidEmails) {
        let dataToAdd = [];
        emails.map((email) => {
          dataToAdd.push(email.trim());
        });
        dataToAdd = JSON.stringify(dataToAdd);
        const emailData = '{"addresses":' + dataToAdd + "}";

        await _post(serviceURL, emailData, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(() => {
            showToastSuccess({
              summary: "Success",
              detail: "Email sent."
            });
          })
          .catch((error) => {
            showToastError({
              summary: "Error Message",
              detail:
                error.message != undefined && error.type != undefined
                  ? error.type + ": " + error.message
                  : error.message
            });
          });
      } else {
        setErrors("Please enter valid email addresses.");
      }
    } else {
      setErrors("No email addresses.");
    }
  };

  const handleChange = (value) => {
    setEmailList(value);
    setErrors("");
  };

  return (
    <>
      <div className="eb-border-gray m-3 pt-3">
        <div className="text-xl font-semibold pl-3 mb-3">Email Receipt to Additional Person</div>
        <div className="eb-border-gray border-noround-top border-noround-bottom p-3">
          <label htmlFor="email" className="font-normal text-base">
            Multiple Email Address Should be seprated by commas.
          </label>
          <div className="grid my-3">
            <div className="col-12 md:col-8">
              <CustomInputField
                isIconPresent={false}
                value={emailList}
                onChange={(e) => handleChange(e.target.value)}
                classStyle="userNameStyle"
                name="email"
                placeholder="Email Address"
              />
              {errors && <small className="p-error">{errors}</small>}
            </div>
            <div className="col-12 md:col-4">
              <SimpleButton
                className={"w-full"}
                navigateLink={"false"}
                label={"Email Receipt"}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

SendEmailConfirmation.propTypes = {
  options: PropTypes.shape({
    serviceURL: PropTypes.string.isRequired
  })
};

export default SendEmailConfirmation;
