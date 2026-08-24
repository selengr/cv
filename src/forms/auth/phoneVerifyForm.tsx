"use client";

import { withFormik } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import InnerPhoneVerify from "@/components/auth/innerPhoneVerifyForm";
import { PhoneVerifyFormValuesInterface } from "@/contracts/auth";
import ValidationError from "@/exceptions/validationError";
import { storeLoginToken } from "@/helpers/auth";
import callApi from "@/helpers/callApi";

interface PhoneVerifyFormProps {
  token?: string;
  clearToken: () => void;
  router: ReturnType<typeof useRouter>;
}

const FormikPhoneVerifyForm = withFormik<
  PhoneVerifyFormProps,
  PhoneVerifyFormValuesInterface
>({
  mapPropsToValues: (props) => ({
    code: "",
    token: props.token || "",
  }),
  validationSchema: yup.object({
    code: yup
      .string()
      .required("کد تایید الزامی است")
      .matches(/^[0-9]+$/, "فقط می‌توانید عدد وارد کنید")
      .length(6, "کد تایید باید ۶ رقم باشد"),
  }),
  handleSubmit: async (values, { props, setFieldError }) => {
    try {
      const res = await callApi().post("/auth/login/verify-phone", values);
      if (res.status === 200) {
        await storeLoginToken(res.data?.user?.token);
        props.clearToken();
        props.router.push("/panel");
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

export default function PhoneVerifyForm({
  token,
  clearToken,
}: {
  token?: string;
  clearToken: () => void;
}) {
  const router = useRouter();
  return (
    <FormikPhoneVerifyForm
      token={token}
      clearToken={clearToken}
      router={router}
    />
  );
}
