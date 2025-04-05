export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
  },
  RESUME: {
    LIST: '/api/resumes',
    CREATE: '/api/resumes',
    DETAIL: (id: string) => `/api/resumes/${id}`,
    UPDATE: (id: string) => `/api/resumes/${id}`,
    DELETE: (id: string) => `/api/resumes/${id}`,
  },
  FEEDBACK: {
    CREATE: (resumeId: string) => `/api/resumes/${resumeId}/feedback`,
    LIST: (resumeId: string) => `/api/resumes/${resumeId}/feedback`,
  },
} as const;