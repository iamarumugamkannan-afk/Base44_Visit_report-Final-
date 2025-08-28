// Import actual service implementations
import visitService from '../services/visitService.js';
import customerService from '../services/customerService.js';
import configurationService from '../services/configurationService.js';
import authService from '../lib/auth.js';
import userService from '../services/userService.js';

// Export services as entities
export const ShopVisit = visitService;
export const Customer = customerService;
export const Configuration = configurationService;

// Export auth service and user service separately
export const AuthService = authService;
export const UserService = userService;