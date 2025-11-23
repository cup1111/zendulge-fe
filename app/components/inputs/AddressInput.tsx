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

import type { ErrorState } from '../../types/businessType';

interface AddressInputProps {
  formData: {
    businessAddressCountry: string;
    businessAddressStreetNumber: string;
    businessAddressStreet: string;
    businessAddressSuburb: string;
    businessAddressCity: string;
    businessAddressState: string;
    businessAddressPostcode: string;
  };
  onInputChange: (field: string, value: string) => void;
  error: ErrorState;
}

export default function AddressInput({
  formData,
  onInputChange,
  error,
}: AddressInputProps) {
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
                value={formData.businessAddressStreetNumber}
                onChange={e =>
                  onInputChange('businessAddressStreetNumber', e.target.value)
                }
                placeholder='123'
              />
              {error.businessAddressStreetNumber &&
                renderErrorMessage(error.businessAddressStreetNumber)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Street Name *</Label>
              <Input
                value={formData.businessAddressStreet ?? ''}
                onChange={e =>
                  onInputChange('businessAddressStreet', e.target.value)
                }
                placeholder='Collins Street'
              />
              {error.businessAddressStreet &&
                renderErrorMessage(error.businessAddressStreet)}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Suburb</Label>
              <Input
                value={formData.businessAddressSuburb ?? ''}
                onChange={e =>
                  onInputChange('businessAddressSuburb', e.target.value)
                }
                placeholder='Suburb'
              />
              {error.businessAddressSuburb &&
                renderErrorMessage(error.businessAddressSuburb)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>City *</Label>
              <Input
                value={formData.businessAddressCity || ''}
                onChange={e =>
                  onInputChange('businessAddressCity', e.target.value)
                }
                placeholder='Melbourne'
              />
              {error.businessAddressCity &&
                renderErrorMessage(error.businessAddressCity)}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>State *</Label>
              <Select
                value={formData.businessAddressState ?? ''}
                onValueChange={val =>
                  onInputChange('businessAddressState', val)
                }
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
              {error.businessAddressState &&
                renderErrorMessage(error.businessAddressState)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Postal Code *</Label>
              <Input
                value={formData.businessAddressPostcode ?? ''}
                onChange={e =>
                  onInputChange('businessAddressPostcode', e.target.value)
                }
                placeholder='3000'
              />
              {error.businessAddressPostcode &&
                renderErrorMessage(error.businessAddressPostcode)}
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
