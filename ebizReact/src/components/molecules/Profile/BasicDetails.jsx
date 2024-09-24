import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";

import { basicDetailsValidationSchema } from "@validations/basicDetailsValidation";
import { useStateUser } from "@hooks/useStateUser.js";
import { useToast } from "@context/ToasterProvider.jsx";
import { _get, _patch } from "@api/APIClient";
import { SimpleButton } from "@components/atoms";
import { FormBuilder, Loader } from "@components/molecules";
import {
  COMMUNICATION_PREFERENCE,
  DEFAULT_DATE,
  EMAIL_TYPE_WITH_CODE,
  EMAIL_TYPES,
  GENDER_LIST,
  PREFIX_LIST,
  SUFFIX_LIST
} from "@constants";
import { getUserDetails } from "@store/UserSlice";
import { generateDatabaseDateTime, generateDateMMDDYYYY } from "@utils/generateDateTime.js";

const BasicDetails = () => {
  // Get the userId for performing various operations
  const user = useStateUser({});
  const [loading, setLoading] = useState(false);
  const isLoggedIn = user.isUserLoggedIn;
  const UserId = user.LinkId;
  const dispatch = useDispatch();
  // Navigate and toasters
  const navigate = useNavigate();
  const { showToastSuccess } = useToast();

  // predefine user Info strcuture
  const [userInfo, setUserInfo] = useState([
    "firstName",
    "lastName",
    "title",
    "primaryEmail",
    "secondaryEmail",
    "tertiaryEmail",
    "primaryFunction",
    "congressionalInfo",
    "birthday",
    "excludeFromMembershipDirectory",
    "optsOutOfEmailCommunication",
    "optsOutOfFaxCommunication",
    "optsOutOfMailCommunication",
    "prefix",
    "suffix",
    "gender"
  ]);
  const form = useForm({
    mode: "onBlur",
    defaultValues: userInfo,
    resolver: yupResolver(basicDetailsValidationSchema)
  });
  // Opertaions which we are going to perform on forms and set the default value
  const {
    reset,
    setValue,
    watch,
    formState: { isSubmitting, isValid }
  } = form;
  const [isDirty, setIsDirty] = useState(false);
  // Fields on which we are going to perform watch operation.
  const [emailType, emailField] = watch(["email", "emailField", "birthday"]);
  // Prefix Dropdown list
  // This use effect is to navigate the user is not logged in or logged out after the time lapse
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate, user]);

  // Fetching the API data for user details and
  // assigning them to the fields for auto complete
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [basicAddresResponse] = await Promise.all([basicAddressDetails()]);
        // If the response is success
        // Assign the required values when the form get load
        if (basicAddresResponse) {
          const tempData = basicAddresResponse;
          resetData(tempData);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetData(tempData) {
    // need explicite assignment for email and bithdate field.
    tempData.email = EMAIL_TYPE_WITH_CODE[0].name;

    tempData.emailField = tempData.primaryEmail;
    const tempBirthDate = new Date(tempData.birthday);
    if (generateDateMMDDYYYY(tempBirthDate) === DEFAULT_DATE) {
      tempData.birthday = null;
    } else {
      tempData.birthday = tempBirthDate;
    }
    setValue("birthday", tempData.birthday);
    // and reset the form with the changed values
    // so that will rerender the field values with updated one for perform auto fill operation.
    reset(tempData);
    setValue(
      "prefix",
      PREFIX_LIST.find((p) => p.name === tempData.prefix)
    );
    setValue(
      "suffix",
      SUFFIX_LIST.find((p) => p.code === tempData.suffix)
    );
    setValue("email", EMAIL_TYPE_WITH_CODE?.[0]);
    setValue(
      "gender",
      GENDER_LIST.find((p) => p.name === tempData.gender)
    );

    setValue(
      "exlude_from",
      COMMUNICATION_PREFERENCE.map((p) => {
        p.checked = tempData[p.value];
        return p;
      })
    );

    // And for our record we have saved all cvalues in userInfo
    setUserInfo(tempData);
  }

  // API call
  const basicAddressDetails = async () => {
    setLoading(true);
    try {
      const response = await _get("/v1/ProfilePersons/" + UserId, {
        withCredentials: true
      });
      setLoading(false);
      return response.data; // Assuming response.data contains person details
    } catch (error) {
      setLoading(false);
      console.error("Error fetching for profile details:", error);
      throw error; // Propagate the error
    }
  };

  useEffect(() => {
    onEmailTypeChange(emailType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailType]);

  // On Email dropdown change we have to update the input field that shows the email address.
  // Also the need of this function is when perform onChanged on dropdown,
  // this does not called "onValueChanged" similar to all other fields.
  function onEmailTypeChange(e) {
    if (!e?.name) {
      return;
    }
    if (e?.name === EMAIL_TYPES.PRIMARY) {
      setValue("emailField", userInfo.primaryEmail);
    } else if (e?.name === EMAIL_TYPES.SECONDARY) {
      setValue("emailField", userInfo.secondaryEmail);
    } else if (e?.name === EMAIL_TYPES.TERTIARY) {
      setValue("emailField", userInfo.tertiaryEmail);
    }
  }

  function onEmailChange() {
    let tempUserInfo = userInfo;
    if (!emailType?.name) {
      return;
    }
    // set the value for the field "emailField" to display email address
    if (emailType?.name === EMAIL_TYPES.PRIMARY) {
      tempUserInfo = { ...tempUserInfo, primaryEmail: emailField };
    } else if (emailType?.name === EMAIL_TYPES.SECONDARY) {
      tempUserInfo = { ...tempUserInfo, secondaryEmail: emailField };
    } else if (emailType?.name === EMAIL_TYPES.TERTIARY) {
      tempUserInfo = { ...tempUserInfo, tertiaryEmail: emailField };
    }
    setUserInfo(tempUserInfo);
  }

  useEffect(() => {
    onEmailChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailField]);

  // The Birthdate in our database in ISO formated String not ISO formated date
  // So we need to convert into required format
  function onBirthDateFormate(data) {
    const tempUserInfo = userInfo;
    if (!data.birthday) {
      return;
    }
    tempUserInfo.birthday = generateDatabaseDateTime(data.birthday);
    setUserInfo(tempUserInfo);
  }

  // When we click Save button the function is triggered
  function saveBasicDetails(data) {
    setIsDirty(false);
    userInfo.gender = data.gender;
    userInfo.prefix = data.prefix;
    userInfo.suffix = data.suffix;
    userInfo.firstName = data.firstName;
    userInfo.lastName = data.lastName;
    userInfo.title = data.title;
    userInfo.prefix = data.prefix.name;
    userInfo.suffix = data.suffix.name;
    userInfo.gender = data.gender.name;
    userInfo.congressionalInfo = data.congressionalInfo;
    const communicationPrefrence = data?.exlude_from?.reduce(
      (a, x) => ({ ...a, [x.value]: x.checked }),
      {}
    );

    onBirthDateFormate(data);

    const SubmitDetails = async () => {
      try {
        const [basicDetailsResponse] = await Promise.all([
          basicDetailsSumbit({ ...userInfo, ...communicationPrefrence })
        ]);

        if (basicDetailsResponse) {
          resetData(basicDetailsResponse);
          showToastSuccess({
            summary: "Success",
            detail: "Changes have been successfully saved."
          });
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    SubmitDetails();
  }

  // API call for Submit
  const basicDetailsSumbit = async (postData) => {
    setLoading(true);
    try {
      const url = "/v1/ProfilePersons/" + UserId;
      const response = await _patch(url, postData, {
        withCredentials: true
      });
      setLoading(false);
      dispatch(getUserDetails(UserId));
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error("Error fetching for profile details:", error);
      throw error;
    }
  };

  const fields = useMemo(
    () => [
      {
        type: "group",
        group: [
          {
            type: "dropdown",
            name: "prefix",
            label: "Prefix",
            options: PREFIX_LIST
          },
          {
            type: "text",
            name: "firstName",
            label: "First Name",
            isRequired: true
          },
          {
            type: "text",
            name: "lastName",
            label: "Last Name",
            isRequired: true
          }
        ]
      },
      {
        type: "group",
        group: [
          {
            type: "dropdown",
            name: "suffix",
            label: "Suffix",
            options: SUFFIX_LIST,
            className: "col-4"
          },
          {
            type: "text",
            name: "title",
            label: "Title",
            className: "col-8"
          }
        ]
      },
      {
        type: "group",
        group: [
          {
            type: "dropdown",
            name: "email",
            label: "Email Type",
            options: EMAIL_TYPE_WITH_CODE,
            className: "col-4"
          },
          {
            type: "text",
            name: "emailField",
            label: "Email Address",
            className: "col-8"
          }
        ]
      },
      {
        type: "element",
        element: (
          <>
            <div className="eb-border-gray border-noround-bottom col-12 mt-3 p-0" />
            <div className="text-lg font-bold my-3 ">Demographics</div>
          </>
        )
      },
      {
        type: "group",
        group: [
          {
            type: "text",
            name: "primaryFunction",
            label: "Primary Function",
            disabled: true
          },
          {
            type: "text",
            name: "congressionalInfo",
            label: "US Congress",
            disabled: true
          }
        ]
      },
      {
        type: "group",
        group: [
          {
            type: "date",
            name: "birthday",
            label: "Birthday"
          },
          {
            type: "dropdown",
            name: "gender",
            label: "Gender",
            options: GENDER_LIST
          }
        ]
      },
      {
        type: "element",
        element: (
          <>
            <div className="eb-border-gray border-noround-bottom col-12 mt-3 p-0" />
            <div className="text-lg font-bold my-3 ">Communication Preferences</div>
            <label className="text-base" htmlFor="mailCheckBox">
              Exclude From
            </label>
          </>
        )
      },
      {
        type: "checkbox-group",
        name: "exlude_from",
        options: COMMUNICATION_PREFERENCE
      }
    ],
    []
  );

  return (
    <div className="mt-4">
      {loading && <Loader />}
      <FormBuilder
        onValueChange={() => setIsDirty(true)}
        onSubmit={saveBasicDetails}
        form={form}
        fields={fields}
      >
        <div className="col-12 md:col-4 mt-5 mb-3 p-0">
          <SimpleButton
            type="submit"
            label={"Save Changes"}
            disabled={isSubmitting || !isDirty || !isValid}
          />
        </div>
      </FormBuilder>
    </div>
  );
};

export default BasicDetails;
