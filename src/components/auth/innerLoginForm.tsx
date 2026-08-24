"use client";

import { Form } from "formik";
import Input from "@/components/shared/form/input";

export default function InnerLoginForm() {
  return (
    <Form className="space-y-6">
      <div>
        <Input name="phone" label="شماره موبایل" />
      </div>
      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          ورود
        </button>
      </div>
    </Form>
  );
}
