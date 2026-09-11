import { API_URL } from "../../config";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Wrapper around native fetch that automatically injects the Admin JWT token,
 * sends cookies, and handles global 401/403 responses by transparently refreshing 
 * the token and retrying the request.
 */
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  let token = localStorage.getItem("adminToken");
  
  const getHeaders = (tokenStr: string | null) => {
    const headers = new Headers(options.headers);
    if (tokenStr) {
      headers.set("Authorization", `Bearer ${tokenStr}`);
    }
    return headers;
  };

  const executeRequest = (currentToken: string | null) => {
    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: getHeaders(currentToken),
      credentials: 'include', // Ensure cookies (like refreshToken) are sent
    });
  };

  let response = await executeRequest(token);

  if (response.status === 401 && !endpoint.includes('/api/auth/refresh') && !endpoint.includes('/api/auth/logout')) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      .then(async (res) => {
        if (!res.ok) throw new Error('Refresh failed');
        const data = await res.json();
        localStorage.setItem("adminToken", data.token);
        return data.token;
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
        window.dispatchEvent(new Event('auth-expired'));
        return null;
      })
      .finally(() => {
        isRefreshing = false;
      });
    }

    const newToken = await refreshPromise;
    if (newToken) {
      response = await executeRequest(newToken);
    } else {
      // If refresh failed
      window.dispatchEvent(new Event('auth-expired'));
    }
  } else if (response.status === 401) {
    localStorage.removeItem("adminToken");
    window.dispatchEvent(new Event('auth-expired'));
  }

  return response;
};
