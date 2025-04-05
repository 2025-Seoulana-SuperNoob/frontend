export const API_ENDPOINTS = {
  USERS: {
    SIGNUP: '/api/users/signup',
    LOGIN: '/api/users/login',
    LOGOUT: '/api/users/logout',
    INFO: (walletAddress: string) => `/api/users/${walletAddress}`,
  },
  RESUME: {
    LIST: (page: number = 1, limit: number = 10) =>
      `/api/resumes?page=${page}&limit=${limit}`,
    CREATE: '/api/resumes',
    DETAIL: (id: string) => `/api/resumes/${id}`,
    UPDATE: (id: string) => `/api/resumes/${id}`,
    DELETE: (id: string) => `/api/resumes/${id}`,
    FEEDBACK: {
      LIST: (id: string) => `/api/resumes/${id}/feedback`,
      CREATE: (id: string) => `/api/resumes/${id}/feedback`,
    },
  },
} as const;