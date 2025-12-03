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
  const [formData, setFormData] = useState<OperateSiteCreateRequest>({
    name: '',
    country: '',
    streetNumber: '',
    street: '',
    suburb: '',
    city: '',
    state: '',
    postcode: '',
    phoneNumber: '',
    emailAddress: '',
    operatingHours: DEFAULT_OPERATING_HOURS,
    specialInstruction: '',
    isActive: true,
  });
  const [selectedCountry, setSelectedCountry] = useState('AU');
  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name ?? '',
        country: initialData.country ?? '',
        streetNumber: initialData.streetNumber ?? '',
        street: initialData.street ?? '',
        suburb: initialData.suburb ?? '',
        city: initialData.city ?? '',
        state: initialData.state ?? '',
        postcode: initialData.postcode ?? '',
        phoneNumber: initialData.phoneNumber ?? '',
        emailAddress: initialData.emailAddress ?? '',
        operatingHours: initialData.operatingHours ?? DEFAULT_OPERATING_HOURS,
        specialInstruction: initialData.specialInstruction ?? '',
        isActive: initialData.isActive,
      });
    }
  }, [initialData, isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeDialog();
      setFormData({
        name: '',
        country: '',
        streetNumber: '',
        street: '',
        suburb: '',
        city: '',
        state: '',
        postcode: '',
        phoneNumber: '',
        emailAddress: '',
        operatingHours: DEFAULT_OPERATING_HOURS,
        specialInstruction: '',
        isActive: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isEditMode) {
      try {
        await OperateSiteService.updateOperateSite(
          businessId,
          initialData.id,
          formData
        );
        toast({
          title: 'Success',
          description: 'Site updated successfully.',
        });
        handleOpenChange(false);
        onSuccess();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update site. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    try {
      await OperateSiteService.createOperateSite(businessId, formData);
      toast({
        title: 'Success',
        description: 'Site created successfully.',
      });
      handleOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create site. Please try again.',
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
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder='Name of the store'
              required
            />
          </div>

          {/* Address */}
          <AddressInput
            formData={{
              country: formData.country,
              streetNumber: formData.streetNumber,
              street: formData.street,
              suburb: formData.suburb,
              city: formData.city,
              state: formData.state,
              postcode: formData.postcode,
            }}
            onInputChange={(field, value) =>
              setFormData({ ...formData, [field]: value })
            }
            error={{}}
          />

          {/* specialInstruction */}
          <div className='md:col-span-2'>
            <Label htmlFor='description'>Description *</Label>
            <Textarea
              id='description'
              value={formData.specialInstruction}
              onChange={e =>
                setFormData({
                  ...formData,
                  specialInstruction: e.target.value,
                })
              }
              placeholder='Special Instruction details'
              rows={4}
              required
            />
          </div>

          {/* Phone number */}
          <PhoneInput
            value={formData.phoneNumber ?? ''}
            selectedCountry={selectedCountry}
            onChange={value => setFormData({ ...formData, phoneNumber: value })}
            onCountryChange={country => setSelectedCountry(country)}
          />

          {/* Operating Hours */}
          <OperatingHoursSection
            value={formData.operatingHours}
            onChange={value =>
              setFormData({ ...formData, operatingHours: value })
            }
          />

          {/* Submit Button */}
          <div className='flex justify-end space-x-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => closeDialog()}
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
