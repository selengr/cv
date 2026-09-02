"use client";

import { withFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as yup from "yup";
import InnerLoginForm from "@/components/auth/innerLoginForm";
import { LoginFormValuesInterface } from "@/contracts/auth";
import ValidationError, {
  applyFieldErrors,
} from "@/exceptions/validationError";
import callApi from "@/helpers/callApi";
import { iranianPhoneRegExp, normalizeIranianPhone } from "@/helpers/auth";

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
      .required("شماره موبایل را بنویس")
      .matches(iranianPhoneRegExp, "این شماره درست به نظر نمی‌رسد"),
  }),
  handleSubmit: async (values, { props, setFieldError }) => {
    try {
      const res = await callApi().post("/auth/login", {
        phone: normalizeIranianPhone(values.phone),
      });

      const token = res.data?.token;
      const debugCode = res.data?.debug_code as string | undefined;
      if ((res.status === 200 || res.status === 201) && token) {
        props.setToken(token);
        if (debugCode) {
          toast.info(`کد تایید: ${debugCode}`, { autoClose: 8000 });
        } else if (res.data?.sms_sent) {
          toast.success("کد تایید پیامک شد");
        }
        props.router.push("/auth/login/step-two");
        return;
      }

      toast.error("کد تایید فرستاده نشد");
    } catch (error) {
      if (error instanceof ValidationError) {
        applyFieldErrors(error.messages, setFieldError);
        return;
      }

      toast.error("ورود انجام نشد. یک بار دیگر امتحان کن");
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
