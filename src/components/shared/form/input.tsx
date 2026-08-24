"use client";

import { ErrorMessage, Field } from "formik";

interface InputProps {
  name: string;
  label: string;
  type?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "numeric" | "email";
  dir?: "rtl" | "ltr";
  placeholder?: string;
}

export default function Input({
  name,
  label,
  type = "text",
  inputClassName,
  labelClassName,
  errorClassName,
  autoComplete,
  inputMode,
  dir,
  placeholder,
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
        autoComplete={autoComplete}
        inputMode={inputMode}
        dir={dir}
        placeholder={placeholder}
        className={`mt-1 block w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-[#1f4a45] focus:ring-[#1f4a45] focus:outline-none sm:text-sm ${inputClassName ?? ""}`}
      />
      <ErrorMessage
        name={name}
        className={`text-sm text-red-500 ${errorClassName ?? ""}`}
        component="div"
      />
    </>
  );
}
