@@ .. @@
 import React, { useState, useEffect } from "react";
-import { User } from "@/api/entities";
+import { useAuth } from "../contexts/AuthContext";
 import { motion } from "framer-motion";
@@ .. @@
 export default function Settings() {
-  const [user, setUser] = useState(null);
+  const { user, updateUser } = useAuth();
   const [userData, setUserData] = useState({
@@ .. @@
   useEffect(() => {
-    loadUser();
+    if (user) {
+      setUserData({
+        full_name: user.full_name || "",
+        email: user.email || "",
+        department: user.department || "",
+        territory: user.territory || "",
+        phone: user.phone || ""
+      });
+      setIsLoading(false);
+    }
   }, []);
 
-  const loadUser = async () => {
-    try {
-      const currentUser = await User.me();
-      setUser(currentUser);
-      setUserData({
-        full_name: currentUser.full_name || "",
-        email: currentUser.email || "",
-        department: currentUser.department || "",
-        territory: currentUser.territory || "",
-        phone: currentUser.phone || ""
-      });
-    } catch (error) {
-      setError("Failed to load user data");
-    }
-    setIsLoading(false);
-  };
-
   const handleSave = async () => {
     setIsSaving(true);
     setError(null);
     
     try {
-      await User.updateMyUserData({
+      const result = await updateUser({
         full_name: userData.full_name,
         department: userData.department,
         territory: userData.territory,
         phone: userData.phone
       });
 
-      // Re-fetch the user to get the absolute latest state
-      const updatedUser = await User.me();
-      
-      // Update the local state immediately
-      setUser(updatedUser);
-      setUserData({
-        full_name: updatedUser.full_name || "",
-        email: updatedUser.email || "",
-        department: updatedUser.department || "",
-        territory: updatedUser.territory || "",
-        phone: updatedUser.phone || ""
-      });
-      
-      setSuccess(true);
-      setTimeout(() => setSuccess(false), 3000);
-      
-      // Trigger a global user update event with the new user data in the payload
-      // This is more reliable than forcing other components to re-fetch
-      if (window.parent) {
-        window.parent.postMessage({ type: 'USER_UPDATED', payload: updatedUser }, '*');
+      if (result.success) {
+        setSuccess(true);
+        setTimeout(() => setSuccess(false), 3000);
+      } else {
+        setError(result.error);
       }
-      
     } catch (err) {
       setError("Failed to save settings");
     }