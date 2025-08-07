import api from '../api/axios';
import type { PaginationParams } from '../common/type/pagination.interface';
import type { EventFormData } from '../pages/event/types';

const apis = {
  events: '/events',
  pagination: '/events/pagination',
  editable: (id: string) => `/events/${id}/editable/me`,
  release: (id: string) => `/events/${id}/editable/release`,
  maintain: (id: string) => `/events/${id}/editable/maintain`,
};

export const eventService = {
  fetchAll: async () => {
    const res = await api.get(apis.events);
    return res.data;
  },

  fetchById: async (id: string) => {
    const res = await api.get(`${apis.events}/${id}`);
    return res.data;
  },

  create: async (data: EventFormData) => {
    const res = await api.post(apis.events, data);
    return res.data;
  },

  update: async (id: string, data: EventFormData) => {
    const res = await api.put(`${apis.events}/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`${apis.events}/${id}`);
    return res.data;
  },

  requestEdit: async (id: string) => {
    const res = await api.post(`${apis.editable(id)}`);
    return res.data;
  },

  releaseEdit: async (id: string) => {
    const res = await api.post(`${apis.release(id)}`);
    return res.data;
  },

  maintainEdit: async (id: string) => {
    const res = await api.post(`${apis.maintain(id)}`);
    return res.data;
  },

  pagination: async (params: PaginationParams) => {
    const res = await api.get(apis.pagination, { params });
    return res.data;
  },
};
