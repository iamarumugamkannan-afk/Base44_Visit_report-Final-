@@ .. @@
 import { Building2, User, Phone, Mail, Briefcase, Info } from "lucide-react";
 import { Button } from "@/components/ui/button";
-import { Customer } from "@/api/entities";
-import { Configuration } from "@/api/entities";
+import customerService from "../../services/customerService";
+import configurationService from "../../services/configurationService";
 import { Badge } from "@/components/ui/badge";
@@ .. @@
   const loadData = async () => {
     setIsLoading(true);
     try {
-      const [customersData, configsData] = await Promise.all([
-        Customer.list(),
-        Configuration.list()
-      ]);
+      const customersData = await customerService.list();
+      const configsData = await configurationService.list();
       
       const activeCustomers = customersData.filter(c => c.status === 'active');