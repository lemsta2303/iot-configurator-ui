import { configureStore } from '@reduxjs/toolkit';
import gatewaysReducer from '../../features/gateways/gatewaysSlice.ts';
import devicesReducer from '../../features/devices/devicesSlice.ts';
import configureDeviceReducer from '../../features/config/configSlice.ts';

export const store = configureStore({
  reducer: {
    gateways: gatewaysReducer,
    devices: devicesReducer,
    configureDevice: configureDeviceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
