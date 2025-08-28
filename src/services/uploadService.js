import api from '../lib/api';

class UploadService {
  async uploadFile(file, onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        };
      }

      const response = await api.post('/uploads/single', formData, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to upload file');
    }
  }

  async uploadMultipleFiles(files, onProgress = null) {
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        };
      }

      const response = await api.post('/uploads/multiple', formData, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to upload files');
    }
  }

  async deleteFile(fileId) {
    try {
      await api.delete(`/uploads/${fileId}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete file');
    }
  }

  getFileUrl(filename) {
    return `${import.meta.env.VITE_API_BASE_URL}/uploads/files/${filename}`;
  }
}

export default new UploadService();