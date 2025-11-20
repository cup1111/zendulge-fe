import { Phone } from 'lucide-react';
import React from 'react';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { countries } from '~/constants/countries';

interface PhoneInputProps {
  value: string;
  selectedCountry: string;
  onChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function PhoneInput({
  value,
  selectedCountry = 'Australia-+61',
  onChange,
  onCountryChange,
  placeholder = 'Enter phone number',
  label = 'Phone Number',
}: PhoneInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (newValue && !newValue.startsWith('+') && selectedCountry) {
      if (/^\d/.test(newValue)) {
        const dialCode = selectedCountry.split('-')[1];
        newValue = dialCode ? dialCode + newValue : newValue;
      }
    }

    onChange(newValue);
  };

  const handleCountryChange = (val: string) => {
    onCountryChange(val);
    const dialCode = val.split('-')[1];
    if (value && !value.startsWith('+')) {
      onChange(dialCode + value);
    }
  };

  return (
    <div className='space-y-2'>
      <Label className='flex items-center space-x-2'>
        <Phone className='w-4 h-4' />
        <span>{label}</span>
      </Label>

      <div className='flex space-x-2'>
        <Select value={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select country code' />
          </SelectTrigger>
          <SelectContent>
            {countries.map(country => (
              <SelectItem
                key={country.name}
                value={`${country.name}-${country.dial_code}`}
              >
                <span className='flex items-center space-x-2'>
                  <span>{country.emoji}</span>
                  <span>{country.dial_code}</span>
                  <span className='text-sm text-gray-500'>{country.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type='tel'
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className='flex-1 border-gray-300'
        />
      </div>
    </div>
  );
}
