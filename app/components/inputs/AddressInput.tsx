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

import type {
  ErrorState,
  FormDataRecord,
  Step4FormData,
} from '../../types/businessType';

interface AddressInputProps {
  step4Data: Step4FormData;
  setStep4Data: React.Dispatch<React.SetStateAction<Step4FormData>>;
  onInputChange: <T extends FormDataRecord>(
    formData: T,
    setFormData: React.Dispatch<React.SetStateAction<T>>,
    fieldName: keyof T,
    value: string | string[]
  ) => void;
  error: ErrorState;
}

export default function AddressInput({
  step4Data,
  setStep4Data,
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
                value={step4Data.streetNumber.value}
                onChange={e =>
                  onInputChange(
                    step4Data,
                    setStep4Data,
                    'streetNumber',
                    e.target.value
                  )
                }
                placeholder='123'
              />
              {error.streetNumber && renderErrorMessage(error.streetNumber)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Street Name *</Label>
              <Input
                value={step4Data.street.value ?? ''}
                onChange={e =>
                  onInputChange(
                    step4Data,
                    setStep4Data,
                    'street',
                    e.target.value
                  )
                }
                placeholder='Collins Street'
              />
              {error.street && renderErrorMessage(error.street)}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Suburb</Label>
              <Input
                value={step4Data.suburb.value ?? ''}
                onChange={e =>
                  onInputChange(
                    step4Data,
                    setStep4Data,
                    'suburb',
                    e.target.value
                  )
                }
                placeholder='Suburb'
              />
              {error.suburb && renderErrorMessage(error.suburb)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>City *</Label>
              <Input
                value={step4Data.city.value || ''}
                onChange={e =>
                  onInputChange(step4Data, setStep4Data, 'city', e.target.value)
                }
                placeholder='Melbourne'
              />
              {error.city && renderErrorMessage(error.city)}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>State *</Label>
              <Select
                value={step4Data.state.value ?? ''}
                onValueChange={val =>
                  onInputChange(step4Data, setStep4Data, 'state', val)
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
              {error.state && renderErrorMessage(error.state)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Postal Code *</Label>
              <Input
                value={step4Data.postcode.value ?? ''}
                onChange={e =>
                  onInputChange(
                    step4Data,
                    setStep4Data,
                    'postcode',
                    e.target.value
                  )
                }
                placeholder='3000'
              />
              {error.postcode && renderErrorMessage(error.postcode)}
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
