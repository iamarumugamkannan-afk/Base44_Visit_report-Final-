// Import actual service implementations
import visitService from '../services/visitService.js';
import customerService from '../services/customerService.js';
import configurationService from '../services/configurationService.js';
import { authService } from '../lib/auth.js';

// Export services as entities
export const ShopVisit = visitService;
export const Customer = customerService;
export const Configuration = configurationService;

// Export auth service as User
export const User = authService;