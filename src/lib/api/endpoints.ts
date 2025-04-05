export const API_ENDPOINTS = {
USERS: {
	SIGNUP: '/api/users/signup',
	LOGIN: '/api/users/login',
	LOGOUT: '/api/users/logout',
	INFO: (walletAddress: string) => `/api/users/${walletAddress}`,
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