"use client";

import { Form, type FormikProps } from "formik";
import Input from "@/components/shared/form/input";
import Spinner from "@/components/icons/spinner";

export default function InnerLoginForm({
  isSubmitting,
}: FormikProps<{ phone: string }>) {
  return (
    <Form className="space-y-5">
      <Input
        name="phone"
        label="شماره موبایل"
        autoComplete="tel"
        inputMode="tel"
        dir="ltr"
        placeholder="09121234567"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-full bg-[#1f4a45] px-4 py-2.5 text-sm text-white hover:bg-[#173833] disabled:opacity-60"
      >
        {isSubmitting && <Spinner className="ml-2 h-4 w-4" />}
        {isSubmitting ? "لطفا صبر کن..." : "ادامه"}
      </button>
    </Form>
  );
}
