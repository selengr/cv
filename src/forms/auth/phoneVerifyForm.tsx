"use client";

import { withFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as yup from "yup";
import { mutate } from "swr";
import InnerPhoneVerify from "@/components/auth/innerPhoneVerifyForm";
import { PhoneVerifyFormValuesInterface } from "@/contracts/auth";
import ValidationError, {
  applyFieldErrors,
} from "@/exceptions/validationError";
import {
  clearPhoneVerifyTokenStorage,
  storeLoginToken,
} from "@/helpers/auth";
import { clearOtpHint } from "@/helpers/localDb";
import callApi from "@/helpers/callApi";

interface PhoneVerifyFormProps {
  token?: string;
  router: ReturnType<typeof useRouter>;
}

const FormikPhoneVerifyForm = withFormik<
  PhoneVerifyFormProps,
  PhoneVerifyFormValuesInterface
>({
  enableReinitialize: true,
  mapPropsToValues: (props) => ({
    code: "",
    token: props.token || "",
  }),
  validationSchema: yup.object({
    code: yup
      .string()
      .required("کد تایید را بنویس")
      .matches(/^[0-9]+$/, "فقط عدد")
      .length(6, "کد باید ۶ رقم باشد"),
  }),
  handleSubmit: async (values, { props, setFieldError }) => {
    if (!values.token) {
      toast.error("نشست ورود منقضی شده. دوباره از اول وارد شو");
      props.router.replace("/auth/login");
      return;
    }

    try {
      const res = await callApi().post("/auth/login/verify-phone", {
        code: values.code,
        token: values.token,
      });

      const user = res.data?.user;
      const loginToken = user?.token;

      if (res.status === 200 && loginToken) {
        await storeLoginToken(loginToken);
        clearPhoneVerifyTokenStorage();
        clearOtpHint();
        await mutate("user_me", user, { revalidate: true });
        props.router.replace("/panel");
        return;
      }

      toast.error("کد تایید درست نبود");
    } catch (error) {
      if (error instanceof ValidationError) {
        applyFieldErrors(error.messages, setFieldError);
        return;
      }

      toast.error("تایید انجام نشد. کد را دوباره چک کن");
    }
  },
})(InnerPhoneVerify);

export default function PhoneVerifyForm({ token }: { token?: string }) {
  const router = useRouter();
  return <FormikPhoneVerifyForm token={token} router={router} />;
}
