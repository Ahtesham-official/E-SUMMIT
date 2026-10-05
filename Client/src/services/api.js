const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper.
 * Pass a Clerk token via the `token` option for authenticated requests.
 */
const request = async (endpoint, options = {}) => {
  const { token, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions.headers || {}),
  };

  const response = await fetch(url, { ...fetchOptions, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.response = { status: response.status, data };
    throw error;
  }

  return { data };
};

export const apiService = {
  // ── Health ───────────────────────────────────────────────────────────────
  getHealth: () => request('/health'),

  // ── Registrations (Clerk-authenticated) ──────────────────────────────────
  /**
   * POST /api/registrations
   * Requires a Clerk session token.
   * Backend determines TCET vs non-TCET and acts accordingly.
   * Never accepts a ticketId from the frontend for the TCET free-pass flow.
   *
   * @param {string} clerkToken - JWT from useAuth().getClerkToken()
   */
  registerForEvent: (clerkToken) =>
    request('/registrations', {
      method: 'POST',
      token: clerkToken,
    }),
};

export default apiService;
