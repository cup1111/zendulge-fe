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
  // Regular expression for validating password strength (same as PasswordInput.tsx)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const isPasswordValid = passwordRegex.test(value);

  if (!isPasswordValid) {
    return 'Please enter a valid Password';
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
