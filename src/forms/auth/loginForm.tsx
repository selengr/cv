"use client";

import { withFormik } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import InnerLoginForm from "@/components/auth/innerLoginForm";
import { LoginFormValuesInterface } from "@/contracts/auth";
import ValidationError from "@/exceptions/validationError";
import callApi from "@/helpers/callApi";

const phoneRegExp = /^(0|0098|\+98)9(0[1-5]|[13]\d|2[0-2]|98)\d{7}$/;

interface LoginFormProps {
  setToken: (token: string) => void;
  router: ReturnType<typeof useRouter>;
}

const FormikLoginForm = withFormik<LoginFormProps, LoginFormValuesInterface>({
  mapPropsToValues: () => ({
    phone: "",
  }),
  validationSchema: yup.object({
    phone: yup
      .string()
      .required("شماره موبایل الزامی است")
      .min(8)
      .matches(phoneRegExp, "فرمت شماره موبایل صحیح نیست"),
  }),
  handleSubmit: async (values, { props, setFieldError }) => {
    try {
      const res = await callApi().post("/auth/login", values);
      if (res.status === 200) {
        props.setToken(res.data.token);
        props.router.push("/auth/login/step-two");
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

export default function LoginForm({
  setToken,
}: {
  setToken: (token: string) => void;
}) {
  const router = useRouter();
  return <FormikLoginForm setToken={setToken} router={router} />;
}
