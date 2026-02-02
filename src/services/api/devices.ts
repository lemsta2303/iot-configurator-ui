import axios from 'axios';
import { config } from 'src/config';
import type { AddLoraDevicePayload } from 'src/types/addLoraDevicePayload';
import type { DeviceConfigBody } from 'src/types/deviceConfiguration';
import type { Gateway } from 'src/types/gateway';
import type { LoraProfile } from 'src/types/loraProfile';

export async function startZigbeeJoin(time: number = 60) {
  const response = await axios.put(`${config.API_BASE}/devices/zigbee`, null, {
    params: { time },
  });
  return response.data;
}

export async function stopZigbeeJoin() {
  const response = await axios.put(`${config.API_BASE}/devices/zigbee`, null, {
    params: { time: 0 },
  });
  return response.data;
}

export async function getAllDevices() {
  const response = await axios.get(`${config.API_BASE}/devices`);
  return response.data;
}

export async function getDeviceData(deviceId: string, type: string) {
  const response = await axios.get(`${config.API_BASE}/devices/${type}/${deviceId}`);
  return response.data;
}

export async function deleteDevice(deviceId: string, type: string) {
  const response = await axios.delete(`${config.API_BASE}/devices/${type}/${deviceId}`);
  return response.data;
}

export async function addLoraProfile(data: LoraProfile) {
  const response = await axios.put(`${config.API_BASE}/devices/lora/profile`, data);
  return response.data;
}

export async function addLoraDevice(data: AddLoraDevicePayload) {
  const response = await axios.put(`${config.API_BASE}/devices/lora`, data);
  return response.data;
}

export async function sendConfigurationData(data: DeviceConfigBody) {
  const response = await axios.post(`${config.API_BASE}/config`, data);
  return response.data;
}

export async function getAllConfigurations() {
  const response = await axios.get(`${config.API_BASE}/config`);
  return response.data;
}

export async function getSingleConfiguration(deviceId: string) {
  const response = await axios.get(`${config.API_BASE}/config`, {
    params: { device_id: deviceId },
  });
  return response.data;
}

export async function deleteConfiguration(configId: string) {
  const response = await axios.delete(`${config.API_BASE}/config/${configId}`);
  return response.data;
}

export async function addGateway(data: Gateway) {
  const response = await axios.put(`${config.API_BASE}/devices/lora/gateway`, data);
  return response.data;
}

export async function deleteGateway(gatewayId: string) {
  const response = await axios.delete(`${config.API_BASE}/devices/lora/gateway/${gatewayId}`);
  return response.data;
}

export async function suggestNewCustomNames(oldNames: string[], caseFormat: string) {
  const params = new URLSearchParams();
  oldNames.forEach((name) => params.append('name', name));
  params.append('case', caseFormat);

  const url = `${config.API_BASE}/suggestions/rename?${params.toString()}`;

  const response = await axios.get(url);
  return response.data;
}

export async function getAllProcessingFunctions() {
  const response = await axios.get(`${config.API_BASE}/suggestions/proc`);
  return response.data;
}
