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

interface AddressField {
  isRequired: boolean;
  value: string;
  defaultValue: string;
  validate?: (value: string) => string | null;
}

interface AddressData {
  country: AddressField;
  streetNumber: AddressField;
  streetName: AddressField;
  suburb: AddressField;
  city: AddressField;
  state: AddressField;
  postalCode: AddressField;
  fullAddress: AddressField;
}

interface StructuredAddressInputProps {
  value: AddressData;
  onChange: (address: AddressData) => void;
  error: any;
  errorSetter: (error: any) => void;
}

export default function StructuredAddressInput({
  value,
  onChange,
  error,
  errorSetter,
}: StructuredAddressInputProps) {
  const handleFieldChange = (field: keyof AddressData, newValue: string) => {
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
        address: {
          ...error.address,
          [field]: 'This field is required.',
        },
      });
    } else {
      errorSetter({
        ...error,
        address: {
          ...error.address,
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
  const showError = (message: string) => (
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
                  handleFieldChange('streetNumber', e.target.value)
                }
                placeholder='123'
              />
              {showError(error.address?.streetNumber)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Street Name *</Label>
              <Input
                value={value.streetName.value ?? ''}
                onChange={e => handleFieldChange('streetName', e.target.value)}
                placeholder='Collins Street'
              />
              {showError(error.address?.streetName)}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Suburb</Label>
              <Input
                value={value.suburb.value ?? ''}
                onChange={e => handleFieldChange('suburb', e.target.value)}
                placeholder='Suburb'
              />
              {showError(error.address?.suburb)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>City *</Label>
              <Input
                value={value.city.value || ''}
                onChange={e => handleFieldChange('city', e.target.value)}
                placeholder='Melbourne'
              />
              {showError(error.address?.city)}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>State *</Label>
              <Select
                value={value.state.value ?? ''}
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
              {showError(error.address?.state)}
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Postal Code *</Label>
              <Input
                value={value.postalCode.value ?? ''}
                onChange={e => handleFieldChange('postalCode', e.target.value)}
                placeholder='3000'
              />
              {showError(error.address?.postalCode)}
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
