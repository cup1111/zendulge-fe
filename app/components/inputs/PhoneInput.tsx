import { CheckCircle, Phone, XCircle } from 'lucide-react';
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
  showValidationDetails?: boolean;
}

export default function PhoneInput({
  value,
  selectedCountry,
  onChange,
  onCountryChange,
  placeholder = 'Enter phone number',
  label = 'Phone Number',
  showValidationDetails = true,
}: PhoneInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (newValue && !newValue.startsWith('+') && selectedCountry) {
      if (/^\d/.test(newValue)) {
        const dialCode = selectedCountry.split('-')[1];
        newValue = dialCode + newValue;
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

  const isValid = value && value.length > 8;
  const hasError = value && value.length > 0 && value.length <= 8;

  // Returns the CSS class name for the phone input field based on validation state
  function getPhoneFieldClassName() {
    if (hasError) return 'flex-1 border-red-500 focus:border-red-500';
    return 'flex-1';
  }

  return (
    <div className='space-y-2'>
      <Label className='flex items-center space-x-2'>
        <Phone className='w-4 h-4' />
        <span>{label}</span>
        {isValid && <CheckCircle className='w-4 h-4 text-green-500' />}
        {hasError && <XCircle className='w-4 h-4 text-red-500' />}
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
          className={getPhoneFieldClassName()}
        />
      </div>

      {showValidationDetails && (
        <div className='space-y-2'>
          {isValid && (
            <div className='flex items-center space-x-2'>
              <div className='text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200'>
                <CheckCircle className='w-3 h-3 inline mr-1' />
                Valid
              </div>
            </div>
          )}

          {hasError && (
            <div className='text-xs text-red-600'>
              <XCircle className='w-3 h-3 inline mr-1' />
              Please enter a valid phone number
            </div>
          )}
        </div>
      )}
    </div>
  );
}
