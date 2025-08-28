import React, { useState, useEffect } from "react";
import configurationService from "../services/configurationService";
import { motion } from "framer-motion";

export default function ConfigurationManager() {
  const [configs, setConfigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [configData, setConfigData] = useState({
    key: "",
    value: "",
    description: "",
    category: "",
    is_active: true,
    display_order: 0
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      const data = await configurationService.list("display_order");
      setConfigs(data);
    } catch (err) {
      setError("Failed to load configurations");
    }
  };

  const handleSave = async () => {
    try {
      if (editingConfig) {
        await configurationService.update(editingConfig.id, configData);
        setSuccess("Configuration updated successfully");
      } else {
        await configurationService.create({
          ...configData,
          display_order: configs.length
        });
        setSuccess("Configuration created successfully");
      }
      loadConfigurations();
      resetForm();
    } catch (err) {
      setError("Failed to save configuration");
    }
  };

  const handleDelete = async (configId) => {
    if (window.confirm("Are you sure you want to delete this configuration item?")) {
      try {
        await configurationService.delete(configId);
        setSuccess("Configuration deleted successfully");
        loadConfigurations();
      } catch (err) {
        setError("Failed to delete configuration");
      }
    }
  };

  const toggleActive = async (config) => {
    try {
      await configurationService.update(config.id, { ...config, is_active: !config.is_active });
      loadConfigurations();
    } catch (err) {
      setError("Failed to update configuration status");
    }
  };

  const resetForm = () => {
    setConfigData({
      key: "",
      value: "",
      description: "",
      category: "",
      is_active: true,
      display_order: 0
    });
    setEditingConfig(null);
    setShowForm(false);
    setError("");
    setSuccess("");
  };

  const handleEdit = (config) => {
    setConfigData(config);
    setEditingConfig(config);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configuration Manager</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Configuration
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingConfig ? "Edit Configuration" : "Add Configuration"}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Key</label>
              <input
                type="text"
                value={configData.key}
                onChange={(e) => setConfigData({...configData, key: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Value</label>
              <input
                type="text"
                value={configData.value}
                onChange={(e) => setConfigData({...configData, value: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                value={configData.category}
                onChange={(e) => setConfigData({...configData, category: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Display Order</label>
              <input
                type="number"
                value={configData.display_order}
                onChange={(e) => setConfigData({...configData, display_order: parseInt(e.target.value)})}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={configData.description}
              onChange={(e) => setConfigData({...configData, description: e.target.value})}
              className="w-full border rounded px-3 py-2"
              rows="3"
            />
          </div>
          
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={configData.is_active}
                onChange={(e) => setConfigData({...configData, is_active: e.target.checked})}
                className="mr-2"
              />
              Active
            </label>
          </div>
          
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {configs.map((config) => (
              <tr key={config.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {config.key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {config.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {config.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      config.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {config.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(config)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(config)}
                    className="text-yellow-600 hover:text-yellow-900 mr-4"
                  >
                    {config.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(config.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}