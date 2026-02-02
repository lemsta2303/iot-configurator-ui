import { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import Alert from 'src/components/ui/Alert';
import Button from 'src/components/ui/Button';
import Input from 'src/components/ui/Input';
import {
  resetSendingStatus,
  selectConfigDraft,
  selectConfigSendingStatus,
  setName,
} from 'src/features/config/configSlice';
import { type AlertVariant } from 'src/types/alertVariant';

/**
 * EditNameForm component responsible for rendering a form to edit the device name.
 */
const EditNameForm = () => {
  const configDraft = useAppSelector(selectConfigDraft);
  const [newName, setNewName] = useState(configDraft.name);
  const [message, setMessage] = useState<React.ReactNode>(null);
  const [messageType, setMessageType] = useState<AlertVariant>('info');
  const sendingStatus = useAppSelector(selectConfigSendingStatus);

  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === '') {
      setMessageType('error');
      setMessage('Name cannot be empty.');
      return;
    }
    dispatch(setName(newName));
    setMessageType('info');
    setMessage('Device name updated successfully. Save the configuration to apply changes.');
    dispatch(resetSendingStatus());
  };

  return (
    <>
      <h2 className="text-5xl mb-5 font-semibold ">Edit Device Name</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="text"
          value={newName}
          onChange={(val) => {
            if (message) {
              setMessage(null);
            }
            setNewName(val);
          }}
          className="border-1 min-w-[500px]"
          placeholder="Enter new device name"
        />
        <div className="buttons">
          <Button type="submit" className="!text-2xl px-10 py-3 " disabled={sendingStatus === 'saving'}>
            Submit
          </Button>
        </div>
        {message && <Alert message={message} type={messageType} />}
      </form>
    </>
  );
};

export default EditNameForm;
