import api from './api';

// 模擬盤點資料
let mockInventories = [
  {
    id: 1,
    name: '2024年Q1設備盤點',
    type: 'quarterly',
    customerId: 1,
    customerName: '群兆科技股份有限公司',
    status: 'completed',
    startDate: '2024-01-01',
    endDate: '2024-01-15',
    totalDevices: 25,
    checkedDevices: 25,
    normalDevices: 23,
    abnormalDevices: 2,
    missingDevices: 0,
    executor: '張工程師',
    notes: 'Q1季度例行盤點，發現2台設備需要維護',
    createdAt: '2024-01-01',
    completedAt: '2024-01-15',
  },
  {
    id: 2,
    name: '2024年Q2設備盤點',
    type: 'quarterly',
    customerId: 1,
    customerName: '群兆科技股份有限公司',
    status: 'in_progress',
    startDate: '2024-04-01',
    endDate: '2024-04-15',
    totalDevices: 28,
    checkedDevices: 15,
    normalDevices: 14,
    abnormalDevices: 1,
    missingDevices: 0,
    executor: '李工程師',
    notes: 'Q2季度盤點進行中',
    createdAt: '2024-04-01',
    completedAt: null,
  },
  {
    id: 3,
    name: '創新軟體設備盤點',
    type: 'monthly',
    customerId: 2,
    customerName: '創新軟體有限公司',
    status: 'scheduled',
    startDate: '2024-05-01',
    endDate: '2024-05-05',
    totalDevices: 15,
    checkedDevices: 0,
    normalDevices: 0,
    abnormalDevices: 0,
    missingDevices: 0,
    executor: '王工程師',
    notes: '月度例行盤點',
    createdAt: '2024-04-25',
    completedAt: null,
  },
  {
    id: 4,
    name: '雲端服務授權盤點',
    type: 'annual',
    customerId: 1,
    customerName: '群兆科技股份有限公司',
    status: 'scheduled',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    totalDevices: 12,
    checkedDevices: 0,
    normalDevices: 0,
    abnormalDevices: 0,
    missingDevices: 0,
    executor: '陳工程師',
    notes: '年度雲端服務授權盤點',
    createdAt: '2024-11-15',
    completedAt: null,
  },
];

// 模擬盤點週期設定
let mockInventoryCycles = [
  {
    id: 1,
    customerId: 1,
    customerName: '群兆科技股份有限公司',
    deviceType: 'all',
    cycleType: 'quarterly',
    cycleDays: 90,
    reminderDays: 7,
    isActive: true,
    lastInventoryDate: '2024-01-15',
    nextInventoryDate: '2024-04-15',
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    customerId: 1,
    customerName: '群兆科技股份有限公司',
    deviceType: 'cloud_service',
    cycleType: 'annual',
    cycleDays: 365,
    reminderDays: 30,
    isActive: true,
    lastInventoryDate: '2023-12-01',
    nextInventoryDate: '2024-12-01',
    createdAt: '2024-01-01',
  },
  {
    id: 3,
    customerId: 2,
    customerName: '創新軟體有限公司',
    deviceType: 'all',
    cycleType: 'monthly',
    cycleDays: 30,
    reminderDays: 3,
    isActive: true,
    lastInventoryDate: '2024-04-01',
    nextInventoryDate: '2024-05-01',
    createdAt: '2024-01-01',
  },
];

// 模擬客戶資料
const mockCustomers = [
  { id: 1, name: '群兆科技股份有限公司' },
  { id: 2, name: '創新軟體有限公司' },
  { id: 3, name: '未來科技公司' },
];

class InventoryService {
  // 獲取盤點列表
  async getInventories(params = {}) {
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredInventories = [...mockInventories];
    
    // 搜尋篩選
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredInventories = filteredInventories.filter(inventory =>
        inventory.name.toLowerCase().includes(searchLower) ||
        inventory.customerName.toLowerCase().includes(searchLower) ||
        inventory.executor.toLowerCase().includes(searchLower)
      );
    }
    
    // 狀態篩選
    if (params.status && params.status !== 'all') {
      filteredInventories = filteredInventories.filter(inventory =>
        inventory.status === params.status
      );
    }
    
    // 客戶篩選
    if (params.customerId && params.customerId !== 'all') {
      filteredInventories = filteredInventories.filter(inventory =>
        inventory.customerId === parseInt(params.customerId)
      );
    }
    
    // 類型篩選
    if (params.type && params.type !== 'all') {
      filteredInventories = filteredInventories.filter(inventory =>
        inventory.type === params.type
      );
    }
    
    // 分頁
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedInventories = filteredInventories.slice(startIndex, endIndex);
    
    return {
      data: paginatedInventories,
      pagination: {
        total: filteredInventories.length,
        page,
        limit,
        totalPages: Math.ceil(filteredInventories.length / limit),
      },
    };
  }

  // 建立盤點
  async createInventory(inventoryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 獲取客戶名稱
    const customer = mockCustomers.find(c => c.id === parseInt(inventoryData.customerId));
    const customerName = customer ? customer.name : '';
    
    // 模擬設備數量
    const totalDevices = Math.floor(Math.random() * 50) + 10;
    
    const newInventory = {
      id: Math.max(...mockInventories.map(i => i.id), 0) + 1,
      ...inventoryData,
      customerId: parseInt(inventoryData.customerId),
      customerName: customerName,
      totalDevices: totalDevices,
      status: 'scheduled',
      checkedDevices: 0,
      normalDevices: 0,
      abnormalDevices: 0,
      missingDevices: 0,
      createdAt: new Date().toISOString().split('T')[0],
      completedAt: null,
    };
    
    // 驗證必填欄位
    if (!newInventory.name || !newInventory.customerId || !newInventory.startDate || !newInventory.endDate) {
      const error = new Error('請填寫所有必填欄位');
      error.response = { data: { message: '請填寫所有必填欄位' } };
      throw error;
    }
    
    // 使用展開運算符創建新陣列，避免修改被凍結的陣列
    mockInventories = [newInventory, ...mockInventories];
    return newInventory;
  }

  // 更新盤點
  async updateInventory(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockInventories.findIndex(inventory => inventory.id === id);
    if (index === -1) {
      const error = new Error('盤點不存在');
      error.response = { data: { message: '盤點不存在' } };
      throw error;
    }
    
    // 如果更新了客戶ID，需要更新客戶名稱
    let updatedData = { ...data };
    if (data.customerId) {
      const customer = mockCustomers.find(c => c.id === parseInt(data.customerId));
      updatedData.customerId = parseInt(data.customerId);
      updatedData.customerName = customer ? customer.name : '';
    }
    
    mockInventories[index] = { ...mockInventories[index], ...updatedData };
    return mockInventories[index];
  }

  // 刪除盤點
  async deleteInventory(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockInventories.findIndex(inventory => inventory.id === id);
    if (index === -1) {
      const error = new Error('盤點不存在');
      error.response = { data: { message: '盤點不存在' } };
      throw error;
    }
    
    // 使用展開運算符創建新陣列，避免修改被凍結的陣列
    mockInventories = mockInventories.filter(inventory => inventory.id !== id);
    return { success: true };
  }

  // 執行盤點
  async executeInventory(id) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const index = mockInventories.findIndex(inventory => inventory.id === id);
    if (index === -1) {
      const error = new Error('盤點不存在');
      error.response = { data: { message: '盤點不存在' } };
      throw error;
    }
    
    const inventory = mockInventories[index];
    const updatedInventory = {
      ...inventory,
      status: 'completed',
      checkedDevices: inventory.totalDevices,
      normalDevices: Math.floor(inventory.totalDevices * 0.9),
      abnormalDevices: Math.floor(inventory.totalDevices * 0.08),
      missingDevices: Math.floor(inventory.totalDevices * 0.02),
      completedAt: new Date().toISOString().split('T')[0],
    };
    
    mockInventories[index] = updatedInventory;
    return updatedInventory;
  }

  // 獲取盤點週期設定
  async getInventoryCycles() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInventoryCycles;
  }

  // 建立盤點週期設定
  async createInventoryCycle(cycleData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('createInventoryCycle 接收到的資料:', cycleData);
    
    try {
      // 驗證必填欄位
      if (!cycleData.customerId || !cycleData.deviceType || !cycleData.cycleType || !cycleData.cycleDays || !cycleData.reminderDays) {
        console.log('驗證失敗，缺少必填欄位:', {
          customerId: cycleData.customerId,
          deviceType: cycleData.deviceType,
          cycleType: cycleData.cycleType,
          cycleDays: cycleData.cycleDays,
          reminderDays: cycleData.reminderDays
        });
        const error = new Error('請填寫所有必填欄位');
        error.response = { data: { message: '請填寫所有必填欄位' } };
        throw error;
      }
      
      // 獲取客戶名稱
      const customer = mockCustomers.find(c => c.id === parseInt(cycleData.customerId));
      const customerName = customer ? customer.name : '';
      
      // 確保數值欄位正確轉換
      const cycleDays = parseInt(cycleData.cycleDays) || 30;
      const reminderDays = parseInt(cycleData.reminderDays) || 7;
      
      // 計算下次盤點日期
      const today = new Date();
      const nextInventoryDate = new Date(today);
      nextInventoryDate.setDate(today.getDate() + cycleDays);
      
      const newCycle = {
        id: Math.max(...mockInventoryCycles.map(c => c.id), 0) + 1,
        ...cycleData,
        customerId: parseInt(cycleData.customerId),
        customerName: customerName,
        cycleDays: cycleDays,
        reminderDays: reminderDays,
        lastInventoryDate: today.toISOString().split('T')[0],
        nextInventoryDate: nextInventoryDate.toISOString().split('T')[0],
        createdAt: today.toISOString().split('T')[0],
      };
      
      console.log('創建的新週期設定:', newCycle);
      
      // 使用展開運算符創建新陣列，避免修改被凍結的陣列
      mockInventoryCycles = [...mockInventoryCycles, newCycle];
      return newCycle;
    } catch (error) {
      console.error('createInventoryCycle 發生錯誤:', error);
      // 確保錯誤有正確的結構
      if (!error.response) {
        error.response = { data: { message: error.message || '建立盤點週期失敗' } };
      }
      throw error;
    }
  }

  // 更新盤點週期設定
  async updateInventoryCycle(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockInventoryCycles.findIndex(cycle => cycle.id === id);
    if (index === -1) {
      const error = new Error('盤點週期設定不存在');
      error.response = { data: { message: '盤點週期設定不存在' } };
      throw error;
    }
    
    // 如果更新了客戶ID，需要更新客戶名稱
    let updatedData = { ...data };
    if (data.customerId) {
      const customer = mockCustomers.find(c => c.id === parseInt(data.customerId));
      updatedData.customerId = parseInt(data.customerId);
      updatedData.customerName = customer ? customer.name : '';
    }
    
    // 確保數值欄位正確轉換
    if (data.cycleDays) {
      updatedData.cycleDays = parseInt(data.cycleDays);
    }
    if (data.reminderDays) {
      updatedData.reminderDays = parseInt(data.reminderDays);
    }
    
    // 更新週期設定
    mockInventoryCycles[index] = { 
      ...mockInventoryCycles[index], 
      ...updatedData 
    };
    
    return mockInventoryCycles[index];
  }

  // 刪除盤點週期設定
  async deleteInventoryCycle(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockInventoryCycles.findIndex(cycle => cycle.id === id);
    if (index === -1) {
      const error = new Error('盤點週期設定不存在');
      error.response = { data: { message: '盤點週期設定不存在' } };
      throw error;
    }
    
    // 使用展開運算符創建新陣列，避免修改被凍結的陣列
    mockInventoryCycles = mockInventoryCycles.filter(cycle => cycle.id !== id);
    return { success: true };
  }

  // 獲取客戶列表（用於下拉選單）
  async getCustomers() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockCustomers;
  }

  // 獲取設備統計（用於盤點預覽）
  async getDeviceStats(customerId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 模擬設備統計資料
    return {
      totalDevices: Math.floor(Math.random() * 50) + 10,
      byType: {
        server: Math.floor(Math.random() * 5) + 1,
        storage: Math.floor(Math.random() * 3) + 1,
        network: Math.floor(Math.random() * 5) + 1,
        computer: Math.floor(Math.random() * 20) + 5,
        printer: Math.floor(Math.random() * 3) + 1,
        cloud_service: Math.floor(Math.random() * 10) + 2,
        software: Math.floor(Math.random() * 8) + 1,
      },
    };
  }
}

export default new InventoryService();
