import React, { useId } from "react";
import { Field } from "@ark-ui/react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorText?: string;
  helperText?: string;
  containerClassName?: string;
}

const InputSmall: React.FC<InputProps> = ({
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
      <Field.Input
        id={inputId}
        className={`w-full h-10 text-sm rounded-sm px-3 items-center pb-1 border-[1px] focus:outline-none
          ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-600"}
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

export default InputSmall;
