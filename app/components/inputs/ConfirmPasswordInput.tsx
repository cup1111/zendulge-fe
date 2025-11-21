import React from 'react';

import { Input } from '~/components/ui/input';

interface ConfirmPasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function ConfirmPasswordInput({
  value,
  onChange,
  placeholder = 'Confirm Password',
  onEnter,
}: ConfirmPasswordInputProps) {
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
          className='border-gray-300'
          onKeyDown={onEnter}
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' />
      </div>
    </div>
  );
}
