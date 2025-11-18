import { Mail, XCircle } from 'lucide-react';
import React, { useEffect } from 'react';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showValidationDetails?: boolean;
  onEmailValidityChange?: (isValid: boolean) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function EmailInput({
  value,
  onChange,
  placeholder = 'Enter email address',
  label = 'Email Address',
  showValidationDetails = true,
  onEmailValidityChange,
  onEnter,
}: EmailInputProps) {
  // Regular expression for validating email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(value);
  const hasInput = value.length > 0;
  const shouldShowError = hasInput && !isEmailValid && showValidationDetails;

  // Returns the CSS class name for the email input field based on validation state
  function getEmailFieldClassName() {
    const borderClass = 'border-gray-300';
    if (shouldShowError) return 'border-red-500 focus:border-red-500';
    return borderClass;
  }

  useEffect(() => {
    if (onEmailValidityChange) onEmailValidityChange(isEmailValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmailValid]);

  return (
    <div className='space-y-2'>
      <Label className='flex items-center space-x-2'>
        <Mail className='w-4 h-4' />
        <span>{label}</span>
      </Label>

      <div className='relative'>
        <Input
          type='email'
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className={getEmailFieldClassName()}
          onKeyDown={onEnter}
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' />
      </div>

      {showValidationDetails && (
        <div className='space-y-2'>
          {shouldShowError && (
            <span className='text-xs text-red-600'>
              <XCircle className='w-3 h-3 inline mr-1' />
              Please enter a valid email address
            </span>
          )}
        </div>
      )}
    </div>
  );
}
