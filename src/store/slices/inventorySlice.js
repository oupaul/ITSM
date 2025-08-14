import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryService from '../../services/inventoryService';

// 非同步 action
export const fetchInventories = createAsyncThunk(
  'inventory/fetchInventories',
  async (params, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getInventories(params);
      return response; // getInventories 返回 { data, pagination } 結構
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '獲取盤點資料失敗');
    }
  }
);

export const createInventory = createAsyncThunk(
  'inventory/createInventory',
  async (inventoryData, { rejectWithValue }) => {
    try {
      const response = await inventoryService.createInventory(inventoryData);
      return response; // 直接返回 response，因為 service 直接返回資料
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '建立盤點失敗');
    }
  }
);

export const updateInventory = createAsyncThunk(
  'inventory/updateInventory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await inventoryService.updateInventory(id, data);
      return response; // 直接返回 response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '更新盤點失敗');
    }
  }
);

export const deleteInventory = createAsyncThunk(
  'inventory/deleteInventory',
  async (id, { rejectWithValue }) => {
    try {
      await inventoryService.deleteInventory(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '刪除盤點失敗');
    }
  }
);

export const executeInventory = createAsyncThunk(
  'inventory/executeInventory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await inventoryService.executeInventory(id);
      return response; // 直接返回 response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '執行盤點失敗');
    }
  }
);

export const fetchInventoryCycles = createAsyncThunk(
  'inventory/fetchInventoryCycles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getInventoryCycles();
      return response; // 直接返回 response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '獲取盤點週期失敗');
    }
  }
);

export const updateInventoryCycle = createAsyncThunk(
  'inventory/updateInventoryCycle',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await inventoryService.updateInventoryCycle(id, data);
      return response; // 直接返回 response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '更新盤點週期失敗');
    }
  }
);

export const createInventoryCycle = createAsyncThunk(
  'inventory/createInventoryCycle',
  async (cycleData, { rejectWithValue }) => {
    try {
      console.log('Redux createInventoryCycle 接收到的資料:', cycleData);
      const response = await inventoryService.createInventoryCycle(cycleData);
      console.log('Redux createInventoryCycle 成功返回:', response);
      return response; // 直接返回 response
    } catch (error) {
      console.error('Redux createInventoryCycle 發生錯誤:', error);
      console.error('錯誤結構:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      return rejectWithValue(error.response?.data?.message || '建立盤點週期失敗');
    }
  }
);

export const deleteInventoryCycle = createAsyncThunk(
  'inventory/deleteInventoryCycle',
  async (id, { rejectWithValue }) => {
    try {
      await inventoryService.deleteInventoryCycle(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '刪除盤點週期失敗');
    }
  }
);

const initialState = {
  inventories: [],
  inventoryCycles: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    customerId: 'all',
    type: 'all',
    page: 1,
    limit: 10,
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        status: 'all',
        customerId: 'all',
        type: 'all',
        page: 1,
        limit: 10,
      };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchInventories
      .addCase(fetchInventories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventories.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          total: 0,
          page: 1,
          limit: 10,
        };
      })
      .addCase(fetchInventories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createInventory
      .addCase(createInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories.unshift(action.payload);
      })
      .addCase(createInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateInventory
      .addCase(updateInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.inventories.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.inventories[index] = action.payload;
        }
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteInventory
      .addCase(deleteInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = state.inventories.filter(inv => inv.id !== action.payload);
      })
      .addCase(deleteInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // executeInventory
      .addCase(executeInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeInventory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.inventories.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.inventories[index] = action.payload;
        }
      })
      .addCase(executeInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchInventoryCycles
      .addCase(fetchInventoryCycles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryCycles.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryCycles = action.payload;
      })
      .addCase(fetchInventoryCycles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateInventoryCycle
      .addCase(updateInventoryCycle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventoryCycle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.inventoryCycles.findIndex(cycle => cycle.id === action.payload.id);
        if (index !== -1) {
          state.inventoryCycles[index] = action.payload;
        }
      })
      .addCase(updateInventoryCycle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createInventoryCycle
      .addCase(createInventoryCycle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInventoryCycle.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryCycles.push(action.payload);
      })
      .addCase(createInventoryCycle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteInventoryCycle
      .addCase(deleteInventoryCycle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInventoryCycle.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryCycles = state.inventoryCycles.filter(cycle => cycle.id !== action.payload);
      })
      .addCase(deleteInventoryCycle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters, setPage, clearError } = inventorySlice.actions;
export default inventorySlice.reducer;
