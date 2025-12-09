// CSRFtoken.tsx - Utility for generating and validating CSRF tokens to prevent Cross-Site Request Forgery attacks

/**
 * Generates a cryptographically secure random CSRF token.
 * @returns A 64-character hexadecimal string representing the CSRF token.
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validates a CSRF token by checking its format.
 * @param token - The token to validate.
 * @returns True if the token is valid, false otherwise.
 */
export const validateCSRFToken = (token: string): boolean => {
  // Basic validation: ensure it's a 64-character hexadecimal string
  return /^[a-f0-9]{64}$/.test(token);
};

/**
 * Stores the CSRF token in sessionStorage for persistence across page reloads.
 * @param token - The token to store.
 */
export const storeCSRFToken = (token: string): void => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    sessionStorage.setItem('csrfToken', token);
  }
};

/**
 * Retrieves the CSRF token from sessionStorage.
 * @returns The stored token or null if not found.
 */
export const getStoredCSRFToken = (): string | null => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    return sessionStorage.getItem('csrfToken');
  }
  return null;
};

/**
 * Clears the stored CSRF token from sessionStorage.
 */
export const clearCSRFToken = (): void => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    sessionStorage.removeItem('csrfToken');
  }
};
