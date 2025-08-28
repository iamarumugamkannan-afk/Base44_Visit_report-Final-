import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68931b78c81f56d2b84a0be0", 
  requiresAuth: true // Ensure authentication is required for all operations
});
