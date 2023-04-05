import { ErrorMessage, Field, FieldProps } from "formik";
import { ChangeEvent, FC } from "react";
import { string } from "yup";

interface TextareaProps {
    name : string,
    label : string,
    rows? : number
    inputClassName? : string,
    labelClassName? : string,
    errorClassName? : string
    onChange? : (e : ChangeEvent) => void
}

const Textarea : FC<TextareaProps> = ({
    name,
    label,
    rows = 5,
    inputClassName,
    labelClassName,
    errorClassName,
    onChange
}) => {

    return (
        <>
            <label htmlFor={name} className={`block text-sm font-medium text-gray-700 ${labelClassName ?? ''}`}>
                {label}
            </label>
            {/*  */}
            <Field id={name} name={name}>
                {
                    ({ field , meta } : FieldProps) => (
                        <textarea 
                            id={name} 
                            rows={rows}
                            className={`mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${ inputClassName ?? ''}`}
                            {...field}
                            onChange={onChange || field.onChange }
                        />
                    )
                }
            </Field>
            <ErrorMessage name={name} className={`text-red-500 text-sm ${errorClassName ?? ''}`} component="div"/>
        </>
    );

}


export default Textarea;