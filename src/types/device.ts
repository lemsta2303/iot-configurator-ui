import type { DeviceType } from './deviceType';

/**
 * Device type definition for the application.
 */
export type Device = {
  id: string;
  name: string;
  configId: string;
  type: DeviceType;
};
