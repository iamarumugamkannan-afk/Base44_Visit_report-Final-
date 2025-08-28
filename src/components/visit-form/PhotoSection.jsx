@@ .. @@
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
-import { UploadFile } from "@/api/integrations";
+import uploadService from "../../services/uploadService";
 import { 
   Camera, 
@@ .. @@
   const handleFileUpload = async (files) => {
     if (!files.length) return;
     
     setIsUploading(true);
-    const uploadPromises = Array.from(files).map(async (file) => {
-      try {
-        const { file_url } = await UploadFile({ file });
-        return file_url;
-      } catch (error) {
-        console.error("Error uploading file:", error);
-        return null;
-      }
-    });
-
-    const uploadedUrls = await Promise.all(uploadPromises);
-    const validUrls = uploadedUrls.filter(url => url !== null);
+    
+    try {
+      const { files: uploadedFiles } = await uploadService.uploadMultipleFiles(files);
+      const validUrls = uploadedFiles.map(file => file.file_url);
+      
+      updateFormData({
+        visit_photos: [...(formData.visit_photos || []), ...validUrls]
+      });
+    } catch (error) {
+      console.error("Error uploading files:", error);
+      alert("Failed to upload some files. Please try again.");
+    }
     
-    updateFormData({
-      visit_photos: [...(formData.visit_photos || []), ...validUrls]
-    });
-    
     setIsUploading(false);
   };