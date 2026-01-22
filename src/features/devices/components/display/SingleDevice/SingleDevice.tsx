import type { Device } from 'src/types/device.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks.ts';
import { deleteDeviceById, selectDevicesLoading, selectIsDeviceDeleting } from 'src/features/devices/devicesSlice.ts';
import Alert from 'src/components/ui/Alert';
import { firstLetterToUpperCase } from 'src/services/utils/strings.ts';
import Button from 'src/components/ui/Button';

type SingleDeviceProps = {
  device: Device | undefined;
};

/**
 * SingleDevice component responsible for rendering a single device with options to configure or delete the device.
 * @param device - The device object containing its details.
 */
function SingleDevice({ device }: SingleDeviceProps) {
  const { deviceId } = useParams();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectDevicesLoading);
  const isDeleting = useAppSelector(selectIsDeviceDeleting(deviceId ?? ''));

  const handleDelete = async () => {
    if (!device || !device.type) {
      return;
    }
    try {
      await dispatch(deleteDeviceById(device));
      navigate('/devices');
    } catch (error) {
      console.error(`Failed to delete device ${device.id}:`, error);
    }
  };

  if (loading) {
    return <Alert type="info" message="Loading..." />;
  }

  if (!device) {
    return <Alert type="error" message="Device not found." />;
  }

  return (
    <div>
      <h2 className="flex flex-col items-baseline mb-5">
        <span className="subpage-title !mb-0">{device.name}</span>
        <span className="text-body-large text-gray-500 -translate-y-2">(id: {device.id})</span>
      </h2>
      <h3 className="text-h4 text-gray-700">
        Type: <strong>{firstLetterToUpperCase(device.type)}</strong>
      </h3>
      <div className="buttons mt-15 flex gap-4">
        <Button
          className="text-body-default px-10 py-5"
          onClick={() => {
            navigate(`/configure-device/${device.type}/${device.id}`);
          }}
        >
          Configure
        </Button>
        <Button className="px-10 py-5" variant="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    </div>
  );
}

export default SingleDevice;
