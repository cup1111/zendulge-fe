import { Lock, XCircle } from 'lucide-react';
import { useEffect } from 'react';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showValidationDetails?: boolean;
  onPasswordValidityChange?: (isValid: boolean) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = 'Password',
  label = 'Password',
  showValidationDetails = true,
  onPasswordValidityChange: onValidityChange,
  onEnter,
}: PasswordInputProps) {
  // Regular expression for validating password strength
  // Requires: at least 8 characters, one lowercase, one uppercase, one digit, one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const isPasswordValid = passwordRegex.test(value);
  const passwordNotEmpty = value.length > 0;
  const shouldShowError = passwordNotEmpty && !isPasswordValid;

  useEffect(() => {
    if (onValidityChange) onValidityChange(isPasswordValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPasswordValid]);

  // Returns the CSS class name for the password input field based on validation state
  function getPasswordFieldClassName() {
    const borderClass = 'border-gray-300';
    if (shouldShowError) return 'border-red-500 focus:border-red-500';
    return borderClass;
  }

  return (
    <div className='space-y-2'>
      <Label className='flex items-center space-x-2'>
        <Lock className='w-4 h-4' />
        <span>{label}</span>
      </Label>

      <div className='relative'>
        <Input
          type='password'
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className={getPasswordFieldClassName()}
          onKeyDown={onEnter}
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' />
      </div>

      {showValidationDetails && (
        <div className='space-y-2'>
          {shouldShowError && (
            <div className='text-xs text-red-600'>
              <XCircle className='w-3 h-3 inline mr-1' />
              Please enter a valid Password
            </div>
          )}
        </div>
      )}
    </div>
  );
}
