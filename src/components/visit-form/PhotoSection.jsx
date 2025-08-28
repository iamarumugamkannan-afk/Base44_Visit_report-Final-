import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import uploadService from "../../services/uploadService";
import { 
  Camera, 
} from "lucide-react";

const handleFileUpload = async (files) => {
  if (!files.length) return;
  
  setIsUploading(true);
  
  try {
    const { files: uploadedFiles } = await uploadService.uploadMultipleFiles(files);
    const validUrls = uploadedFiles.map(file => file.file_url);
    
    updateFormData({
      visit_photos: [...(formData.visit_photos || []), ...validUrls]
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    alert("Failed to upload some files. Please try again.");
  }
  
  setIsUploading(false);
};