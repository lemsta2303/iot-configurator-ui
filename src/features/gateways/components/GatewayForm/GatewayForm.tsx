import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks.ts';
import {
  addSingleGateway,
  resetAddingState,
  selectGatewaysAddingError,
  selectGatewaysAddingState,
} from 'src/features/gateways/gatewaysSlice.ts';
import Alert from 'src/components/ui/Alert';
import Button from 'src/components/ui/Button';
import Input from 'src/components/ui/Input';
import { normHex } from 'src/features/devices/components/add/LoraProfileForm/utils.ts';
import * as React from 'react';

/**
 * GatewayForm component responsible for rendering the form to add a new gateway.
 */
function GatewayForm() {
  const [gatewayName, setGatewayName] = useState('');
  const [gatewayId, setGatewayId] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const dispatch = useAppDispatch();
  const error = useAppSelector(selectGatewaysAddingError);
  const addingState = useAppSelector(selectGatewaysAddingState);

  const validate = () => {
    const errors: { [key: string]: string } = {};
    const normalizedGatewayId = normHex(gatewayId);

    if (!gatewayName) {
      errors.name = 'Gateway name is required';
    }
    if (!normalizedGatewayId) {
      errors.id = 'Gateway ID is required';
    }
    if (normalizedGatewayId && !/^[0-9A-Fa-f]{16}$/.test(normalizedGatewayId)) {
      errors.id = 'Gateway ID must be a valid 16-character hex string';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const normalizedGatewayId = normHex(gatewayId);

    dispatch(addSingleGateway({ gateway_id: normalizedGatewayId, name: gatewayName }));
    resetForm();
  };

  const resetForm = () => {
    setGatewayName('');
    setGatewayId('');
    setValidationErrors({});
  };

  // Clear error message on unmount
  useEffect(() => {
    return () => {
      dispatch(resetAddingState());
    };
  }, []);

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="form-input-wrapper">
          <label htmlFor="name" className="form-label">
            Gateway Name
          </label>
          <Input
            type="text"
            value={gatewayName}
            onChange={(str) => {
              setGatewayName(str);
              dispatch(resetAddingState());
              setValidationErrors({ ...validationErrors, name: '' });
            }}
            placeholder="Enter gateway name"
            id="name"
            name="name"
            className="form-input"
            errorMessage={validationErrors.name}
          />
        </div>
        <div className="form-input-wrapper">
          <label htmlFor="script" className="form-label">
            Gateway ID
          </label>
          <Input
            type="text"
            value={gatewayId}
            onChange={(str) => {
              setGatewayId(str);
              dispatch(resetAddingState());
              setValidationErrors({ ...validationErrors, id: '' });
            }}
            placeholder="Enter device EUI"
            id="devEui"
            name="devEui"
            className="form-input"
            errorMessage={validationErrors.id}
          />
        </div>
        <Button
          variant="primary"
          className="mt-4 py-5 px-10 w-fit ml-auto"
          type="submit"
          disabled={addingState === 'pending'}
        >
          {addingState === 'pending' ? 'Adding...' : 'Submit'}
        </Button>
      </form>
      {addingState === 'failed' && <Alert message={error || 'Failed to add gateway'} type="error" className="mt-10" />}
      {addingState === 'succeeded' && <Alert message="Gateway added successfully" type="success" className="mt-10" />}
    </div>
  );
}

export default GatewayForm;
