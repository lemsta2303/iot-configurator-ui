export type DeviceAttributeType = 'string' | 'int' | 'float' | 'bool' | 'null';

export type DeviceAttributeOption = 'tag' | 'field' | 'ignore';

export interface DeviceConfigAttribute {
  name: string;
  option: DeviceAttributeOption;
  value?: string | number | boolean | null;
  type?: DeviceAttributeType;
  rename?: string;
  proc?: string | null;
}

export interface DeviceConfigBody {
  device_id: string;
  name: string;
  type: string;
  config: {
    attributes: DeviceConfigAttribute[];
  };
  id?: string;
}
