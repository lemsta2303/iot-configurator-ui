import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Gateway } from 'src/types/gateway.ts';
import { getAllDevices, addGateway, deleteGateway } from 'src/services/api/devices.ts';
import type { RootState } from '../../app/store/store.ts';

export const fetchGateways = createAsyncThunk<Gateway[]>('gateways/fetchAll', async () => {
  const res = await getAllDevices();
  const gatewayIds: string[] = res?.lora?.gateways ?? [];
  return gatewayIds.map((id) => ({ gateway_id: id }));
});

export const addSingleGateway = createAsyncThunk<Gateway, Gateway>('gateways/add', async (gatewayData) => {
  await addGateway(gatewayData);
  return gatewayData;
});

export const deleteSingleGateway = createAsyncThunk<string, string>('gateways/delete', async (gatewayId) => {
  await deleteGateway(gatewayId);
  return gatewayId;
});

type GatewaysState = {
  list: Gateway[];
  loading: boolean;
  addingState: 'idle' | 'failed' | 'succeeded' | 'pending';
  loadingError: string | null;
  addingError: string | null;
};

const initialState: GatewaysState = {
  list: [],
  loading: false,
  addingState: 'idle',
  loadingError: null,
  addingError: null,
};

const gatewaysSlice = createSlice({
  name: 'gateways',
  initialState,
  reducers: {
    resetAddingState: (state) => {
      state.addingState = 'idle';
      state.addingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loading all
      .addCase(fetchGateways.pending, (state) => {
        state.loading = true;
        state.loadingError = null;
      })
      .addCase(fetchGateways.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchGateways.rejected, (state, action) => {
        state.loading = false;
        state.loadingError = action.error.message ?? 'Failed to fetch gateways';
      })

      // adding single
      .addCase(addSingleGateway.pending, (state) => {
        state.addingState = 'pending';
        state.addingError = null;
      })
      .addCase(addSingleGateway.fulfilled, (state, action) => {
        state.addingState = 'succeeded';
        state.list.push(action.payload);
      })
      .addCase(addSingleGateway.rejected, (state, action) => {
        state.addingState = 'failed';
        console.error(action.error.message);
        state.addingError = 'Failed to add gateway';
      })

      // deleting single
      .addCase(deleteSingleGateway.pending, () => {})
      .addCase(deleteSingleGateway.fulfilled, (state, action) => {
        state.list = state.list.filter((gateway) => gateway.gateway_id !== action.payload);
      })
      .addCase(deleteSingleGateway.rejected, (_, action) => {
        console.error(action.error.message ?? 'Failed to delete gateway');
      });
  },
});

export const { resetAddingState } = gatewaysSlice.actions;
export default gatewaysSlice.reducer;

export const selectGateways = (state: RootState): Gateway[] => state.gateways.list;
export const selectGatewaysLoading = (state: RootState) => state.gateways.loading;
export const selectGatewaysLoadingError = (state: RootState) => state.gateways.loadingError;
export const selectGatewaysAddingState = (state: RootState): 'idle' | 'failed' | 'succeeded' | 'pending' =>
  state.gateways.addingState;
export const selectGatewaysAddingError = (state: RootState) => state.gateways.addingError;
