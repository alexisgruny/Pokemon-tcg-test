// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// API Routes
export const API_ROUTES = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    GOOGLE_LOGIN: '/auth/google/login',
    VERIFY_EMAIL: (token: string) => `/auth/verify/${token}`,
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
  },
  // Cards
  CARDS: {
    LIST: '/cards/list',
    DETAILS: (id: string) => `/cards/id/${id}`,
    ADD_OR_UPDATE: '/cards/addOrUpdate',
    REMOVE: '/cards/remove',
    FILTER: '/cards/filter',
  },
  // Wanted cards
  WANTED: {
    LIST: '/wanted',
    ADD: '/wanted/add',
    REMOVE: '/wanted/remove',
  },
  // Sets
  SETS: {
    LIST: '/sets/list',
    DETAILS: (id: string) => `/sets/${id}`,
    CARDS: (id: string) => `/sets/${id}/cards`,
  },
  // Users
  USERS: {
    SEARCH: '/users/search',
    LIST_RANDOM: '/users/list',
    PROFILE: (username: string) => `/users/username/${username}`,
  },
  // Profile
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile/update',
    DELETE: '/profile/delete',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;

// Request Timeouts
export const REQUEST_TIMEOUT = {
  DEFAULT: 10000,
  LONG_OPERATION: 30000,
} as const;
