const API_BASE = process.env.REACT_APP_API_BASE || '/api';

async function rawFetch(path, opts = {}) {
  const url = API_BASE + path;
  const res = await fetch(url, opts);
  return res;
}

async function refresh() {
  const res = await rawFetch('/auth/refresh', { method: 'POST', credentials: 'include' });
  if (!res.ok) throw new Error('Refresh failed');
  const data = await res.json();
  if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
  return data;
}

async function fetchWithAuth(path, opts = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = opts.headers ? { ...opts.headers } : {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await rawFetch(path, { ...opts, headers, credentials: 'include' });
  if (res.status === 401) {
    // try refresh once
    try {
      await refresh();
      const newToken = localStorage.getItem('accessToken');
      if (newToken) headers['Authorization'] = `Bearer ${newToken}`;
      return rawFetch(path, { ...opts, headers, credentials: 'include' });
    } catch (e) {
      throw new Error('Unauthorized');
    }
  }
  return res;
}

export async function login(identifier, password) {
  const res = await rawFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ identifier, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
  return data;
}

export async function register(payload) {
  const res = await rawFetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function logout() {
  await rawFetch('/auth/logout', { method: 'POST', credentials: 'include' });
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

export async function getMe() {
  const res = await fetchWithAuth('/users/me');
  if (res.status === 401) throw new Error('Not authenticated');
  return res.json();
}

export async function createIntent(payload) {
  const res = await fetchWithAuth('/payments/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Create intent failed');
  return res.json();
}

export default { login, register, refresh, logout, getMe, fetchWithAuth, createIntent };
