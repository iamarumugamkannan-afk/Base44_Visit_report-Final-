@@ .. @@
 import { Button } from "@/components/ui/button";
 import { Eye, Plus, X, Package, TrendingUp, Building2 } from "lucide-react";
-import { Configuration } from "@/api/entities";
+import configurationService from "../../services/configurationService";
 
 import SalesPurchaseBreakdown from "./SalesPurchaseBreakdown";
@@ .. @@
   const loadConfigurations = async () => {
     try {
     }
   }
-      const configs = await Configuration.list();
+      const configs = await configurationService.list();
       const products = configs.filter(c => c.config_type === 'canna_products' && c.is_active)