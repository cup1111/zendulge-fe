import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import type { BusinessAddress, ErrorState } from '../../types/businessType';

interface AddressInputProps {
  value: BusinessAddress;
  onChange: (address: BusinessAddress) => void;
  error: ErrorState;
  errorSetter: (error: ErrorState) => void;
}

export default function AddressInput({
  value,
  onChange,
  error,
  errorSetter,
}: AddressInputProps) {
  // Handles changes to address form fields
  // Updates the address state and validation errors
  const handleAddressFieldChange = (
    field: keyof BusinessAddress,
    newValue: string
  ) => {
    // const updatedField = { ...value[field], value: newValue };
    // onChange({ ...value, [field]: updatedField });

    const updatedAddressObject = {
      ...value,
      [field]: { ...value[field], value: newValue },
    };
    onChange(updatedAddressObject);

    if (updatedAddressObject[field].isRequired && !newValue) {
      errorSetter({
        ...error,
        businessAddress: {
          ...error.businessAddress,
          [field]: 'This field is required.',
        },
      });
    } else {
      errorSetter({
        ...error,
        businessAddress: {
          ...error.businessAddress,
          [field]: '',
        },
      });
    }
    if (updatedAddressObject[field].validate) {
      errorSetter({
        ...error,
        [field]: updatedAddressObject[field].validate(newValue),
      });
    }
  };
  // Renders an error message component for address fields
  const renderErrorMessage = (message: string) => (
    <p className='text-xs text-red-600'>{message}</p>
  );

  return (
    <Card className='w-full'>
      <CardContent className='p-4 space-y-4'>
        <div className='space-y-4'>
          <div className='text-xs text-gray-600 mb-2'>
            <strong>Format:</strong> 123 Collins Street, Melbourne, Melbourne
            VIC 3000
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Street Number *</Label>
              <Input
                value={value.streetNumber.value}
                onChange={e =>
                  handleAddressFieldChange('streetNumber', e.target.value)
                }
                placeholder='123'
              />
              {error.businessAddress?.streetNumber &&
                renderErrorMessage(error.businessAddress?.streetNumber)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Street Name *</Label>
              <Input
                value={value.street.value ?? ''}
                onChange={e =>
                  handleAddressFieldChange('street', e.target.value)
                }
                placeholder='Collins Street'
              />
              {error.businessAddress?.street &&
                renderErrorMessage(error.businessAddress?.street)}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Suburb</Label>
              <Input
                value={value.suburb.value ?? ''}
                onChange={e =>
                  handleAddressFieldChange('suburb', e.target.value)
                }
                placeholder='Suburb'
              />
              {error.businessAddress?.suburb &&
                renderErrorMessage(error.businessAddress?.suburb)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>City *</Label>
              <Input
                value={value.city.value || ''}
                onChange={e => handleAddressFieldChange('city', e.target.value)}
                placeholder='Melbourne'
              />
              {error.businessAddress?.city &&
                renderErrorMessage(error.businessAddress?.city)}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>State *</Label>
              <Select
                value={value.state.value ?? ''}
                onValueChange={val => handleAddressFieldChange('state', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select State' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='NSW'>NSW</SelectItem>
                  <SelectItem value='VIC'>VIC</SelectItem>
                  <SelectItem value='QLD'>QLD</SelectItem>
                  <SelectItem value='SA'>SA</SelectItem>
                  <SelectItem value='WA'>WA</SelectItem>
                  <SelectItem value='TAS'>TAS</SelectItem>
                  <SelectItem value='ACT'>ACT</SelectItem>
                  <SelectItem value='NT'>NT</SelectItem>
                </SelectContent>
              </Select>
              {error.businessAddress?.state &&
                renderErrorMessage(error.businessAddress?.state)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Postal Code *</Label>
              <Input
                value={value.postcode.value ?? ''}
                onChange={e =>
                  handleAddressFieldChange('postcode', e.target.value)
                }
                placeholder='3000'
              />
              {error.businessAddress?.postcode &&
                renderErrorMessage(error.businessAddress?.postcode)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Country</Label>
              <Input value='Australia' disabled className='bg-gray-50' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
