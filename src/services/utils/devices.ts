import type { Device } from 'src/types/device';
import type { DeviceConfigBody } from 'src/types/deviceConfiguration';
import type { DeviceType } from 'src/types/deviceType';

/**
 * Maps the API response to a list of Device objects.
 * Each device is represented by its ID and type.
 * @param data The response data containing devices information.
 * @returns An array of Device objects.
 */
export const mapConfigResponseToDevicesList = (data: DeviceConfigBody[]): Device[] =>
  data.map((item) => ({
    id: item.device_id,
    name: item.name,
    configId: item.id ?? '',
    type: item.type as DeviceType,
  }));

/**
 * Filters the list of devices by type.
 * @param devices The list of devices to filter.
 * @param type The type to filter by.
 * @returns A filtered list of devices belonging to the specified type.
 */
export const filterDevicesByType = (devices: Device[], type: string | undefined): Device[] => {
  if (!type) {
    return devices;
  }
  return devices.filter((device) => device.type === type);
};
