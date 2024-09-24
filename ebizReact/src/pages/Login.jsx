import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { loginValidationSchema } from "@validations/loginValidation";
import SimpleButton from "@components/atoms/Buttons/SimpleButton";
import { useToast } from "@context/ToasterProvider";
import { getCart } from "@store/CartSlice";
import { login } from "@store/UserSlice";
import { FormBuilder } from "@components/molecules";
import "@css/login.scss";

const Login = () => {
  const form = useForm({
    mode: "onBlur",
    resolver: yupResolver(loginValidationSchema)
  });
  const { isSubmitting, isValid } = form.formState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToastError } = useToast();
  const [loginError, setLoginError] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    const showError = async () => {
      if (loginError) {
        await setLoading(false);
        showToastError({
          summary: "Error Message",
          detail: loginError //response.payload.response.data.LoginError,
        });
      }
    };
    showError();
  }, [loginError, showToastError]);

  const loginUser = async (event) => {
    setLoginError("");
    const data = {
      UserName: event?.username,
      Password: event?.password,
      RememberMe: event?.keepLoggedIn
    };
    setLoading(true);
    setLoginError("");
    const response = await dispatch(login(data));
    setLoading(false);
    if (response.error) {
      setLoginError(
        response?.payload?.response?.data?.LoginError ??
          response?.payload?.LoginError ??
          response?.payload
      );
    } else {
      dispatch(getCart()).then(() => {
        navigate("/product-catalog");
      });
    }
  };

  function CreateAccount() {
    navigate("/signup");
  }

  const fields = useMemo(
    () => [
      {
        type: "text",
        name: "username",
        label: "Username or Email",
        isRequired: true
      },
      {
        type: "password",
        name: "password",
        label: "Password",
        isRequired: true
      },
      {
        type: "checkbox",
        name: "keepLoggedIn",
        label: "Keep me logged in"
      }
    ],
    []
  );

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-column flex-grow-1">
        <main className="flex-grow-1 surface-50 py-5">
          <div className="max-w-30rem border-2 border-round-2xl p-5 surface-border bg-white mx-auto">
            <h1 className="text-center mb-3">Sign In</h1>
            <FormBuilder onSubmit={loginUser} form={form} fields={fields}>
              <div className="field mt-3">
                <SimpleButton
                  className={"w-full"}
                  navigatelink={"false"}
                  label={"Sign In"}
                  type="submit"
                  loading={loading}
                  onClick={() => form.handleSubmit()}
                  disabled={isSubmitting || !isValid}
                />
              </div>
              <div className="col-12">
                <div className="eb-text-separator text-center">
                  <span className="inline px-3">New to e-Business ?</span>
                </div>
              </div>
              <div className="field">
                <SimpleButton
                  className={"w-full"}
                  navigatelink={"false"}
                  label={"Sign Up"}
                  onClick={CreateAccount}
                  outlined
                />
              </div>
            </FormBuilder>
          </div>
        </main>
        {/* )} */}
      </div>
    </div>
  );
};

export default Login;
