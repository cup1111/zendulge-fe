import React from 'react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

interface SimpleEmailValidatorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showValidationDetails?: boolean;
}

export default function SimpleEmailValidator({
  value,
  onChange,
  placeholder = 'Enter email address',
  label = 'Email Address',
  showValidationDetails = true,
}: SimpleEmailValidatorProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const isValid = value && value.includes('@') && value.includes('.');
  const hasError =
    value && value.length > 0 && (!value.includes('@') || !value.includes('.'));

  return (
    <div className='space-y-2'>
      <Label className='flex items-center space-x-2'>
        <Mail className='w-4 h-4' />
        <span>{label}</span>
        {isValid && <CheckCircle className='w-4 h-4 text-green-500' />}
        {hasError && <XCircle className='w-4 h-4 text-red-500' />}
      </Label>

      <div className='relative'>
        <Input
          type='email'
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`pl-10 ${
            isValid
              ? 'border-green-500 focus:border-green-500'
              : hasError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300'
          }`}
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Mail className='h-4 w-4 text-gray-400' />
        </div>
      </div>

      {showValidationDetails && (
        <div className='space-y-2'>
          {isValid && (
            <div className='text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200'>
              <CheckCircle className='w-3 h-3 inline mr-1' />
              Valid Email
            </div>
          )}

          {hasError && (
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
