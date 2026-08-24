"use client";

import { withFormik } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import InnerPhoneVerify from "@/components/auth/innerPhoneVerifyForm";
import { PhoneVerifyFormValuesInterface } from "@/contracts/auth";
import ValidationError from "@/exceptions/validationError";
import { storeLoginToken } from "@/helpers/auth";
import callApi from "@/helpers/callApi";

const phoneVerifyFormValidationSchema = yup.object({
  code: yup
    .string()
    .required("کد تایید الزامی است")
    .matches(/^[0-9]+$/, "فقط می‌توانید عدد وارد کنید")
    .length(6, "کد تایید باید ۶ رقم باشد"),
});

interface PhoneVerifyFormProps {
  token?: string;
  clearToken: () => void;
}

function PhoneVerifyFormWithRouter(
  props: PhoneVerifyFormProps & { router: ReturnType<typeof useRouter> },
) {
  const Form = withFormik<typeof props, PhoneVerifyFormValuesInterface>({
    mapPropsToValues: (formProps) => ({
      code: "",
      token: formProps.token || "",
    }),
    validationSchema: phoneVerifyFormValidationSchema,
    handleSubmit: async (values, { props: formProps, setFieldError }) => {
      try {
        const res = await callApi().post("/auth/login/verify-phone", values);
        if (res.status === 200) {
          await storeLoginToken(res.data?.user?.token);
          formProps.clearToken();
          formProps.router.push("/panel");
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          Object.entries(error.messages).forEach(([key, value]) =>
            setFieldError(key, value),
          );
        }
      }
    },
  })(InnerPhoneVerify);

  return <Form {...props} />;
}

export default function PhoneVerifyForm(props: PhoneVerifyFormProps) {
  const router = useRouter();
  return <PhoneVerifyFormWithRouter {...props} router={router} />;
}
