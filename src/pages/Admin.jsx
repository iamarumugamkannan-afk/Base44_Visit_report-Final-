@@ .. @@
 import React, { useState, useEffect } from 'react';
-import { User } from "@/api/entities";
+import userService from "../services/userService";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
@@ .. @@
   const loadUsers = async () => {
     try {
-      const userList = await User.list();
+      const userList = await userService.list();
       setUsers(userList);
@@ .. @@
   const handleUpdateUser = async (userId, updates) => {
     try {
-      await User.update(userId, updates);
+      await userService.update(userId, updates);
       await loadUsers();