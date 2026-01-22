import ConfigureDeviceMainView from 'src/features/config/components/ConfigureDeviceMainView';
import { useEffect } from 'react';
import { initConfigureDevice, resetConfig } from 'src/features/config/configSlice.ts';
import { useAppDispatch } from 'src/app/store/hooks.ts';
import { useParams } from 'react-router-dom';

/**
 * ConfigureDevicePage component responsible for initializing the device configuration process
 * and rendering the main view for configuring the device.
 */
function ConfigureDevicePage() {
  const { deviceId, type } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!deviceId || !type) {
      return;
    }
    dispatch(initConfigureDevice({ deviceId, type }));

    return () => {
      dispatch(resetConfig());
    };
  }, [deviceId, type, dispatch]);

  return <ConfigureDeviceMainView />;
}

export default ConfigureDevicePage;
