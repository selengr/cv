"use client";

import { ErrorMessage, Field, type FieldProps } from "formik";
import type { ChangeEvent } from "react";

interface TextareaProps {
  name: string;
  label: string;
  rows?: number;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea({
  name,
  label,
  rows = 5,
  inputClassName,
  labelClassName,
  errorClassName,
  onChange,
}: TextareaProps) {
  return (
    <>
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-gray-700 ${labelClassName ?? ""}`}
      >
        {label}
      </label>
      <Field id={name} name={name}>
        {({ field }: FieldProps) => (
          <textarea
            id={name}
            rows={rows}
            className={`mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm ${inputClassName ?? ""}`}
            {...field}
            onChange={onChange || field.onChange}
          />
        )}
      </Field>
      <ErrorMessage
        name={name}
        className={`text-sm text-red-500 ${errorClassName ?? ""}`}
        component="div"
      />
    </>
  );
}
