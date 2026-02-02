/**
 * Constants for the sidebar menu items.
 */
export const menuItems = [
  { path: '/', label: 'Home' },
  {
    path: '/devices',
    label: 'Devices',
    subItems: [
      { path: '/devices/zigbee', label: 'Zigbee' },
      { path: '/devices/lora', label: 'LoRaWAN' },
    ],
  },
  { path: '/add-device', label: 'Add Device' },
  { path: '/gateways', label: 'Gateways' },
];
