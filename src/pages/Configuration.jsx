@@ .. @@
 import React, { useState, useEffect } from "react";
-import { Configuration as ConfigEntity } from "@/api/entities";
+import configurationService from "../services/configurationService";
 import { motion } from "framer-motion";
@@ .. @@
   const loadConfigurations = async () => {
     try {
-      const data = await ConfigEntity.list("display_order");
+      const data = await configurationService.list("display_order");
       setConfigs(data);
@@ .. @@
   const handleSave = async () => {
     try {
       if (editingConfig) {
-        await ConfigEntity.update(editingConfig.id, configData);
+        await configurationService.update(editingConfig.id, configData);
         setSuccess("Configuration updated successfully");
       } else {
@@ .. @@
-        await ConfigEntity.create({
+        await configurationService.create({
           ...configData,
@@ .. @@
   const handleDelete = async (configId) => {
     if (window.confirm("Are you sure you want to delete this configuration item?")) {
       try {
-        await ConfigEntity.delete(configId);
+        await configurationService.delete(configId);
         setSuccess("Configuration deleted successfully");
@@ .. @@
   const toggleActive = async (config) => {
     try {
-      await ConfigEntity.update(config.id, { ...config, is_active: !config.is_active });
+      await configurationService.update(config.id, { ...config, is_active: !config.is_active });
       loadConfigurations();