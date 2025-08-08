import api from '../api/axios';
import type { PaginationParams } from '../common/type/pagination.interface';

const apis = {
  pagination: '/audit/pagination',
};

export const auditLogService = {
  pagination: async (params: PaginationParams) => {
    const res = await api.get(apis.pagination, { params });
    return res.data;
  },
};
