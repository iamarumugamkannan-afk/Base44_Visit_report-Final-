import api from '../lib/api';

class ConfigurationService {
  async list(orderBy = 'display_order') {
    try {
      const response = await api.get('/configurations', {
        params: { order: orderBy }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch configurations');
    }
  }

  async getByType(type) {
    try {
      const response = await api.get('/configurations', {
        params: { type }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch configurations');
    }
  }

  async create(configData) {
    try {
      const response = await api.post('/configurations', configData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create configuration');
    }
  }

  async update(id, configData) {
    try {
      const response = await api.put(`/configurations/${id}`, configData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update configuration');
    }
  }

  async delete(id) {
    try {
      await api.delete(`/configurations/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete configuration');
    }
  }
}

export default new ConfigurationService();