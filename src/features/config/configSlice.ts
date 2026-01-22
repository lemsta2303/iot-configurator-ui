import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  getSingleConfiguration,
  getDeviceData,
  sendConfigurationData,
  suggestNewCustomNames,
  getAllProcessingFunctions,
} from 'src/services/api/devices.ts';
import type { DeviceAttributeOption, DeviceConfigAttribute, DeviceConfigBody } from 'src/types/deviceConfiguration.ts';
import type { RootState } from '../../app/store/store.ts';
import type { DeviceType } from 'src/types/deviceType.ts';
import { mapDataToConfigFormat } from 'src/services/utils/mapDataToDeviceConfigBody.ts';
import type { ProcessingFunctionType } from 'src/types/processingFunctions.ts';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
type SendingStatus = 'idle' | 'saving' | 'succeeded' | 'failed';

type ConfigureDeviceState = {
  draft: DeviceConfigBody;
  loadingStatus: RequestStatus;
  sendingStatus: SendingStatus;
  error: string | null;
  ifSavedBefore: boolean;
  processingFunctions: ProcessingFunctionType[];
  nameSuggestionCaseFormat: 'camel' | 'snake' | 'kebab' | 'pascal';
};

const initialState: ConfigureDeviceState = {
  draft: {
    device_id: '',
    name: '',
    type: '',
    config: { attributes: [] },
    id: undefined,
  },
  loadingStatus: 'idle',
  sendingStatus: 'idle',
  error: null,
  ifSavedBefore: false,
  processingFunctions: [],
  nameSuggestionCaseFormat: 'camel',
};

export const initConfigureDevice = createAsyncThunk<
  { config: DeviceConfigBody; ifSavedBefore: boolean; processingFunctions: ProcessingFunctionType[] },
  { deviceId: string; type: string }
>('configureDevice/init', async ({ deviceId, type }) => {
  if (!type) {
    throw new Error('Device type is required');
  }
  const [deviceReq, configReq, processingFunctionsReq] = await Promise.allSettled([
    getDeviceData(deviceId, type),
    getSingleConfiguration(deviceId),
    getAllProcessingFunctions(),
  ]);

  const processingFunctions =
    processingFunctionsReq.status === 'fulfilled' ? processingFunctionsReq.value.functions : [];
  processingFunctions.push({
    display_name: 'None',
    name: '',
    tags: [],
    value_type: 'noneType',
  });

  const savedAttributes = configReq.status === 'fulfilled' ? configReq.value?.[0]?.config?.attributes : undefined;
  const configId = configReq.status === 'fulfilled' ? configReq.value?.[0]?.id : undefined;
  const deviceName = configReq.status === 'fulfilled' ? configReq.value?.[0]?.name : deviceId;

  const merged: DeviceConfigBody = mapDataToConfigFormat(
    deviceId,
    configId,
    deviceReq.status === 'fulfilled' ? deviceReq.value : undefined,
    deviceName,
    savedAttributes,
    type as DeviceType
  );

  return {
    config: merged,
    ifSavedBefore: savedAttributes !== undefined,
    processingFunctions,
  };
});

export const loadDeviceConfig = createAsyncThunk<DeviceConfigBody, string>('configureDevice/load', async (deviceId) => {
  return getSingleConfiguration(deviceId);
});

export const saveDeviceConfig = createAsyncThunk<DeviceConfigBody, void, { state: RootState }>(
  'configureDevice/save',
  async (_void, thunkApi) => {
    const body = thunkApi.getState().configureDevice.draft;
    await sendConfigurationData(body);
    return body;
  }
);

export const suggestCustomNames = createAsyncThunk<DeviceConfigBody, void, { state: RootState }>(
  'configureDevice/suggestNames',
  async (_void, thunkApi) => {
    const body = thunkApi.getState().configureDevice.draft;
    const caseFormat = thunkApi.getState().configureDevice.nameSuggestionCaseFormat;
    const newNames = await suggestNewCustomNames(
      body.config.attributes.map((attr) => attr.name),
      caseFormat
    );

    const newAttributes = body.config.attributes.map((attr, index) => ({
      ...attr,
      rename: newNames.suggestions[index].suggestion,
    }));

    return {
      ...body,
      config: {
        ...body.config,
        attributes: newAttributes,
      },
    };
  }
);

export const suggestCustomSingleName = createAsyncThunk<DeviceConfigBody, string, { state: RootState }>(
  'configureDevice/suggestSingleName',
  async (oldName, thunkApi) => {
    const nameSuggestionCaseFormat = thunkApi.getState().configureDevice.nameSuggestionCaseFormat;
    const newNames = await suggestNewCustomNames([oldName], nameSuggestionCaseFormat);
    const body = thunkApi.getState().configureDevice.draft;

    const newAttributes = body.config.attributes.map((attr) => {
      if (attr.name === oldName) {
        return {
          ...attr,
          rename: newNames.suggestions[0].suggestion,
        };
      }
      return attr;
    });
    return {
      ...body,
      config: {
        ...body.config,
        attributes: newAttributes,
      },
    };
  }
);

const upsertAttribute = (
  attributes: DeviceConfigAttribute[],
  name: string,
  updater: (attr: DeviceConfigAttribute | undefined) => DeviceConfigAttribute
): DeviceConfigAttribute[] => {
  const idx = attributes.findIndex((a) => a.name === name);
  if (idx === -1) return [...attributes, updater(undefined)];
  const next = [...attributes];
  next[idx] = updater(next[idx]);
  return next;
};

const configSlice = createSlice({
  name: 'configureDevice',
  initialState,
  reducers: {
    resetConfig(state) {
      state.draft.config.attributes = state.draft.config.attributes.map((attr) => ({
        name: attr.name,
        option: 'ignore' as DeviceAttributeOption,
        value: attr.value,
        type: attr.type,
        rename: '',
        proc: null,
      }));
    },

    setName(state, action: PayloadAction<string>) {
      state.draft.name = action.payload;
    },

    updateAttributeOption(state, action: PayloadAction<{ attributeName: string; value: DeviceAttributeOption }>) {
      state.draft.config.attributes = upsertAttribute(
        state.draft.config.attributes,
        action.payload.attributeName,
        (attr) => ({
          name: action.payload.attributeName,
          option: action.payload.value,
          value: attr?.value,
          type: attr?.type,
          rename: attr?.rename,
          proc: attr?.proc,
        })
      );
    },

    setAttributeRename(state, action: PayloadAction<{ attributeName: string; rename?: string }>) {
      state.draft.config.attributes = upsertAttribute(
        state.draft.config.attributes,
        action.payload.attributeName,
        (attr) => ({
          name: action.payload.attributeName,
          option: attr?.option ?? 'ignore',
          value: attr?.value,
          type: attr?.type,
          rename: action.payload.rename,
          proc: attr?.proc,
        })
      );
    },

    setProcessingFunction(state, action: PayloadAction<{ attributeName: string; proc: string | null }>) {
      state.draft.config.attributes = upsertAttribute(
        state.draft.config.attributes,
        action.payload.attributeName,
        (attr) => ({
          name: action.payload.attributeName,
          option: attr?.option ?? 'ignore',
          value: attr?.value,
          type: attr?.type,
          rename: attr?.rename,
          proc: action.payload.proc,
        })
      );
    },

    resetSendingStatus(state) {
      state.sendingStatus = 'idle';
      state.error = null;
    },

    setAttributesOptionsBasedOnType(state) {
      state.draft.config.attributes = state.draft.config.attributes.map((attr) => {
        let option: DeviceAttributeOption = 'ignore';
        if (attr.type === 'string') {
          option = 'tag';
        } else if (attr.type === 'int' || attr.type === 'float' || attr.type === 'bool') {
          option = 'field';
        }
        return {
          ...attr,
          option,
        };
      });
    },

    setSuggestionCaseFormat(state, action: PayloadAction<'camel' | 'snake' | 'kebab' | 'pascal'>) {
      state.nameSuggestionCaseFormat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initConfigureDevice.pending, (state) => {
      state.loadingStatus = 'loading';
      state.error = null;
    });
    builder.addCase(initConfigureDevice.fulfilled, (state, action) => {
      state.loadingStatus = 'succeeded';
      state.draft = action.payload.config;
      state.ifSavedBefore = action.payload.ifSavedBefore;
      state.processingFunctions = action.payload.processingFunctions;
    });
    builder.addCase(initConfigureDevice.rejected, (state, action) => {
      state.loadingStatus = 'failed';
      state.error = action.error.message ?? 'Failed to initialize device config';
    });

    builder.addCase(loadDeviceConfig.pending, (state) => {
      state.loadingStatus = 'loading';
      state.error = null;
    });
    builder.addCase(loadDeviceConfig.fulfilled, (state, action) => {
      state.loadingStatus = 'succeeded';
      state.draft = action.payload;
    });
    builder.addCase(loadDeviceConfig.rejected, (state, action) => {
      state.loadingStatus = 'failed';
      state.error = action.error.message ?? 'Failed to load device config';
    });

    builder.addCase(saveDeviceConfig.pending, (state) => {
      state.sendingStatus = 'saving';
      state.error = null;
    });
    builder.addCase(saveDeviceConfig.fulfilled, (state, action) => {
      state.sendingStatus = 'succeeded';
      state.draft = action.payload;
    });
    builder.addCase(saveDeviceConfig.rejected, (state, action) => {
      state.sendingStatus = 'failed';
      state.error = action.error.message ?? 'Failed to save device config';
    });

    builder.addCase(suggestCustomNames.pending, (state) => {
      state.sendingStatus = 'saving';
      state.error = null;
    });
    builder.addCase(suggestCustomNames.fulfilled, (state, action) => {
      state.sendingStatus = 'idle';
      state.draft = action.payload;
    });
    builder.addCase(suggestCustomNames.rejected, (state, action) => {
      state.sendingStatus = 'failed';
      state.error = action.error.message ?? 'Failed to suggest names';
    });

    builder.addCase(suggestCustomSingleName.pending, (state) => {
      state.sendingStatus = 'saving';
      state.error = null;
    });
    builder.addCase(suggestCustomSingleName.fulfilled, (state, action) => {
      state.sendingStatus = 'idle';
      state.draft = action.payload;
    });
    builder.addCase(suggestCustomSingleName.rejected, (state, action) => {
      state.sendingStatus = 'failed';
      state.error = action.error.message ?? 'Failed to suggest name';
    });
  },
});

export default configSlice.reducer;

export const {
  updateAttributeOption,
  setAttributeRename,
  resetConfig,
  resetSendingStatus,
  setName,
  setAttributesOptionsBasedOnType,
  setProcessingFunction,
  setSuggestionCaseFormat,
} = configSlice.actions;

export const selectConfigDraft = (state: RootState) => state.configureDevice.draft;
export const selectConfigLoadingStatus = (state: RootState) => state.configureDevice.loadingStatus;
export const selectConfigSendingStatus = (state: RootState) => state.configureDevice.sendingStatus;
export const selectConfigError = (state: RootState) => state.configureDevice.error;
export const selectProcessingFunctions = (state: RootState) => state.configureDevice.processingFunctions;
export const selectNameSuggestionCaseFormat = (state: RootState) => state.configureDevice.nameSuggestionCaseFormat;
