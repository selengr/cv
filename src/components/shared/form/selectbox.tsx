"use client";

import { ErrorMessage, Field, type FieldProps } from "formik";
import type { ChangeEvent } from "react";

interface SelectBoxOptionsInterface {
  label: string;
  value: string | number;
}

interface SelectBoxProps {
  name: string;
  label: string;
  options: SelectBoxOptionsInterface[];
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectBox({
  name,
  label,
  options,
  inputClassName,
  labelClassName,
  errorClassName,
  onChange,
}: SelectBoxProps) {
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
          <select
            {...field}
            className={`mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm ${inputClassName ?? ""}`}
            onChange={onChange || field.onChange}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
