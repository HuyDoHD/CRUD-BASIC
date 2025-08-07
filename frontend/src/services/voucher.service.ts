import api from '../api/axios';
import type { PaginationParams } from '../common/type/pagination.interface';

const apis = {
  vouchers: '/vouchers',
  pagination: '/vouchers/pagination',
};  

export const voucherService = {
  fetchAll: async () => {
    const res = await api.get(apis.vouchers);
    return res.data;
  },

  fetchById: async (id: string) => {
    const res = await api.get(`${apis.vouchers}/${id}`);
    return res.data;
  },

  create: async (data: any) => {
    const res = await api.post(apis.vouchers, data);
    return res.data;
  },

  update: async (id: string, data: any) => {
    const res = await api.patch(`${apis.vouchers}/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`${apis.vouchers}/${id}`);
    return res.data;
  },

  issueVoucher: async (eventId: string) => {
    const res = await api.post(`${apis.vouchers}/issue/${eventId}`);
    return res.data;
  },

  pagination: async (params: PaginationParams) => {
    const res = await api.get(apis.pagination, { params });
    return res.data;
  },
};
