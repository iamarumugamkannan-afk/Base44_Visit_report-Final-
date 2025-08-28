// Import actual service implementations
import uploadService from '../services/uploadService.js';

// Export available integrations
export const Core = {
  UploadFile: uploadService,
  // Placeholder integrations - not implemented in standalone version
  InvokeLLM: undefined,
  SendEmail: undefined,
  GenerateImage: undefined,
  ExtractDataFromUploadedFile: undefined
};

// Individual exports for backward compatibility
export const InvokeLLM = undefined;
export const SendEmail = undefined;
export const UploadFile = uploadService;
export const GenerateImage = undefined;
export const ExtractDataFromUploadedFile = undefined;