import { Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { BusinessUserRole } from '~/constants/enums';
import { useAuth } from '~/hooks/useAuth';
import { useToast } from '~/hooks/useToast';
import type {
  OperateSite,
  OperateSiteCreateRequest,
  OperatingHourDay,
} from '~/services/operateSiteService';
import { OperateSiteService } from '~/services/operateSiteService';
import type { BusinessField, ErrorState } from '~/types/businessType';

import AddressInput from './inputs/AddressInput';
import PhoneInput from './inputs/PhoneInput';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { OperatingHoursSection } from './ui/OperatingHoursSection';
import { Textarea } from './ui/textarea';

interface SiteDialogProps {
  businessId: string;
  onSuccess: () => void;
  initialData: OperateSite | null;
  isOpen: boolean;
  closeDialog: () => void;
}

const DEFAULT_OPERATING_HOURS: Record<string, OperatingHourDay> = {
  monday: { isClosed: false, open: '09:00', close: '17:00' },
  tuesday: { isClosed: false, open: '09:00', close: '17:00' },
  wednesday: { isClosed: false, open: '09:00', close: '17:00' },
  thursday: { isClosed: false, open: '09:00', close: '17:00' },
  friday: { isClosed: false, open: '09:00', close: '17:00' },
  saturday: { isClosed: true, open: '', close: '' },
  sunday: { isClosed: true, open: '', close: '' },
};

type SiteFormData = {
  name: BusinessField<string>;
  country: BusinessField<string>;
  streetNumber: BusinessField<string>;
  street: BusinessField<string>;
  suburb: BusinessField<string>;
  city: BusinessField<string>;
  state: BusinessField<string>;
  postcode: BusinessField<string>;
  phoneNumber: BusinessField<string>;
  emailAddress: BusinessField<string>;
  specialInstruction: BusinessField<string>;
};

type SiteFormErrorState = {
  [K in keyof SiteFormData]?: string;
};

const createDefaultFormData = (): SiteFormData => ({
  name: {
    isRequired: true,
    validate: value => {
      if (value.trim().length < 2) {
        return 'Site name must be at least 2 characters';
      }
      if (value.length > 100) {
        return 'Site name cannot exceed 100 characters';
      }
      return null;
    },
    value: '',
    defaultValue: '',
  },
  country: {
    isRequired: true,
    value: 'Australia',
    defaultValue: 'Australia',
  },
  streetNumber: {
    isRequired: true,
    validate: value => {
      if (!/^[\d/A-Za-z-]+$/.test(value.trim())) {
        return 'Street number can only contain numbers, letters, slashes, and hyphens';
      }
      if (value.trim().length > 20) {
        return 'Street number cannot exceed 20 characters';
      }
      return null;
    },
    value: '',
    defaultValue: '',
  },
  street: {
    isRequired: true,
    validate: value => {
      if (value.trim().length < 2) {
        return 'Street name must be at least 2 characters';
      }
      if (value.length > 100) {
        return 'Street name cannot exceed 100 characters';
      }
      return null;
    },
    value: '',
    defaultValue: '',
  },
  suburb: {
    isRequired: true,
    validate: value => {
      if (value.trim().length < 2) {
        return 'Suburb must be at least 2 characters';
      }
      if (value.length > 50) {
        return 'Suburb cannot exceed 50 characters';
      }
      return null;
    },
    value: '',
    defaultValue: '',
  },
  city: {
    isRequired: true,
    validate: value => {
      if (value.trim().length < 2) {
        return 'City must be at least 2 characters';
      }
      if (value.length > 50) {
        return 'City cannot exceed 50 characters';
      }
      return null;
    },
    value: '',
    defaultValue: '',
  },
  state: {
    isRequired: true,
    value: '',
    defaultValue: '',
  },
  postcode: {
    isRequired: true,
    validate: value => {
      if (!/^\d{4}$/.test(value.trim())) {
        return 'Australian postcode must be exactly 4 digits';
      }
      return null;
    },
    value: '',
    defaultValue: '',
  },
  phoneNumber: {
    isRequired: true,
    validate: value => {
      const cleanedPhone = value.replace(/[-\s()+]/g, '');
      if (cleanedPhone.length < 8) {
        return 'Phone number must be at least 8 digits';
      }
      return null;
    },
    value: '',
    defaultValue: '',
  },
  emailAddress: {
    isRequired: true,
    validate: value => {
      if (!value.trim()) {
        return 'Email address is required';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    },
    value: '',
    defaultValue: '',
  },
  specialInstruction: {
    isRequired: false,
    validate: value => {
      if (value.length > 500) {
        return 'Description cannot exceed 500 characters';
      }
      return null;
    },
    value: '',
    defaultValue: '',
  },
});

export default function SiteDialog({
  businessId,
  onSuccess,
  initialData,
  isOpen,
  closeDialog,
}: SiteDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SiteFormData>(
    createDefaultFormData()
  );
  const [operatingHours, setOperatingHours] = useState<
    Record<string, OperatingHourDay>
  >(DEFAULT_OPERATING_HOURS);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<SiteFormErrorState>({});
  const [selectedCountry, setSelectedCountry] = useState('AU');
  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData && isOpen) {
      const defaultData = createDefaultFormData();
      setFormData({
        name: { ...defaultData.name, value: initialData.name ?? '' },
        country: {
          ...defaultData.country,
          value: initialData.country ?? 'Australia',
        },
        streetNumber: {
          ...defaultData.streetNumber,
          value: initialData.streetNumber ?? '',
        },
        street: { ...defaultData.street, value: initialData.street ?? '' },
        suburb: { ...defaultData.suburb, value: initialData.suburb ?? '' },
        city: { ...defaultData.city, value: initialData.city ?? '' },
        state: { ...defaultData.state, value: initialData.state ?? '' },
        postcode: {
          ...defaultData.postcode,
          value: initialData.postcode ?? '',
        },
        phoneNumber: {
          ...defaultData.phoneNumber,
          value: initialData.phoneNumber ?? '',
        },
        emailAddress: {
          ...defaultData.emailAddress,
          value: initialData.emailAddress ?? '',
        },
        specialInstruction: {
          ...defaultData.specialInstruction,
          value: initialData.specialInstruction ?? '',
        },
      });
      setOperatingHours(initialData.operatingHours ?? DEFAULT_OPERATING_HOURS);
      setIsActive(initialData.isActive);
    }
  }, [initialData, isOpen]);

  const validateField = (
    field: keyof SiteFormData,
    value: string
  ): string | undefined => {
    const currentField = formData[field];
    if (!currentField) {
      return undefined;
    }

    const isEmpty = !value;
    if (currentField.isRequired && isEmpty) {
      return 'This field is required';
    }

    if (currentField.validate) {
      const validationMsg = currentField.validate(value);
      return validationMsg ?? undefined;
    }

    return undefined;
  };

  const handleInputChange = (field: keyof SiteFormData, value: string) => {
    const currentField = formData[field];
    const updatedField = {
      ...currentField,
      value,
    };
    const updatedFormData = {
      ...formData,
      [field]: updatedField,
    };
    setFormData(updatedFormData);

    const errorMsg = validateField(field, value);
    if (errorMsg) {
      setError({ ...error, [field]: errorMsg });
    } else {
      setError(prev => {
        const newObj = { ...prev };
        delete newObj[field];
        return newObj;
      });
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    handleInputChange(field as keyof SiteFormData, value);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeDialog();
      setFormData(createDefaultFormData());
      setOperatingHours(DEFAULT_OPERATING_HOURS);
      setIsActive(true);
      setError({});
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const validateAll = (): SiteFormErrorState => {
      const errs: SiteFormErrorState = {};
      Object.entries(formData).forEach(([key, field]) => {
        const errorMsg = validateField(key as keyof SiteFormData, field.value);
        if (errorMsg) {
          errs[key as keyof SiteFormData] = errorMsg;
        }
      });
      return errs;
    };

    const errors = validateAll();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Extract values from BusinessField structure
    const submitData: OperateSiteCreateRequest = {
      name: formData.name.value,
      country: formData.country.value,
      streetNumber: formData.streetNumber.value,
      street: formData.street.value,
      suburb: formData.suburb.value,
      city: formData.city.value,
      state: formData.state.value,
      postcode: formData.postcode.value,
      phoneNumber: formData.phoneNumber.value,
      emailAddress: formData.emailAddress.value,
      operatingHours,
      specialInstruction: formData.specialInstruction.value,
      isActive,
    };

    if (isEditMode) {
      try {
        await OperateSiteService.updateOperateSite(
          businessId,
          initialData.id,
          submitData
        );
        toast({
          title: 'Success',
          description: 'Site updated successfully.',
        });
        handleOpenChange(false);
        onSuccess();
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to update site. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    try {
      await OperateSiteService.createOperateSite(businessId, submitData);
      toast({
        title: 'Success',
        description: 'Site created successfully.',
      });
      handleOpenChange(false);
      onSuccess();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create site. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Check if user can create Sites
  const canCreateSite = user?.role?.slug === BusinessUserRole.Owner;

  if (!canCreateSite) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Site' : 'Create Site'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Store Name */}
          <div className='md:col-span-2'>
            <Label htmlFor='name'>Site Title *</Label>
            <Input
              id='name'
              value={formData.name.value}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder='Name of the store'
              required
            />
            {error.name && (
              <p className='text-xs text-red-600 mt-1'>{error.name}</p>
            )}
          </div>

          {/* Address */}
          <AddressInput
            formData={{
              country: formData.country.value,
              streetNumber: formData.streetNumber.value,
              street: formData.street.value,
              suburb: formData.suburb.value,
              city: formData.city.value,
              state: formData.state.value,
              postcode: formData.postcode.value,
            }}
            onInputChange={handleAddressChange}
            error={error as ErrorState}
          />

          {/* specialInstruction */}
          <div className='md:col-span-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={formData.specialInstruction.value}
              onChange={e =>
                handleInputChange('specialInstruction', e.target.value)
              }
              placeholder='Special Instruction details'
              rows={4}
            />
            {error.specialInstruction && (
              <p className='text-xs text-red-600 mt-1'>
                {error.specialInstruction}
              </p>
            )}
          </div>

          {/* Phone number */}
          <PhoneInput
            value={formData.phoneNumber.value ?? ''}
            selectedCountry={selectedCountry}
            onChange={value => handleInputChange('phoneNumber', value)}
            onCountryChange={country => setSelectedCountry(country)}
          />
          {error.phoneNumber && (
            <p className='text-xs text-red-600 mt-1'>{error.phoneNumber}</p>
          )}

          {/* Email Address */}
          <div className='md:col-span-2'>
            <Label htmlFor='emailAddress'>Email Address *</Label>
            <Input
              id='emailAddress'
              type='email'
              value={formData.emailAddress.value}
              onChange={e => handleInputChange('emailAddress', e.target.value)}
              placeholder='email@example.com'
              required
            />
            {error.emailAddress && (
              <p className='text-xs text-red-600 mt-1'>{error.emailAddress}</p>
            )}
          </div>

          {/* Operating Hours */}
          <OperatingHoursSection
            value={operatingHours}
            onChange={value => setOperatingHours(value)}
          />

          {/* Submit Button */}
          <div className='flex justify-end space-x-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='bg-shadow-lavender hover:bg-shadow-lavender/90'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  {isEditMode ? 'Updating Site...' : 'Creating Site...'}
                </>
              ) : (
                <>
                  <Plus className='w-4 h-4 mr-2' />
                  {isEditMode ? 'Update Site' : 'Create Site'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
