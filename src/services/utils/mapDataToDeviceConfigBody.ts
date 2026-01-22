import type { DeviceType } from 'src/types/deviceType';
import type { DeviceConfigBody, DeviceConfigAttribute } from 'src/types/deviceConfiguration';
import { inferType } from './inferType';

/*
 * Maps raw device data + previously saved config attributes to DeviceConfigBody
 */
export const mapDataToConfigFormat = (
  deviceId: string,
  configId: string | undefined,
  deviceData: Record<string, string | number | boolean | null> | undefined,
  deviceName: string,
  savedAttributes: DeviceConfigAttribute[] = [],
  type: DeviceType
): DeviceConfigBody => {
  if (!type) {
    throw new Error('Type is required');
  }

  const oldAttributes = savedAttributes.length ? savedAttributes : [];

  if (!deviceData) {
    return {
      device_id: deviceId,
      name: deviceName,
      type,
      config: { attributes: oldAttributes },
      id: configId,
    };
  }

  const newAttributes: DeviceConfigAttribute[] = Object.entries(deviceData).map(([key, value]) => {
    const saved = savedAttributes.find((attr) => attr.name === key);
    return {
      name: key,
      value,
      option: saved?.option ?? 'ignore',
      type: inferType(deviceData[key]),
      rename: saved?.rename,
      proc: saved?.proc ?? null,
    };
  });

  const mergedAttributes: DeviceConfigAttribute[] = [
    ...newAttributes,
    ...oldAttributes.filter((oldAttr) => !newAttributes.some((newAttr) => newAttr.name === oldAttr.name)),
  ];

  return {
    device_id: deviceId,
    name: deviceName,
    type,
    config: { attributes: mergedAttributes },
    id: configId,
  };
};
