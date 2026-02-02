import { Link, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks.ts';
import { deleteDeviceById, selectIsDeviceDeleting } from 'src/features/devices/devicesSlice.ts';
import Button from 'src/components/ui/Button';
import { firstLetterToUpperCase } from 'src/services/utils/strings.ts';
import type { Device } from 'src/types/device.ts';

type DeviceCardProps = {
  device: Device;
};

/**
 * DeviceCard component responsible for rendering a single device card with options to configure or delete the device.
 * @param device - The device object containing its details.
 */
function DeviceCard({ device }: DeviceCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isDeleting = useAppSelector(selectIsDeviceDeleting(device.id));

  const handleDelete = () => {
    if (!device.type) {
      return;
    }
    dispatch(deleteDeviceById(device));
  };

  return (
    <li className="list-element">
      <div className="flex flex-col">
        <Link to={`/device/${device.id}`} className="flex gap-3 items-baseline ">
          <h2 className="text-body-default text-gray-800 hover:text-black font-semibold hover:underline cursor-pointer">
            {device.name}
          </h2>
          <h3 className="text-[10px] text-gray-500 text-sm">(id: {device.id})</h3>
        </Link>

        <h4 className="text-body-default text-gray-500 text-sm">{firstLetterToUpperCase(device.type)}</h4>
      </div>
      <div className="buttons flex gap-4">
        <Button onClick={() => navigate(`/configure-device/${device.type}/${device.id}`)}>Configure</Button>
        <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    </li>
  );
}

export default DeviceCard;
