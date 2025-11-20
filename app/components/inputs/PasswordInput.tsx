import { Lock } from 'lucide-react';
import React from 'react';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = 'Password',
  label = 'Password',
  onEnter,
}: PasswordInputProps) {
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
          className='border-gray-300'
          onKeyDown={onEnter}
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' />
      </div>
    </div>
  );
}
