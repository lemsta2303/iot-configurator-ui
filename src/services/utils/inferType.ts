// utils/inferType.ts
import { type DeviceAttributeType } from 'src/types/deviceConfiguration';

export function inferType(v: unknown): DeviceAttributeType | undefined {
  if (v === null) {
    return 'null';
  }
  if (typeof v === 'boolean') {
    return 'bool';
  }
  if (typeof v === 'string') {
    return 'string';
  }
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) {
      return undefined;
    }
    return Number.isInteger(v) ? 'int' : 'float';
  }
  return undefined;
}
