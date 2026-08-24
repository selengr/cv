"use client";

import { withFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as yup from "yup";
import InnerRegisterForm from "@/components/auth/innerRegisterForm";
import { RegisterFormValuesInterface } from "@/contracts/auth";
import ValidationError, {
  applyFieldErrors,
} from "@/exceptions/validationError";
import callApi from "@/helpers/callApi";
import { iranianPhoneRegExp, normalizeIranianPhone } from "@/helpers/auth";

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
    name: yup.string().required("نام را بنویس").min(2, "نام کوتاه است").max(255),
    phone: yup
      .string()
      .required("شماره موبایل را بنویس")
      .matches(iranianPhoneRegExp, "این شماره درست به نظر نمی‌رسد"),
  }),
  handleSubmit: async (values, { setFieldError, props }) => {
    try {
      const res = await callApi().post("/auth/register", {
        name: values.name.trim(),
        phone: normalizeIranianPhone(values.phone),
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("حساب ساخته شد. حالا وارد شو");
        props.router.push("/auth/login");
        return;
      }

      toast.error("ثبت‌نام کامل نشد");
    } catch (error) {
      if (error instanceof ValidationError) {
        applyFieldErrors(error.messages, setFieldError);
        return;
      }

      toast.error("ثبت‌نام انجام نشد. یک بار دیگر امتحان کن");
    }
  },
})(InnerRegisterForm);

export default function RegisterForm() {
  const router = useRouter();
  return <FormikRegisterForm router={router} />;
}
