/**
 * Email validation utility
 * Returns error message string if invalid, null if valid
 * Compatible with business-registration form validate function format
 */
export function validateEmail(value: string): string | null {
  // Regular expression for validating email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(value);

  if (!isEmailValid) {
    return 'Please enter a valid email address';
  }

  return null;
}

/**
 * Password validation utility
 * Returns error message string if invalid, null if valid
 * Compatible with business-registration form validate function format
 * Requires: at least 8 characters, one lowercase, one uppercase, one digit, one special character
 */
export function validatePassword(value: string): string | null {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  const hasLowerCase = /[a-z]/.test(value);
  const hasUpperCase = /[A-Z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSpecialChar = /[\W_]/.test(value);

  const missingRequirements: string[] = [];
  if (!hasLowerCase) {
    missingRequirements.push('one lowercase letter');
  }
  if (!hasUpperCase) {
    missingRequirements.push('one uppercase letter');
  }
  if (!hasDigit) {
    missingRequirements.push('one digit');
  }
  if (!hasSpecialChar) {
    missingRequirements.push('one special character');
  }

  if (missingRequirements.length > 0) {
    return `Password must contain at least ${missingRequirements.join(', ')}`;
  }

  return null;
}

/**
 * Confirm password validation utility
 * Returns error message string if invalid, null if valid
 * Compatible with business-registration form validate function format
 */
export function validateConfirmPassword(
  value: string,
  password: string
): string | null {
  if (value !== password) {
    return 'Passwords do not match';
  }

  return null;
}
