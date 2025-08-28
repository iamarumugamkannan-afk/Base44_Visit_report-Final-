@@ .. @@
 import React, { useState, useEffect, useRef } from "react";
-import { ShopVisit } from "@/api/entities";
-import { User } from "@/api/entities";
-import { Customer } from "@/api/entities";
-import { UploadFile, InvokeLLM } from "@/api/integrations";
+import visitService from "../services/visitService";
+import customerService from "../services/customerService";
+import uploadService from "../services/uploadService";
+import { useAuth } from "../contexts/AuthContext";
 import { useNavigate, useLocation } from "react-router-dom";
@@ .. @@
 export default function NewVisit() {
   const navigate = useNavigate();
   const location = useLocation();
 }
+  const { user } = useAuth();
   const [visitId, setVisitId] = useState(null);
@@ .. @@
   const [success, setSuccess] = useState(false);
   const [showPreSubmitChecklist, setShowPreSubmitChecklist] = useState(false);
-  const [user, setUser] = useState(null);
   const [isDraftSaving, setIsDraftSaving] = useState(false);
@@ .. @@
     const loadInitialData = async () => {
       setIsLoading(true);
       try {
       }
     }
-        const currentUser = await User.me();
-        setUser(currentUser);
-
         if (id) {
           setVisitId(id);
           setIsDraftCreated(true); // Already has an ID
           await loadVisitData(id);
         } else if (customerId) { // If a customer_id is provided, pre-fill form
         }
-          const customers = await Customer.filter({ id: customerId });
+          const customers = await customerService.filter({ id: customerId });
           const customer = customers.length > 0 ? customers[0] : null;