import { useEffect, useMemo } from 'react';
import DeviceCard from './components/DeviceCard';
import { filterDevicesByType } from 'src/services/utils/devices.ts';
import { useParams } from 'react-router-dom';
import Alert from 'src/components/ui/Alert';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks.ts';
import {
  loadDevices,
  selectDevices,
  selectDevicesLoadError,
  selectDevicesLoading,
} from 'src/features/devices/devicesSlice.ts';

/**
 * DevicesList component responsible for displaying a list of devices, optionally filtered by type.
 */
function DevicesList() {
  const dispatch = useAppDispatch();
  const devices = useAppSelector(selectDevices);
  const loading = useAppSelector(selectDevicesLoading);
  const error = useAppSelector(selectDevicesLoadError);

  const { type } = useParams<{ type: string }>();

  useEffect(() => {
    dispatch(loadDevices());
  }, [dispatch]);

  const devicesToDisplay = useMemo(() => () => (type ? filterDevicesByType(devices, type) : devices), [devices, type]);

  if (loading) {
    return <Alert type="info" message="Loading..." />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (devicesToDisplay().length === 0) {
    return <Alert type="warning" message="No devices found." />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {devicesToDisplay().map((device) => (
        <DeviceCard key={device.id} device={device} />
      ))}
    </ul>
  );
}

export default DevicesList;
