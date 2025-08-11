import { Dialog, DialogPanel } from "@headlessui/react";
import Button from "./Button";
import React from "react";

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  buttonTitle?: string;
  onClickButton?: () => void;
  isVisibleButton?: boolean;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  onClose,
  message,
  buttonTitle,
  onClickButton,
  isVisibleButton = true,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      as="div"
      className="fixed inset-0 z-50 flex items-center justify-center "
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="flex flex-col bg-white rounded-lg shadow-lg p-8 max-w-md w-full justify-center items-center">
          <p className="text-black text-xl mb-16">{message}</p>
          {isVisibleButton && (
            <Button
              className="w-full"
              onClick={() => {
                onClickButton && onClickButton();
              }}
            >
              {buttonTitle}
            </Button>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CustomDialog;
