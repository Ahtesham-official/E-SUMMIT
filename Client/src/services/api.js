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
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return { data };
};

export const apiService = {
  // ── Health ───────────────────────────────────────────────────────────────
  getHealth: () => request('/health'),

  // ── Tickets Catalogue ───────────────────────────────────────────────────
  getTickets: (token) => request('/tickets', { method: 'GET', token }),

  // ── Student Eligibility ─────────────────────────────────────────────────
  getEligibilityStatus: (token) => request('/eligibility/me', { method: 'GET', token }),
  
  startEmailVerification: (token, payload) =>
    request('/eligibility/email/start', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),

  confirmEmailVerification: (token, payload) =>
    request('/eligibility/email/confirm', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),

  submitStudentIdEvidence: (token, payload) =>
    request('/eligibility/student-id', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),

  // ── Order Booking ───────────────────────────────────────────────────────
  createOrder: (token, payload) =>
    request('/orders', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),

  getOrderStatus: (token, orderId) =>
    request(`/orders/${orderId}`, {
      method: 'GET',
      token,
    }),

  // ── Legacy Registrations ────────────────────────────────────────────────
  registerForEvent: (clerkToken) =>
    request('/registrations', {
      method: 'POST',
      token: clerkToken,
    }),
};

export default apiService;
