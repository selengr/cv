"use client";

import { withFormik } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import InnerLoginForm from "@/components/auth/innerLoginForm";
import { LoginFormValuesInterface } from "@/contracts/auth";
import ValidationError from "@/exceptions/validationError";
import callApi from "@/helpers/callApi";

const phoneRegExp = /^(0|0098|\+98)9(0[1-5]|[13]\d|2[0-2]|98)\d{7}$/;

const loginFormValidationSchema = yup.object({
  phone: yup
    .string()
    .required("شماره موبایل الزامی است")
    .min(8)
    .matches(phoneRegExp, "فرمت شماره موبایل صحیح نیست"),
});

interface LoginFormProps {
  setToken: (token: string) => void;
}

function LoginFormWithRouter(
  props: LoginFormProps & { router: ReturnType<typeof useRouter> },
) {
  const Form = withFormik<typeof props, LoginFormValuesInterface>({
    mapPropsToValues: () => ({
      phone: "",
    }),
    validationSchema: loginFormValidationSchema,
    handleSubmit: async (values, { props: formProps, setFieldError }) => {
      try {
        const res = await callApi().post("/auth/login", values);
        if (res.status === 200) {
          formProps.setToken(res.data.token);
          formProps.router.push("/auth/login/step-two");
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          Object.entries(error.messages).forEach(([key, value]) =>
            setFieldError(key, value),
          );
        }
      }
    },
  })(InnerLoginForm);

  return <Form {...props} />;
}

export default function LoginForm(props: LoginFormProps) {
  const router = useRouter();
  return <LoginFormWithRouter {...props} router={router} />;
}
