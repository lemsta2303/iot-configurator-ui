/**
 * Represents the response from the API containing all devices.
 */
export type AllDevicesResponse = {
  zigbee?: {
    devices?: string[];
    coordinators?: string;
  };
  lora?: {
    devices?: string[];
    gateways?: string[];
  };
};
