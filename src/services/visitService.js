import api from '../lib/api';

class VisitService {
  async list(orderBy = '-created_at', limit = 100) {
    try {
      const response = await api.get('/visits', {
        params: { order: orderBy, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch visits');
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`/visits/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch visit');
    }
  }

  async create(visitData) {
    try {
      const response = await api.post('/visits', visitData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create visit');
    }
  }

  async update(id, visitData) {
    try {
      const response = await api.put(`/visits/${id}`, visitData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update visit');
    }
  }

  async delete(id) {
    try {
      await api.delete(`/visits/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete visit');
    }
  }

  async filter(filters) {
    try {
      const response = await api.get('/visits', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to filter visits');
    }
  }
}

export default new VisitService();