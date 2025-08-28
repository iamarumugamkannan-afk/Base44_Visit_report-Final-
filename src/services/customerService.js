import api from '../lib/api';

class CustomerService {
  async list(orderBy = 'shop_name') {
    try {
      const response = await api.get('/customers', {
        params: { order: orderBy }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch customers');
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch customer');
    }
  }

  async create(customerData) {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create customer');
    }
  }

  async update(id, customerData) {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update customer');
    }
  }

  async delete(id) {
    try {
      await api.delete(`/customers/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete customer');
    }
  }

  async filter(filters) {
    try {
      const response = await api.get('/customers', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to filter customers');
    }
  }
}

export default new CustomerService();