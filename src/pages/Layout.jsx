@@ .. @@
 import React, { useState, useEffect } from "react";
 import { Link, useLocation } from "react-router-dom";
+import { useAuth } from "../contexts/AuthContext";
 import { createPageUrl } from "@/utils";
@@ .. @@
 import {
   DropdownMenu,
@@ .. @@
 } from "@/components/ui/dropdown-menu";
-import { User as UserEntity } from "@/api/entities";
 
 const navigationItems = [
@@ .. @@
 export default function Layout({ children, currentPageName }) {
   const location = useLocation();
-  const [user, setUser] = React.useState(null);
-  const [isLoading, setIsLoading] = React.useState(true);
+  const { user, logout } = useAuth();
   const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
     return localStorage.getItem('sidebarCollapsed') === 'true';
   });
   const isAdmin = user?.role === 'admin';

-  React.useEffect(() => {
-    loadUser();
-    
-    // Listen for the global user update event
-    const handleUserUpdate = (event) => {
-      // Check for the correct message type and ensure there's a payload
-      if (event.data?.type === 'USER_UPDATED' && event.data.payload) {
-        // Update state directly from the message payload to avoid re-fetching
-        setUser(event.data.payload);
-      }
-    };
-
-    window.addEventListener('message', handleUserUpdate);
-
-    return () => {
-      window.removeEventListener('message', handleUserUpdate);
-    };
-  }, []);
-
   useEffect(() => {
     localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
   }, [sidebarCollapsed]);

-  const loadUser = async () => {
-    try {
-      const currentUser = await UserEntity.me();
-      setUser(currentUser);
-    } catch (error) {
-      console.log("User not authenticated");
-    }
-    setIsLoading(false);
-  };
-
   const handleLogout = async () => {
-    try {
-      await UserEntity.logout();
-      window.location.reload();
-    } catch (error) {
-      console.error("Logout error:", error);
-    }
+    await logout();
   };

-  if (isLoading) {
-    return (
-      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
-        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
-      </div>
-    );
-  }
-
   return (