import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deviceService } from '../../services/deviceService';

// Async thunks
export const fetchDevices = createAsyncThunk(
  'devices/fetchDevices',
  async (params, { rejectWithValue }) => {
    try {
      const response = await deviceService.getDevices(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '取得設備列表失敗');
    }
  }
);

export const createDevice = createAsyncThunk(
  'devices/createDevice',
  async (deviceData, { rejectWithValue }) => {
    try {
      const response = await deviceService.createDevice(deviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '建立設備失敗');
    }
  }
);

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await deviceService.updateDevice(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '更新設備失敗');
    }
  }
);

export const deleteDevice = createAsyncThunk(
  'devices/deleteDevice',
  async (id, { rejectWithValue }) => {
    try {
      await deviceService.deleteDevice(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || '刪除設備失敗');
    }
  }
);

const initialState = {
  devices: [],
  currentDevice: null,
  loading: false,
  error: null,
  totalCount: 0,
  filters: {
    search: '',
    customerId: '',
    deviceType: 'all',
    status: 'all',
    page: 1,
    limit: 10,
  },
};

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentDevice: (state, action) => {
      state.currentDevice = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    // 新增：以本地/mock 資料直接設定 devices
    setDevices: (state, action) => {
      state.devices = Array.isArray(action.payload) ? action.payload : [];
      state.totalCount = state.devices.length;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Devices
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload.devices;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Device
      .addCase(createDevice.fulfilled, (state, action) => {
        state.devices.unshift(action.payload);
        state.totalCount += 1;
      })
      // Update Device
      .addCase(updateDevice.fulfilled, (state, action) => {
        const index = state.devices.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.devices[index] = action.payload;
        }
        if (state.currentDevice?.id === action.payload.id) {
          state.currentDevice = action.payload;
        }
      })
      // Delete Device
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.devices = state.devices.filter(d => d.id !== action.payload);
        state.totalCount -= 1;
        if (state.currentDevice?.id === action.payload) {
          state.currentDevice = null;
        }
      });
  },
});

export const { clearError, setCurrentDevice, setFilters, clearFilters, setDevices } = deviceSlice.actions;
export default deviceSlice.reducer;
