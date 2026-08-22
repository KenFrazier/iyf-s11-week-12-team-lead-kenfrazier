const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers
    }
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    localStorage.removeItem('token');
    throw new Error('Session expired');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMsg;
    
    // Handle different error response formats
    if (data.errors && Array.isArray(data.errors)) {
      // Validation errors array
      errorMsg = data.errors.join(', ');
    } else if (data.error) {
      errorMsg = data.error;
    } else if (data.message) {
      errorMsg = data.message;
    } else {
      errorMsg = `Request failed with status ${response.status}`;
    }
    
    throw new Error(errorMsg);
  }

  return data;
};

export const authAPI = {
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  getMe: () => request('/auth/me')
};

export const issuesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/issues${query ? `?${query}` : ''}`);
  },

  getById: (id) => request(`/issues/${id}`),

  create: (issueData) => request('/issues', {
    method: 'POST',
    body: JSON.stringify(issueData)
  }),

  updateStatus: (id, status) => request(`/issues/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
};

export const commentsAPI = {
  getByIssue: (issueId) => request(`/issues/${issueId}/comments`),

  create: (issueId, commentData) => request(`/issues/${issueId}/comments`, {
    method: 'POST',
    body: JSON.stringify(commentData)
  }),

  delete: (issueId, commentId) => request(`/issues/${issueId}/comments/${commentId}`, {
    method: 'DELETE'
  })
};
