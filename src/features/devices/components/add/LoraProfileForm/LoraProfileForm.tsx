import { useState } from 'react';
import Button from 'src/components/ui/Button';
import Input from 'src/components/ui/Input';
import { addLoraProfile } from 'src/services/api/devices.ts';
import type { LoraProfile } from 'src/types/loraProfile.ts';
import { booleanOptions } from './constants.ts';
import { useNavigate } from 'react-router';
import Alert from 'src/components/ui/Alert';

/**
 * LoraProfileForm component responsible for rendering the form to add a new LoRa profile.
 */
function LoraProfileForm() {
  const [name, setName] = useState('');
  const [script, setScript] = useState('');
  const [otaa, setOtaa] = useState(false);
  const [classB, setClassB] = useState(false);
  const [classC, setClassC] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!script.trim()) {
      newErrors.script = 'Script is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const profileData: LoraProfile = {
      name,
      script,
      otaa,
      class_b: classB,
      class_c: classC,
    };

    try {
      const response = await addLoraProfile(profileData);
      navigate(`/add-device/lora-device/${response.id}`);
    } catch (error) {
      setMessage('Error adding LoRa profile. Please try again.');
      console.error('Error adding LoRa profile:', error);
    }
  };

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="form-input-wrapper">
          <label htmlFor="name" className="form-label">
            Profile Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(str) => {
              setName(str);
              setErrors({ ...errors, name: '' });
            }}
            placeholder="Enter profile name"
            id="name"
            name="name"
            className="form-input"
            errorMessage={errors.name}
          />
        </div>
        <div className="form-input-wrapper">
          <label htmlFor="script" className="form-label">
            Script
          </label>
          <Input
            type="textarea"
            value={script}
            onChange={(str) => {
              setScript(str);
              setErrors({ ...errors, script: '' });
            }}
            placeholder="Enter script"
            id="script"
            name="script"
            className="form-input"
            errorMessage={errors.script}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="form-input-wrapper">
            <label htmlFor="otaa" className="form-label">
              OTAA
            </label>
            <Input
              type="select"
              value={otaa ? 'true' : 'false'}
              onChange={(str) => setOtaa(str === 'true')}
              options={booleanOptions}
              id="otaa"
              name="otaa"
              className="form-input"
            />
          </div>
          <div className="form-input-wrapper">
            <label htmlFor="classB" className="form-label">
              Class B
            </label>
            <Input
              type="select"
              value={classB ? 'true' : 'false'}
              onChange={(str) => setClassB(str === 'true')}
              options={booleanOptions}
              id="classB"
              name="classB"
              className="form-input"
            />
          </div>
          <div className="form-input-wrapper">
            <label htmlFor="classC" className="form-label">
              Class C
            </label>
            <Input
              type="select"
              value={classC ? 'true' : 'false'}
              onChange={(str) => setClassC(str === 'true')}
              options={booleanOptions}
              id="classC"
              name="classC"
              className="form-input"
            />
          </div>
        </div>
        <Button variant="primary" className="mt-4 py-5 px-10 w-fit ml-auto" type="submit">
          Submit
        </Button>
      </form>
      {message && <Alert message={message} type="error" className="mt-10" />}
    </div>
  );
}

export default LoraProfileForm;
