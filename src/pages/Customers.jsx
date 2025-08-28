@@ .. @@
 import React, { useState, useEffect } from "react";
-import { Customer } from "@/api/entities";
-import { User } from "@/api/entities";
+import customerService from "../services/customerService";
 import { motion } from "framer-motion";
@@ .. @@
   const loadCustomers = async () => {
     try {
-      const data = await Customer.list("-created_date");
+      const data = await customerService.list("-created_date");
       setCustomers(data);
@@ .. @@
   const handleSave = async () => {
     try {
       if (editingCustomer) {
-        await Customer.update(editingCustomer.id, customerData);
+        await customerService.update(editingCustomer.id, customerData);
         setSuccess("Customer updated successfully");
       } else {
-        await Customer.create(customerData);
+        await customerService.create(customerData);
         setSuccess("Customer created successfully");
@@ .. @@
   const handleDelete = async (customerId) => {
     if (window.confirm("Are you sure you want to delete this customer?")) {
       try {
-        await Customer.delete(customerId);
+        await customerService.delete(customerId);
         setSuccess("Customer deleted successfully");