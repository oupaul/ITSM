import api from './api';

export const deviceService = {
  // 取得設備列表
  getDevices: async (params = {}) => {
    return api.get('/devices', { params });
  },

  // 取得單一設備
  getDevice: async (id) => {
    return api.get(`/devices/${id}`);
  },

  // 建立設備
  createDevice: async (data) => {
    return api.post('/devices', data);
  },

  // 更新設備
  updateDevice: async (id, data) => {
    return api.put(`/devices/${id}`, data);
  },

  // 刪除設備
  deleteDevice: async (id) => {
    return api.delete(`/devices/${id}`);
  },
};
