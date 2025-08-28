import api from '../lib/api';

class UserService {
  async list() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user');
    }
  }

  async update(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update user');
    }
  }

  async delete(id) {
    try {
      await api.delete(`/users/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete user');
    }
  }

  async updatePermissions(id, permissions) {
    try {
      const response = await api.put(`/users/${id}/permissions`, { permissions });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update permissions');
    }
  }
}

export default new UserService();