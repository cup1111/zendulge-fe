import { CheckCircle, Mail, XCircle } from 'lucide-react';
import React, { useEffect } from 'react';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

interface SimpleEmailValidatorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showValidationDetails?: boolean;
  onEmailValidityChange?: (isValid: boolean) => void;
}

export default function SimpleEmailValidator({
  value,
  onChange,
  placeholder = 'Enter email address',
  label = 'Email Address',
  showValidationDetails = true,
  onEmailValidityChange,
}: SimpleEmailValidatorProps) {
  const mailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = mailReg.test(value);
  const hasInput = value.length > 0;
  const shouldShowError = hasInput && !isEmailValid;

  function emailFieldClass() {
    const borderClass = 'border-gray-300';
    if (isEmailValid) return 'border-green-500 focus:border-green-500';
    if (shouldShowError) return 'border-red-500 focus:border-red-500';
    return borderClass;
  }

  useEffect(() => {
    if (onEmailValidityChange) onEmailValidityChange(isEmailValid);
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
          className={emailFieldClass()}
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' />
      </div>

      {showValidationDetails && (
        <div className='space-y-2'>
          {isEmailValid && (
            <div className='text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200'>
              <CheckCircle className='w-3 h-3 inline mr-1' />
              Valid Email
            </div>
          )}

          {shouldShowError && (
            <div className='text-xs text-red-600'>
              <XCircle className='w-3 h-3 inline mr-1' />
              Please enter a valid email address
            </div>
          )}
        </div>
      )}
    </div>
  );
}
