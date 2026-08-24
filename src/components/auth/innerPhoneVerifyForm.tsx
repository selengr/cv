"use client";

import { Form, type FormikProps } from "formik";
import Input from "@/components/shared/form/input";
import Spinner from "@/components/icons/spinner";

export default function InnerPhoneVerify({
  isSubmitting,
}: FormikProps<{ code: string; token: string }>) {
  return (
    <Form className="space-y-5">
      <Input
        name="code"
        label="کد تایید"
        autoComplete="one-time-code"
        inputMode="numeric"
        dir="ltr"
        placeholder="123456"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-full bg-[#1f4a45] px-4 py-2.5 text-sm text-white hover:bg-[#173833] disabled:opacity-60"
      >
        {isSubmitting && <Spinner className="ml-2 h-4 w-4" />}
        {isSubmitting ? "در حال تایید..." : "ورود به پنل"}
      </button>
    </Form>
  );
}
