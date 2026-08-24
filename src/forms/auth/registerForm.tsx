"use client";

import { withFormik } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import InnerRegisterForm from "@/components/auth/innerRegisterForm";
import { RegisterFormValuesInterface } from "@/contracts/auth";
import ValidationError from "@/exceptions/validationError";
import callApi from "@/helpers/callApi";

const phoneRegExp = /^(0|0098|\+98)9(0[1-5]|[13]\d|2[0-2]|98)\d{7}$/;

interface RegisterFormProps {
  router: ReturnType<typeof useRouter>;
}

const FormikRegisterForm = withFormik<
  RegisterFormProps,
  RegisterFormValuesInterface
>({
  mapPropsToValues: () => ({
    name: "",
    phone: "",
  }),
  validationSchema: yup.object({
    name: yup.string().required("نام الزامی است").min(4).max(255),
    phone: yup
      .string()
      .required("شماره موبایل الزامی است")
      .min(8)
      .matches(phoneRegExp, "فرمت شماره موبایل صحیح نیست"),
  }),
  handleSubmit: async (values, { setFieldError, props }) => {
    try {
      const res = await callApi().post("/auth/register", values);
      if (res.status === 201) {
        props.router.push("/auth/login");
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        Object.entries(error.messages).forEach(([key, value]) =>
          setFieldError(key, value),
        );
      }
    }
  },
})(InnerRegisterForm);

export default function RegisterForm() {
  const router = useRouter();
  return <FormikRegisterForm router={router} />;
}
