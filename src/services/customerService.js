import api from './api';

export const customerService = {
  // 取得客戶列表
  getCustomers: async (params = {}) => {
    return api.get('/customers', { params });
  },

  // 取得單一客戶
  getCustomer: async (id) => {
    return api.get(`/customers/${id}`);
  },

  // 建立客戶
  createCustomer: async (data) => {
    return api.post('/customers', data);
  },

  // 更新客戶
  updateCustomer: async (id, data) => {
    return api.put(`/customers/${id}`, data);
  },

  // 刪除客戶
  deleteCustomer: async (id) => {
    return api.delete(`/customers/${id}`);
  },
};
