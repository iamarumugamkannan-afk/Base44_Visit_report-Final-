@@ .. @@
 import React, { useState, useEffect } from "react";
-import { ShopVisit } from "@/api/entities";
-import { User } from "@/api/entities";
+import visitService from "../services/visitService";
 import { motion } from "framer-motion";
@@ .. @@
   const loadVisits = async () => {
     try {
-      const data = await ShopVisit.list("-created_date", 200);
+      const data = await visitService.list("-created_date", 200);
       setVisits(data);