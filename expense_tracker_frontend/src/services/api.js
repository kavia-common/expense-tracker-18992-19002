//
// Centralized API client and helper functions for the Expense Tracker frontend.
// Uses environment variables to determine backend base URL.
// Includes helper methods for auth, expenses, and categories.
//
// PUBLIC_INTERFACE
export const getApiBaseUrl = () => {
  /**
   * Returns the backend API base URL from environment variables.
   * Prefer REACT_APP_API_BASE_URL, fallback to window.__API_BASE_URL__ if available.
   */
  const envUrl = process.env.REACT_APP_API_BASE_URL;
  // eslint-disable-next-line no-undef
  const windowUrl = typeof window !== 'undefined' ? window.__API_BASE_URL__ : null;
  return (envUrl && envUrl.trim()) ? envUrl : (windowUrl || 'http://localhost:5000');
};

// PUBLIC_INTERFACE
export function getAuthToken() {
  /** Returns the stored auth token from localStorage (if any). */
  try {
    return localStorage.getItem('auth_token');
  } catch (e) {
    return null;
  }
}

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /** Stores the auth token in localStorage. */
  try {
    if (token) localStorage.setItem('auth_token', token);
    else localStorage.removeItem('auth_token');
  } catch (e) {
    // no-op
  }
}

// PUBLIC_INTERFACE
export function clearAuth() {
  /** Clears authentication information. */
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  } catch (e) {
    // no-op
  }
}

// Internal: build headers
function buildHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// PUBLIC_INTERFACE
export async function apiGet(path) {
  /** Performs GET request to backend. */
  const res = await fetch(`${getApiBaseUrl()}${path}`, { headers: buildHeaders(false), credentials: 'include' });
  if (!res.ok) throw await extractError(res);
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiPost(path, body) {
  /** Performs POST request to backend. */
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: buildHeaders(true),
    credentials: 'include',
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) throw await extractError(res);
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiPut(path, body) {
  /** Performs PUT request to backend. */
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'PUT',
    headers: buildHeaders(true),
    credentials: 'include',
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) throw await extractError(res);
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiDelete(path) {
  /** Performs DELETE request to backend. */
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(false),
    credentials: 'include',
  });
  if (!res.ok) throw await extractError(res);
  // some APIs may return 204
  try {
    return await res.json();
  } catch {
    return { success: true };
  }
}

async function extractError(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }
  const message = data?.message || data?.error || `Request failed (${res.status})`;
  const error = new Error(message);
  error.status = res.status;
  error.payload = data;
  return error;
}

// PUBLIC_INTERFACE
export const AuthAPI = {
  /**
   * Authentication API wrapper.
   * Expected backend routes (adjust as needed to match backend):
   * - POST /auth/register {name, email, password}
   * - POST /auth/login {email, password}
   * - GET /auth/me (returns current user)
   */
  async register({ name, email, password }) {
    return apiPost('/auth/register', { name, email, password });
  },
  async login({ email, password }) {
    return apiPost('/auth/login', { email, password });
  },
  async me() {
    return apiGet('/auth/me');
  },
};

// PUBLIC_INTERFACE
export const ExpensesAPI = {
  /**
   * Expense API wrapper.
   * Expected backend routes:
   * - GET /expenses
   * - POST /expenses
   * - PUT /expenses/:id
   * - DELETE /expenses/:id
   */
  async list() {
    return apiGet('/expenses');
  },
  async create(expense) {
    return apiPost('/expenses', expense);
  },
  async update(id, expense) {
    return apiPut(`/expenses/${id}`, expense);
  },
  async remove(id) {
    return apiDelete(`/expenses/${id}`);
  },
};

// PUBLIC_INTERFACE
export const CategoriesAPI = {
  /**
   * Category API wrapper.
   * Expected backend routes:
   * - GET /categories
   * - POST /categories
   * - PUT /categories/:id
   * - DELETE /categories/:id
   */
  async list() {
    return apiGet('/categories');
  },
  async create(category) {
    return apiPost('/categories', category);
  },
  async update(id, category) {
    return apiPut(`/categories/${id}`, category);
  },
  async remove(id) {
    return apiDelete(`/categories/${id}`);
  },
};
