import React, { useId } from "react";
import { Field } from "@ark-ui/react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
  errorText?: string;
  helperText?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error = false,
  errorText = "Error",
  helperText,
  className = "",
  containerClassName = "",
  id,
  ...inputProps
}) => {
  const autoId = useId();
  const inputId = id ?? autoId; //for unic ID for the input field

  return (
    <Field.Root
      className={`relative w-full mb-5 ${containerClassName}`}
      invalid={error}
    >
      <Field.Label
        htmlFor={inputId}
        className="absolute -top-2 left-3 px-1 text-sm text-black bg-white"
      >
        {label}
      </Field.Label>

      <Field.Input
        id={inputId}
        className={`w-full h-12 rounded-sm px-3 pt-2 pb-1 border-2 focus:outline-none focus:bg-white bg-white
          ${error ? "border-red-500 focus:border-red-500" : "border-black focus:border-black"}
          ${className}`}
        {...inputProps}
      />

      {!error && helperText && (
        <Field.HelperText className="mt-1 text-xs text-gray-500">
          {helperText}
        </Field.HelperText>
      )}

      {error && (
        <Field.ErrorText className="mt-1 text-xs text-red-500">
          {errorText}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default Input;
