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
import { Phone, CheckCircle, XCircle } from 'lucide-react';

interface SimplePhoneValidatorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  mobileOnly?: boolean;
  showValidationDetails?: boolean;
}

const countries = [
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
];

export default function SimplePhoneValidator({
  value,
  onChange,
  placeholder = 'Enter phone number',
  label = 'Phone Number',
  mobileOnly = false,
  showValidationDetails = true,
}: SimplePhoneValidatorProps) {
  const [selectedCountry, setSelectedCountry] = React.useState('+61');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (newValue && !newValue.startsWith('+') && selectedCountry) {
      if (/^\d/.test(newValue)) {
        newValue = selectedCountry + newValue;
      }
    }

    onChange(newValue);
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);

    if (value && !value.startsWith('+')) {
      onChange(countryCode + value);
    }
  };

  const isValid = value && value.length > 8;
  const hasError = value && value.length > 0 && value.length <= 8;

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
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countries.map(country => (
              <SelectItem key={country.code} value={country.code}>
                <span className='flex items-center space-x-2'>
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
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
          className={`flex-1 ${
            isValid
              ? 'border-green-500 focus:border-green-500'
              : hasError
                ? 'border-red-500 focus:border-red-500'
                : ''
          }`}
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
              <div className='text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded border'>
                {mobileOnly ? '📱 Mobile' : '☎️ Phone'}
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
