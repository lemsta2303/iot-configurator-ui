import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteConfiguration, deleteDevice, getAllConfigurations } from 'src/services/api/devices.ts';
import { mapConfigResponseToDevicesList } from 'src/services/utils/devices.ts';
import type { Device } from 'src/types/device.ts';
import type { RootState } from '../../app/store/store.ts';

type DevicesState = {
  list: Device[];
  loading: boolean;
  deleting: Record<string, boolean>;
  loadError: string | null;
  deleteError: string | null;
};

const initialState: DevicesState = {
  list: [],
  loading: false,
  deleting: {},
  loadError: null,
  deleteError: null,
};

export const loadDevices = createAsyncThunk<Device[]>('devices/loadAll', async () => {
  const response = await getAllConfigurations();
  return mapConfigResponseToDevicesList(response);
});

export const deleteDeviceById = createAsyncThunk<string, Device>('devices/deleteById', async (device) => {
  if (!device.type) {
    throw new Error('Device type is required for deletion');
  }
  await deleteDevice(device.id, device.type);
  await deleteConfiguration(device.configId);
  return device.id;
});

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // loading devices
    builder.addCase(loadDevices.pending, (state) => {
      state.loading = true;
      state.loadError = null;
    });
    builder.addCase(loadDevices.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(loadDevices.rejected, (state, action) => {
      state.loading = false;
      state.loadError = action.error.message ?? 'Failed to load devices';
    });

    // deleting device
    builder.addCase(deleteDeviceById.pending, (state, action) => {
      const { id } = action.meta.arg;
      state.deleting[id] = true;
      state.deleteError = null;
    });
    builder.addCase(deleteDeviceById.fulfilled, (state, action) => {
      const removedId = action.payload;
      state.list = state.list.filter((d) => d.id !== removedId);
      delete state.deleting[removedId];
    });
    builder.addCase(deleteDeviceById.rejected, (state, action) => {
      const { id } = action.meta.arg;
      delete state.deleting[id];
      state.deleteError = action.error.message ?? 'Failed to delete device';
    });
  },
});

export default devicesSlice.reducer;

export const selectDevices = (state: RootState): Device[] => state.devices.list;
export const selectDevicesLoading = (state: RootState): boolean => state.devices.loading;
export const selectDevicesLoadError = (state: RootState): string | null => state.devices.loadError;
export const selectIsDeviceDeleting = (id: string) => (state: RootState) => Boolean(state.devices.deleting[id]);
