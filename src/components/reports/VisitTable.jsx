@@ .. @@
 import { Checkbox } from "@/components/ui/checkbox";
 import { Link } from "react-router-dom";
 import { createPageUrl } from "@/utils";
-import { ShopVisit } from "@/api/entities";
+import visitService from "../../services/visitService";
 
 const getShopTypeColor = (type) => {
@@ .. @@
   const handleDelete = async (visitId) => {
     if (window.confirm("Are you sure you want to delete this visit report? This action cannot be undone.")) {
       try {
-        await ShopVisit.delete(visitId);
+        await visitService.delete(visitId);
         if (onRefresh) onRefresh();
       } catch (error) {
@@ .. @@
     if (window.confirm(`Are you sure you want to delete ${selectedVisits.length} visit report(s)? This action cannot be undone.`)) {
       try {
-        await Promise.all(selectedVisits.map(id => ShopVisit.delete(id)));
+        await Promise.all(selectedVisits.map(id => visitService.delete(id)));
         onSelectionChange([]);