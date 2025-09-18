import React, { useId, useRef } from "react";
import { Field } from "@ark-ui/react";
import { UploadCloud } from "lucide-react";

interface InputFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorText?: string;
  helperText?: string;
  containerClassName?: string;
  fileName?: string;
  isUploading?: boolean;
}

const InputFile: React.FC<InputFileProps> = ({
  error = false,
  errorText = "Error",
  helperText,
  className = "",
  containerClassName = "",
  id,
  fileName = "",
  isUploading = false,
  ...inputProps
}) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <Field.Root
      className={`relative w-full mb-5 ${containerClassName}`}
      invalid={error}
    >
      <input
        ref={fileInputRef}
        type="file"
        id={inputId}
        className="hidden"
        {...inputProps}
      />
      <button
        type="button"
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-4 py-2 bg-white
          border-[1px] border-gray-300 rounded-sm text-sm
          ${error ? "border-red-500" : ""}
        `}
      >
        <UploadCloud className="w-4 h-4" />
        {isUploading ? "Uploading..." : "Select file"}
      </button>
      <div className="mt-1 text-xs min-h-[1.5em]">
        {fileName && (
          <span>
            Selected: <b>{fileName}</b>
          </span>
        )}
      </div>

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

export default InputFile;
