import { useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { loadDevices, selectDevices, selectDevicesLoading } from 'src/features/devices/devicesSlice.ts';
import SingleDevice from 'src/features/devices/components/display/SingleDevice';

/**
 * SingleDevicePage component responsible for fetching a single device and passing data.
 */
function SingleDevicePage() {
  const { deviceId } = useParams();

  const dispatch = useAppDispatch();
  const devices = useAppSelector(selectDevices);
  const loading = useAppSelector(selectDevicesLoading);
  const device = useMemo(() => devices.find((d) => d.id === deviceId), [deviceId, devices]);

  useEffect(() => {
    if (!devices.length && !loading) {
      dispatch(loadDevices());
    }
  }, [dispatch]);

  return <SingleDevice device={device} />;
}

export default SingleDevicePage;
