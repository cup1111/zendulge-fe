import { CheckCircle, Lock, XCircle } from 'lucide-react';
import { useEffect } from 'react';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

interface PasswordValidatorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showValidationDetails?: boolean;
  onPasswordValidityChange?: (isValid: boolean) => void;
}

export default function PasswordValidator({
  value,
  onChange,
  placeholder = 'Password',
  label = 'Password',
  showValidationDetails = true,
  onPasswordValidityChange: onValidityChange,
}: PasswordValidatorProps) {
  const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const isPasswordValid = passwordReg.test(value);
  const passwordNotEmpty = value.length > 0;
  const shouldShowError = passwordNotEmpty && !isPasswordValid;

  useEffect(() => {
    if (onValidityChange) onValidityChange(isPasswordValid);
  }, [isPasswordValid]);

  function passwordFieldClass() {
    const borderClass = 'border-gray-300';
    if (isPasswordValid) return 'border-green-500 focus:border-green-500';
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
          className={passwordFieldClass()}
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' />
      </div>

      {showValidationDetails && (
        <div className='space-y-2'>
          {isPasswordValid && (
            <div className='text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200'>
              <CheckCircle className='w-3 h-3 inline mr-1' />
              Valid Password
            </div>
          )}

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
