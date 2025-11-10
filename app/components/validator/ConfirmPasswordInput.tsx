import { XCircle } from 'lucide-react';
import { useEffect } from 'react';

import { Input } from '~/components/ui/input';

interface ConfirmPasswordInputProps {
  password: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showValidationDetails?: boolean;
  onConfirmPasswordValidityChange?: (isValid: boolean) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function ConfirmPasswordInput({
  password,
  value,
  onChange,
  placeholder = 'Confirm Passoword',
  showValidationDetails = true,
  onConfirmPasswordValidityChange: confirmPasswordValidityChange,
  onEnter,
}: ConfirmPasswordInputProps) {
  const valueNotEmpty = value.length > 0;
  const isConfirmPasswordSame = valueNotEmpty && value === password;
  const shouldShowError = valueNotEmpty && !isConfirmPasswordSame;

  useEffect(() => {
    if (confirmPasswordValidityChange)
      confirmPasswordValidityChange(isConfirmPasswordSame);
  }, [isConfirmPasswordSame, confirmPasswordValidityChange]);

  function passwordFieldClass() {
    const borderClass = 'border-gray-300';
    if (shouldShowError) return 'border-red-500 focus:border-red-500';
    return borderClass;
  }

  return (
    <div className='space-y-2'>
      <div className='relative'>
        <Input
          type='password'
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className={passwordFieldClass()}
          onKeyDown={onEnter}
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' />
      </div>

      {showValidationDetails && (
        <div className='space-y-2'>
          {shouldShowError && (
            <div className='text-xs text-red-600'>
              <XCircle className='w-3 h-3 inline mr-1' />
              Passwords do not match
            </div>
          )}
        </div>
      )}
    </div>
  );
}
