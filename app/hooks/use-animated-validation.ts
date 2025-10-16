import { useEffect, useState } from 'react';
import type { FieldError } from 'react-hook-form';

interface ValidationState {
  status: 'idle' | 'valid' | 'invalid' | 'warning' | 'loading';
  message?: string;
  isAnimating: boolean;
}

interface UseAnimatedValidationProps {
  error?: FieldError;
  value?: any;
  customValidation?: (
    value: any
  ) => Promise<{ isValid: boolean; message?: string; type?: 'warning' }>;
  debounceMs?: number;
}

export function useAnimatedValidation({
  error,
  value,
  customValidation,
  debounceMs = 300,
}: UseAnimatedValidationProps) {
  const [validationState, setValidationState] = useState<ValidationState>({
    status: 'idle',
    isAnimating: false,
  });

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // If there's an error from form validation, show it immediately
    if (error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValidationState({
        status: 'invalid',
        message: error.message,
        isAnimating: true,
      });

      // Stop animation after a brief period
      const animationTimer = setTimeout(() => {
        setValidationState(prev => ({ ...prev, isAnimating: false }));
      }, 300);

      return () => clearTimeout(animationTimer);
    }

    // If no value, reset to idle
    if (!value || value === '') {
      setValidationState({
        status: 'idle',
        isAnimating: false,
      });
      return undefined;
    }

    // Set loading state and debounce custom validation
    if (customValidation) {
      setValidationState({
        status: 'loading',
        isAnimating: true,
      });

      const timer = setTimeout(async () => {
        try {
          const result = await customValidation(value);

          let status: 'valid' | 'warning' | 'invalid';
          if (result.isValid) {
            status = 'valid';
          } else if (result.type === 'warning') {
            status = 'warning';
          } else {
            status = 'invalid';
          }

          setValidationState({
            status,
            message: result.message,
            isAnimating: true,
          });

          // Stop animation after showing result
          setTimeout(() => {
            setValidationState(prev => ({ ...prev, isAnimating: false }));
          }, 200);
        } catch (err) {
          setValidationState({
            status: 'invalid',
            message: 'Validation failed',
            isAnimating: false,
          });
        }
      }, debounceMs);

      setDebounceTimer(timer);
      return () => clearTimeout(timer);
    }

    // If no custom validation but has value and no errors, show valid
    if (value && !error) {
      setValidationState({
        status: 'valid',
        isAnimating: true,
      });

      const animationTimer = setTimeout(() => {
        setValidationState(prev => ({ ...prev, isAnimating: false }));
      }, 200);

      return () => clearTimeout(animationTimer);
    }

    return undefined;
  }, [error, value, customValidation, debounceMs, debounceTimer]);

  return validationState;
}

// Email validation function for use with the hook
export const validateEmail = async (
  email: string
): Promise<{ isValid: boolean; message?: string; type?: 'warning' }> => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  // Check for common disposable email domains
  const disposableDomains = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'tempmail.org',
    'yopmail.com',
    'throwaway.email',
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  if (disposableDomains.includes(domain)) {
    return {
      isValid: false,
      message: 'Disposable email addresses are not allowed',
      type: 'warning',
    };
  }

  // Check for common typos in popular domains
  const popularDomains = {
    'gmail.com': ['gmai.com', 'gmial.com', 'gamil.com'],
    'yahoo.com': ['yaho.com', 'yahooo.com', 'yhoo.com'],
    'hotmail.com': ['hotmial.com', 'hotmeil.com', 'hotmai.com'],
  };

  const foundTypo = Object.entries(popularDomains).find(([, typos]) =>
    typos.includes(domain)
  );

  if (foundTypo) {
    const [correct] = foundTypo;
    return {
      isValid: false,
      message: `Did you mean ${email.replace(domain, correct)}?`,
      type: 'warning',
    };
  }

  return { isValid: true, message: 'Email looks good!' };
};

// Phone validation function
export const validatePhone = async (
  phone: string
): Promise<{ isValid: boolean; message?: string }> => {
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length < 10) {
    return {
      isValid: false,
      message: 'Phone number must be at least 10 digits',
    };
  }

  if (cleanPhone.length > 15) {
    return { isValid: false, message: 'Phone number is too long' };
  }

  return { isValid: true, message: 'Phone number is valid' };
};
