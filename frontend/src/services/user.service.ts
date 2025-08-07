import api from '../api/axios';
import type { UserFormData } from '../pages/user-management/type';
import type { PaginationParams } from '../common/type/pagination.interface';

const apis = {
  users: '/users',
  pagination: '/users/pagination',
};

export const userService = {
  fetchAll: async () => {
    const res = await api.get(apis.users);
    return res.data;
  },

  fetchById: async (id: string) => {
    const res = await api.get(`${apis.users}/${id}`);
    return res.data;
  },

  create: async (data: UserFormData) => {
    const res = await api.post(apis.users, data);
    return res.data;
  },

  update: async (id: string, data: UserFormData) => {
    const res = await api.put(`${apis.users}/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`${apis.users}/${id}`);
    return res.data;
  },

  pagination: async (params: PaginationParams) => {
    const res = await api.get(apis.pagination, { params });
    return res.data;
  },
};
