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

interface AddressData {
  country: string;
  streetNumber: string;
  streetName: string;
  suburb: string;
  city: string;
  state: string;
  postalCode: string;
  fullAddress: string;
}

interface SimpleStructuredAddressInputProps {
  value: AddressData;
  onChange: (address: AddressData) => void;
}

export default function SimpleStructuredAddressInput({
  value,
  onChange,
}: SimpleStructuredAddressInputProps) {
  const handleFieldChange = (field: keyof AddressData, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

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
                value={value.streetNumber || ''}
                onChange={e =>
                  handleFieldChange('streetNumber', e.target.value)
                }
                placeholder='123'
              />
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Street Name *</Label>
              <Input
                value={value.streetName || ''}
                onChange={e => handleFieldChange('streetName', e.target.value)}
                placeholder='Collins Street'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Suburb</Label>
              <Input
                value={value.suburb || ''}
                onChange={e => handleFieldChange('suburb', e.target.value)}
                placeholder='Suburb'
              />
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>City *</Label>
              <Input
                value={value.city || ''}
                onChange={e => handleFieldChange('city', e.target.value)}
                placeholder='Melbourne'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>State *</Label>
              <Select
                value={value.state || ''}
                onValueChange={val => handleFieldChange('state', val)}
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
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Postal Code *</Label>
              <Input
                value={value.postalCode || ''}
                onChange={e => handleFieldChange('postalCode', e.target.value)}
                placeholder='3000'
              />
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
