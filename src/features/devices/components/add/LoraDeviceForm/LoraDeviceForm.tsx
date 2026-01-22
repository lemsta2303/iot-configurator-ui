import { useState, type ReactNode } from 'react';
import { useParams } from 'react-router';
import Button from 'src/components/ui/Button';
import Input from 'src/components/ui/Input';
import Alert from 'src/components/ui/Alert';
import { addLoraDevice } from 'src/services/api/devices.ts';
import type { AddLoraDevicePayload } from 'src/types/addLoraDevicePayload.ts';
import type { AlertVariant } from 'src/types/alertVariant.ts';
import { normHex } from 'src/features/devices/components/add/LoraProfileForm/utils.ts';

/**
 * LoraDeviceForm component responsible for rendering the form to add a new LoRa device.
 */
function LoraDeviceForm() {
  const [name, setName] = useState('');
  const [devEui, setDevEui] = useState('');
  const [appKey, setAppKey] = useState('');
  const [message, setMessage] = useState<ReactNode | null>(null);
  const [messageVariant, setMessageVariant] = useState<AlertVariant>('info');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { profileId } = useParams();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Device name is required.';
    }
    if (!devEui.trim()) {
      newErrors.devEui = 'Device EUI is required.';
    } else if (!/^[0-9A-Fa-f]{16}$/.test(normHex(devEui))) {
      newErrors.devEui = 'Device EUI must be 16 hex characters.';
    }
    if (!appKey.trim()) {
      newErrors.appKey = 'App Key is required.';
    } else if (!/^[0-9A-Fa-f]{32}$/.test(normHex(appKey))) {
      newErrors.appKey = 'App Key must be 32 hex characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const devEuiN = normHex(devEui);
    const appKeyN = normHex(appKey);

    if (!profileId) {
      setMessageVariant('error');
      setMessage('Profile ID is missing!');
      return;
    }

    if (!validate()) {
      return;
    }

    const payload: AddLoraDevicePayload = {
      name,
      dev_eui: devEuiN,
      app_key: appKeyN,
      profile_id: profileId,
    };

    try {
      await addLoraDevice(payload);
      setMessage(
        <div className="flex items-center gap-5">
          <p>Device added successfully!</p>
          <Button variant="secondary" onClick={() => resetForm()}>
            Add Another Device
          </Button>
        </div>
      );
      setMessageVariant('success');
    } catch {
      setMessage('Failed to add device.');
      setMessageVariant('error');
    }
  };

  const resetForm = () => {
    setName('');
    setDevEui('');
    setAppKey('');
    setMessage(null);
    setErrors({});
  };

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="form-input-wrapper">
          <label htmlFor="name" className="form-label">
            Device Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(str) => {
              setName(str);
              setErrors({ ...errors, name: '' });
            }}
            placeholder="Enter device name"
            id="name"
            name="name"
            className="form-input"
            errorMessage={errors.name}
          />
        </div>
        <div className="form-input-wrapper">
          <label htmlFor="script" className="form-label">
            Device EUI
          </label>
          <Input
            type="text"
            value={devEui}
            onChange={(str) => {
              setDevEui(str);
              setErrors({ ...errors, devEui: '' });
            }}
            placeholder="Enter device EUI"
            id="devEui"
            name="devEui"
            className="form-input"
            errorMessage={errors.devEui}
          />
        </div>
        <div className="form-input-wrapper">
          <label htmlFor="appKey" className="form-label">
            App Key
          </label>
          <Input
            type="text"
            value={appKey}
            onChange={(str) => {
              setAppKey(str);
              setErrors({ ...errors, appKey: '' });
            }}
            placeholder="Enter app key"
            id="appKey"
            name="appKey"
            className="form-input"
            errorMessage={errors.appKey}
          />
        </div>
        <Button variant="primary" className="mt-4 py-5 px-10 w-fit ml-auto" type="submit">
          Submit
        </Button>
      </form>
      {message && <Alert message={message} type={messageVariant} className="mt-10" />}
    </div>
  );
}

export default LoraDeviceForm;
