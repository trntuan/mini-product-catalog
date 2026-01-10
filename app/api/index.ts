/**
 * API Module
 * Infrastructure Layer - HTTP client, configuration, error handling, types, and endpoints
 */

// HTTP Service (low-level HTTP methods)
export {default as httpService} from './http.service';

// Types
export * from './types';

// Errors
export * from './errors';

// Endpoints
export {default as ENDPOINTS} from './endpoints';

// Config
export {default as API_CONFIG} from './config';

// Client (for advanced use cases)
export {default as apiClient} from './client';
