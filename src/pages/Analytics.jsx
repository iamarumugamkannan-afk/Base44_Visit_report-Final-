@@ .. @@
 import React, { useState, useEffect } from 'react';
-import { ShopVisit } from '@/api/entities';
-import { Customer } from '@/api/entities';
-import { User } from '@/api/entities';
+import visitService from '../services/visitService';
+import customerService from '../services/customerService';
+import userService from '../services/userService';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
@@ .. @@
       try {
-        const [visitData, customerData, userData] = await Promise.all([
-          ShopVisit.list('-created_date', 500),
-          Customer.list(),
-          User.list()
-        ]);
+        const visitData = await visitService.list('-created_date', 500);
+        const customerData = await customerService.list();
+        const userData = await userService.list();
         setVisits(visitData);