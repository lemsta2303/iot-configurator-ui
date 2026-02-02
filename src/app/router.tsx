import { createBrowserRouter } from 'react-router-dom';

import HomePage from 'src/pages/Home';
import SingleDevicePage from 'src/pages/SingleDevice';
import RootLayout from 'src/pages/RootLayout';
import AddDevicePage from '../pages/AddDevice/AddDevice';
import DevicesPage from '../pages/Devices/Devices';
import ConfigureDevicePage from '../pages/ConfigureDevice';
import DeviceTypeChoicePage from '../pages/AddDevice/pages/DeviceTypeChoice';
import ZigbeeAddingPage from '../pages/AddDevice/pages/ZigbeeAdding';
import LoraProfileAddingPage from '../pages/AddDevice/pages/LoraProfileAdding';
import LoraDeviceAddingPage from '../pages/AddDevice/pages/LoraDeviceAdding';
import GatewaysPage from '../pages/Gateways';
import AddGatewayPage from 'src/pages/AddGateway';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'devices/:type', element: <DevicesPage /> },
      { path: 'devices', element: <DevicesPage /> },
      {
        path: 'add-device',
        element: <AddDevicePage />,
        children: [
          { index: true, element: <DeviceTypeChoicePage /> },
          { path: 'zigbee', element: <ZigbeeAddingPage /> },
          { path: 'lora-profile', element: <LoraProfileAddingPage /> },
          { path: 'lora-device/:profileId', element: <LoraDeviceAddingPage /> },
        ],
      },
      { path: 'device/:deviceId', element: <SingleDevicePage /> },
      { path: 'configure-device/:type/:deviceId', element: <ConfigureDevicePage /> },
      { path: 'gateways', element: <GatewaysPage /> },
      { path: 'add-gateway', element: <AddGatewayPage /> },
    ],
  },
]);
