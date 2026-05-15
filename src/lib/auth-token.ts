const AUTH_STORAGE_KEY = 'auth-storage';
const LEGACY_TOKEN_KEY = 'token';

export function getClientAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const authStorage = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authStorage) {
      const parsed = JSON.parse(authStorage) as { state?: { token?: string } };
      if (parsed?.state?.token) return parsed.state.token;
    }
  } catch {
    // ignore parse errors
  }

  return localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function clearClientAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem('user');
}

export function getTokenFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const tokenCookie = cookieHeader
    .split(';')
    .find((c) => c.trim().startsWith('auth-token='));

  if (!tokenCookie) return null;

  const raw = tokenCookie.trim().slice('auth-token='.length);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
