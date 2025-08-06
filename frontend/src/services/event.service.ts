import api from '../api/axios';

const apis = {
  events: '/events',
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

  create: async (data: any) => {
    const res = await api.post(apis.events, data);
    return res.data;
  },

  update: async (id: string, data: any) => {
    const res = await api.patch(`${apis.events}/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`${apis.events}/${id}`);
    return res.data;
  },
};
