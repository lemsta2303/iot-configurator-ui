import { useState, type ReactNode } from 'react';
import { typeClasses } from './constants';
import type { AlertVariant } from 'src/types/alertVariant';

type AlertProps = {
  message: ReactNode;
  type: AlertVariant;
  className?: string;
  ifCloseButton?: boolean;
};

/**
 * Alert component to display messages of various types (info, success, warning, error).
 * @param message - The message to display in the alert.
 * @param type - The type of alert (info, success, warning, error).
 * @param className - Additional CSS classes to apply to the alert container.
 * @param ifCloseButton - Whether to show a close button (not implemented yet).
 */
function Alert({ message, type = 'info', className, ifCloseButton = false }: AlertProps) {
  const [ifHide, setIfHide] = useState(false);

  if (!message) return null;

  if (ifHide) {
    return null;
  }

  return (
    <div
      className={`${typeClasses[type]} p-3 rounded-md shadow-sm text-body-small relative flex justify-between items-center ${className}`}
    >
      {message}
      {ifCloseButton && (
        <button
          className="color-inherit cursor-pointer text-4xl"
          onClick={() => {
            setIfHide(true);
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default Alert;
