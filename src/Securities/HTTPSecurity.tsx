// HTTPSecurity.tsx - Utility for enforcing HTTPS, input validation, sanitization, and secure error handling

/**
 * Enforces HTTPS communication by checking the current protocol and redirecting if necessary.
 * This ensures all communications are secure.
 */
export const enforceHTTPS = (): void => {
  if (window.location.protocol !== 'https:') {
    // In production, redirect to HTTPS
    if (process.env.NODE_ENV === 'production') {
      window.location.href = window.location.href.replace('http:', 'https:');
    } else {
      console.warn('HTTPSecurity: Not using HTTPS. Ensure secure communication in production.');
    }
  }
};

/**
 * Sanitizes input strings to prevent injection attacks such as XSS.
 * Removes potentially dangerous characters and scripts.
 * @param input - The input string to sanitize.
 * @returns The sanitized string.
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  // Basic sanitization: remove HTML tags, scripts, and common injection patterns
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove other HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/['"\\]/g, ''); // Remove quotes and backslashes

  // Additional validation: check for SQL injection patterns (basic)
  const sqlPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i;
  if (sqlPatterns.test(sanitized)) {
    throw new Error('Input contains potentially malicious SQL patterns');
  }

  return sanitized.trim();
};

/**
 * Validates input based on type (e.g., email, username).
 * @param input - The input string to validate.
 * @param type - The type of validation ('email', 'username', 'password', etc.).
 * @returns True if valid, false otherwise.
 */
export const validateInput = (input: string, type: 'email' | 'username' | 'password' | 'text'): boolean => {
  if (typeof input !== 'string' || input.length === 0) {
    return false;
  }

  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input);
    case 'username':
      // Alphanumeric, underscores, hyphens, 3-20 characters
      const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
      return usernameRegex.test(input);
    case 'password':
      // At least 8 characters, mix of letters, numbers, symbols
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(input);
    case 'text':
      // Basic text: no special characters that could be used for injection
      const textRegex = /^[a-zA-Z0-9\s.,!?-]+$/;
      return textRegex.test(input);
    default:
      return false;
  }
};

/**
 * Handles errors securely without exposing sensitive information.
 * Logs errors to console in development, but sanitizes for production.
 * @param error - The error object or message.
 * @param context - Optional context for logging.
 */
export const handleSecureError = (error: any, context?: string): void => {
  let errorMessage = 'An unexpected error occurred';

  if (process.env.NODE_ENV === 'development') {
    // In development, log full error for debugging
    console.error(`HTTPSecurity Error${context ? ` in ${context}` : ''}:`, error);
  } else {
    // In production, log only sanitized error message
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    // Avoid logging stack traces or sensitive data
    console.error(`HTTPSecurity Error${context ? ` in ${context}` : ''}: ${errorMessage}`);
  }

  // Optionally, send to error reporting service (e.g., Sentry) without sensitive data
  // Example: sendToErrorReporting({ message: errorMessage, context });
};

/**
 * Wrapper for making secure API requests with validation and error handling.
 * @param url - The API endpoint URL.
 * @param options - Fetch options.
 * @returns Promise resolving to the response.
 */
export const secureFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    // Ensure HTTPS
    if (!url.startsWith('https://')) {
      throw new Error('API requests must use HTTPS');
    }

    // Sanitize headers if present
    if (options.headers) {
      const sanitizedHeaders: Record<string, string> = {};
      for (const [key, value] of Object.entries(options.headers)) {
        sanitizedHeaders[sanitizeInput(key)] = sanitizeInput(String(value));
      }
      options.headers = sanitizedHeaders;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    handleSecureError(error, 'secureFetch');
    throw error; // Re-throw for caller to handle
  }
};
