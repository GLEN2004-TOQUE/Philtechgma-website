export type PasswordStrength = 'Weak' | 'Medium' | 'Strong';

export const evaluatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return 'Weak';

  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  if (length < 6) {
    return 'Weak';
  } else if (length >= 8 && varietyCount >= 3) {
    return 'Strong';
  } else {
    return 'Medium';
  }
};
