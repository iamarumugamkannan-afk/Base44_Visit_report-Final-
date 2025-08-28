@@ .. @@
 import React, { useState, useEffect } from "react";
-import { ShopVisit } from "@/api/entities";
-import { User } from "@/api/entities";
+import visitService from "../services/visitService";
+import { useAuth } from "../contexts/AuthContext";
 import { Link } from "react-router-dom";
 import { createPageUrl } from "@/utils";
@@ .. @@
 export default function Dashboard() {
   const [visits, setVisits] = useState([]);
-  const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
+  const { user } = useAuth();
 
   useEffect(() => {
     loadData();
-    
-    // Listen for the global user update event
-    const handleUserUpdate = (event) => {
-      // Check for the correct message type and ensure there's a payload
-      if (event.data?.type === 'USER_UPDATED' && event.data.payload) {
-        // Update the user state directly from the message payload
-        setUser(event.data.payload);
-      }
-    };
-    
-    window.addEventListener('message', handleUserUpdate);
-    return () => window.removeEventListener('message', handleUserUpdate);
   }, []);
 
   const loadData = async () => {
     try {
-      const [visitsData, userData] = await Promise.all([
-        ShopVisit.list("-created_date", 100),
-        User.me()
-      ]);
+      const visitsData = await visitService.list("-created_date", 100);
       setVisits(visitsData);
-      setUser(userData);
     } catch (error) {
       console.error("Error loading dashboard data:", error);
     }