import React from "react";
import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import Button from "./Button";

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
  buttonTitle = "OK",
  onClickButton,
  isVisibleButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog.Root
      open
      onOpenChange={(d) => {
        if (!d.open) onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/30" />
        <Dialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content className="flex flex-col bg-white rounded-lg shadow-lg p-8 max-w-md w-full items-center">
            <Dialog.Description className="text-black text-xl mb-16">
              {message}
            </Dialog.Description>

            {isVisibleButton && (
              <Dialog.CloseTrigger asChild>
                <Button
                  className="w-full"
                  onClick={() => {
                    onClickButton?.();
                  }}
                >
                  {buttonTitle}
                </Button>
              </Dialog.CloseTrigger>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CustomDialog;
