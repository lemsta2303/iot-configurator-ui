import { useState } from 'react';
import Button from '../Button';
import { useAppSelector } from 'src/app/store/hooks';
import { selectConfigSendingStatus } from 'src/features/config/configSlice';

type ModalProps = {
  btnContent?: React.ReactNode;
  content?: React.ReactNode;
};

/**
 * Modal component responsible for rendering a modal dialog.
 * @param btnContent - The content to display on the button that opens the modal.
 * @param content - The content to display inside the modal.
 */
const Modal = ({ btnContent = 'Open Modal', content }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const sendingStatus = useAppSelector(selectConfigSendingStatus);

  return (
    <>
      {isOpen && (
        <div
          className="modal fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.3)] flex items-start justify-center z-99999  "
          onMouseDown={() => setIsOpen(false)}
        >
          <div
            className="modal-content bg-white rounded shadow-lg relative flex flex-col mt-[20vh] p-10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <span className="close text-5xl cursor-pointer absolute top-2 right-4" onClick={() => setIsOpen(false)}>
              &times;
            </span>
            <div>{content}</div>
          </div>
        </div>
      )}
      <Button
        variant="secondary"
        className="py-5 px-10 font-semibold"
        onClick={() => setIsOpen(true)}
        disabled={sendingStatus === 'saving'}
      >
        {btnContent}
      </Button>
    </>
  );
};
export default Modal;
