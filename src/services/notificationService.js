import api from './api';

export const notificationService = {
  // 取得通知列表
  getNotifications: async (params = {}) => {
    return api.get('/notifications', { params });
  },

  // 標記為已讀
  markAsRead: async (id) => {
    return api.put(`/notifications/${id}/read`);
  },

  // 標記全部為已讀
  markAllAsRead: async () => {
    return api.put('/notifications/read-all');
  },

  // 刪除通知
  deleteNotification: async (id) => {
    return api.delete(`/notifications/${id}`);
  },
};
