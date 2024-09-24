import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { signUpValidationSchema } from "@validations/signUpValidation";
import { useToast } from "@context/ToasterProvider";
import { useStateUser } from "@hooks/useStateUser";
import { SimpleButton } from "@components/atoms";
import { SignUp, userSlice } from "@store/UserSlice";
import { FormBuilder } from "@components/molecules";
import { getErrorMessage } from "@constants";

const SignUpComponent = () => {
  const form = useForm({
    mode: "onBlur",
    resolver: yupResolver(signUpValidationSchema)
  });
  const { resetError } = userSlice.actions ?? {};
  const { showToastError } = useToast();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.user);

  const user = useStateUser({});

  useEffect(() => {
    if (user && user.isUserLoggedIn) {
      navigate("/product-catalog");
    } else if (error?.errorCode) {
      //get error message based on error code
      const errormessage = getErrorMessage(error.errorCode);
      showToastError({
        severity: "error",
        sticky: false,
        summary: "Error Message",
        detail: errormessage || error?.message
      });
      dispatch(resetError());
    }
  }, [dispatch, error, navigate, resetError, showToastError, user]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      dispatch(SignUp(formData)).then(() => {
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      console.error("err in signing up >> ", err);
    }
  };

  function SignInAccount() {
    navigate("/");
  }

  const fields = useMemo(
    () => [
      {
        type: "group",
        group: [
          {
            type: "text",
            name: "firstname",
            label: "First Name",
            hasNoFieldClass: true,
            isRequired: true
          },
          {
            type: "text",
            name: "lastname",
            label: "Last Name",
            hasNoFieldClass: true,
            isRequired: true
          }
        ]
      },
      {
        type: "text",
        name: "email",
        label: "Email Address",
        classStyle: "userNameStyle",
        isRequired: true
      },
      {
        type: "password",
        name: "password",
        label: "Password",
        isRequired: true
      },
      {
        type: "password",
        name: "confirmpassword",
        label: "Confirm Password",
        isRequired: true
      }
    ],
    []
  );

  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex flex-column flex-grow-1">
          <main className="flex-grow-1 surface-50 py-5">
            <div className="max-w-30rem border-2 border-round-2xl p-5 surface-border bg-white mx-auto">
              <h1 className="text-center mb-3">Sign Up</h1>
              <FormBuilder onSubmit={handleSubmit} form={form} fields={fields}>
                <div className="field mt-3">
                  <SimpleButton
                    className={"w-full"}
                    navigatelink={"false"}
                    label={"Sign Up"}
                    type="submit"
                    loading={loading}
                    disabled={!form.formState.isValid}
                  />
                </div>
                <div className="col-12">
                  <div className="eb-text-separator text-center">
                    <span className="inline px-3">Already have an Account?</span>
                  </div>
                </div>
                <div className="field">
                  <SimpleButton
                    className={"w-full"}
                    navigatelink={"false"}
                    label={"Sign In"}
                    onClick={SignInAccount}
                    outlined
                  />
                </div>
              </FormBuilder>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default SignUpComponent;
