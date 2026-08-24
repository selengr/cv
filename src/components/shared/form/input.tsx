"use client";

import { ErrorMessage, Field } from "formik";

interface InputProps {
  name: string;
  label: string;
  type?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export default function Input({
  name,
  label,
  type = "text",
  inputClassName,
  labelClassName,
  errorClassName,
}: InputProps) {
  return (
    <>
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-gray-700 ${labelClassName ?? ""}`}
      >
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        className={`mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm ${inputClassName ?? ""}`}
      />
      <ErrorMessage
        name={name}
        className={`text-sm text-red-500 ${errorClassName ?? ""}`}
        component="div"
      />
    </>
  );
}
