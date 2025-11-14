import { ChevronDown, Loader2, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { BusinessUserRole } from '~/constants/enums';
import { useAuth } from '~/contexts/AuthContext';
import { useToast } from '~/hooks/use-toast';
import { DealService } from '~/services/dealService';
import {
  OperateSiteService,
  type OperateSite,
} from '~/services/operateSiteService';
import { ServiceService, type Service } from '~/services/serviceService';

interface DealDialogProps {
  businessId: string;
  trigger?: React.ReactNode;
  onDealCreated?: () => void;
  initialData?: {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    originalPrice?: number;
    duration?: number;
    operatingSite?: string[];
    startDate?: string;
    endDate?: string;
    maxBookings?: number;
    status?: 'active' | 'inactive' | 'expired' | 'sold_out';
    tags?: string[];
    service?: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const formatDate = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized.toISOString().split('T')[0];
};

const addDays = (date: Date, days: number) => {
  const updated = new Date(date);
  updated.setDate(updated.getDate() + days);
  return updated;
};

const parseDateInput = (value?: string | Date) => {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  const valueString = value as string;
  const normalizedString = valueString.includes('T')
    ? valueString
    : `${valueString}T00:00:00`;
  const parsed = new Date(normalizedString);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
};

const toIsoUtcString = (value: string) =>
  value.includes('T') ? value : `${value}T00:00:00.000Z`;

export default function DealDialog({
  businessId,
  trigger,
  onDealCreated,
  initialData,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: DealDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [operatingSites, setOperatingSites] = useState<OperateSite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled open if provided, otherwise use internal state
  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = controlledOnOpenChange ?? setInternalOpen;
  const [operatingSitePopoverOpen, setOperatingSitePopoverOpen] =
    useState(false);

  const normalizeAvailability = useCallback(
    (startInput?: string, endInput?: string) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let start = parseDateInput(startInput);
      if (!start || Number.isNaN(start.getTime())) {
        start = new Date(today);
      } else {
        start.setHours(0, 0, 0, 0);
      }
      if (!startInput && start.getTime() < today.getTime()) {
        start = new Date(today);
        start.setHours(0, 0, 0, 0);
      }

      let end = parseDateInput(endInput);
      if (!end || Number.isNaN(end.getTime())) {
        end = addDays(start, 1);
      } else {
        end.setHours(0, 0, 0, 0);
      }

      if (!endInput && end.getTime() < today.getTime()) {
        end = addDays(start, 1);
      }

      if (end.getTime() <= start.getTime()) {
        end = addDays(start, 1);
      }

      return {
        startDate: formatDate(start),
        endDate: formatDate(end),
      };
    },
    []
  );

  const getInitialSchedule = useCallback(() => {
    const normalizedAvailability = normalizeAvailability(
      initialData?.startDate,
      initialData?.endDate
    );

    return {
      ...normalizedAvailability,
      maxBookings: initialData?.maxBookings,
    };
  }, [initialData, normalizeAvailability]);

  const [formData, setFormData] = useState(() => {
    const initialSchedule = getInitialSchedule();
    return {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      category: initialData?.category ?? '',
      price: initialData?.price ?? 0,
      duration: initialData?.duration ?? 60,
      operatingSite: initialData?.operatingSite ?? [],
      startDate: initialSchedule.startDate,
      endDate: initialSchedule.endDate,
      maxBookings: initialSchedule.maxBookings,
      status: initialData?.status ?? ('active' as const),
      tags: initialData?.tags ?? [],
      service: initialData?.service ?? '',
    };
  });

  const todayString = useMemo(
    () => normalizeAvailability().startDate,
    [normalizeAvailability]
  );

  const minimumEndDate = useMemo(() => {
    const parsedStart = parseDateInput(formData.startDate);
    const resolvedStart =
      parsedStart && !Number.isNaN(parsedStart.getTime())
        ? parsedStart
        : (parseDateInput(todayString) ?? new Date());

    const nextDay = addDays(resolvedStart, 1);
    return formatDate(nextDay);
  }, [formData.startDate, todayString]);

  // Deal categories
  const dealCategories = [
    'Cleaning',
    'Maintenance',
    'Commercial',
    'Specialized',
    'Renovation',
    'Beauty',
    'Health',
    'Fitness',
    'Education',
    'Automotive',
    'Home Improvement',
    'Pet Care',
    'Event Planning',
    'Consulting',
    'Other',
  ];

  // Load services and operating sites when dialog opens
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [servicesData, sitesData] = await Promise.all([
        ServiceService.getServices(businessId),
        OperateSiteService.getOperateSites(businessId),
      ]);

      setServices(Array.isArray(servicesData) ? servicesData : []);
      setOperatingSites(Array.isArray(sitesData) ? sitesData : []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load services and operating sites',
        variant: 'destructive',
      });
      setServices([]);
      setOperatingSites([]);
    } finally {
      setIsLoading(false);
    }
  }, [businessId, toast]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  // Update formData when initialData changes (for duplicating deals)
  useEffect(() => {
    if (initialData && isOpen) {
      const schedule = getInitialSchedule();
      setFormData({
        title: initialData.title ?? '',
        description: initialData.description ?? '',
        category: initialData.category ?? '',
        price: initialData.price ?? 0,
        duration: initialData.duration ?? 60,
        operatingSite: initialData.operatingSite ?? [],
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        maxBookings: schedule.maxBookings,
        status: initialData.status ?? ('active' as const),
        tags: initialData.tags ?? [],
        service: initialData.service ?? '',
      });
    }
  }, [initialData, isOpen, getInitialSchedule]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && !initialData) {
      // Reset form when dialog closes (unless we have initialData)
      const defaultSchedule = normalizeAvailability();
      setFormData({
        title: '',
        description: '',
        category: '',
        price: 0,
        duration: 60,
        operatingSite: [],
        startDate: defaultSchedule.startDate,
        endDate: defaultSchedule.endDate,
        maxBookings: undefined,
        status: 'active' as const,
        tags: [],
        service: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const showValidationError = (message: string) => {
      toast({
        title: 'Invalid availability dates',
        description: message,
        variant: 'destructive',
      });
    };

    const startDate = parseDateInput(formData.startDate);
    const endDate = parseDateInput(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!startDate || Number.isNaN(startDate.getTime())) {
      showValidationError('Start date must be a valid date.');
      return;
    }

    if (!endDate || Number.isNaN(endDate.getTime())) {
      showValidationError('End date must be a valid date.');
      return;
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (endDate.getTime() <= startDate.getTime()) {
      showValidationError('End date must be after the start date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const dealData = {
        ...formData,
        startDate: toIsoUtcString(formData.startDate),
        endDate: toIsoUtcString(formData.endDate),
        maxBookings: formData.maxBookings ?? undefined,
      };
      await DealService.createDeal(businessId, dealData);
      toast({
        title: 'Success',
        description: 'Deal created successfully!',
      });

      // Reset form (unless we have initialData, then keep it for potential re-duplication)
      if (!initialData) {
        const defaultSchedule = normalizeAvailability();
        setFormData({
          title: '',
          description: '',
          category: '',
          price: 0,
          duration: 60,
          operatingSite: [],
          startDate: defaultSchedule.startDate,
          endDate: defaultSchedule.endDate,
          maxBookings: undefined,
          status: 'active' as const,
          tags: [],
          service: '',
        });
      }

      setIsOpen(false);
      onDealCreated?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create deal',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user can create deals
  const canCreateDeal =
    user?.role?.slug === BusinessUserRole.Owner ||
    user?.role?.slug === BusinessUserRole.Manager ||
    user?.role?.slug === BusinessUserRole.Employee;

  if (!canCreateDeal) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Duplicate Deal' : 'Create New Deal'}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin text-shadow-lavender' />
            <span className='ml-3 text-lg text-gray-600'>
              Loading services and operating sites...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Two Column Layout */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Deal Title */}
              <div className='md:col-span-2'>
                <Label htmlFor='title'>Deal Title *</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder='e.g., Spring Cleaning Special'
                  required
                />
              </div>

              {/* Service Selection */}
              <div>
                <Label htmlFor='service'>Service *</Label>
                <Select
                  value={formData.service}
                  onValueChange={value =>
                    setFormData({ ...formData, service: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a service' />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - ${service.basePrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Operating Sites (Multi-select) */}
              <div>
                <Label htmlFor='operatingSite'>Operating Sites *</Label>
                <Popover
                  open={operatingSitePopoverOpen}
                  onOpenChange={setOperatingSitePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full justify-between text-left font-normal'
                      disabled={operatingSites.length === 0}
                    >
                      <span className='truncate'>
                        {(() => {
                          if (formData.operatingSite.length === 0) {
                            return 'Select operating sites';
                          }
                          if (formData.operatingSite.length === 1) {
                            const siteName =
                              operatingSites.find(
                                s => s.id === formData.operatingSite[0]
                              )?.name ?? '1 site selected';
                            return siteName;
                          }
                          return `${formData.operatingSite.length} sites selected`;
                        })()}
                      </span>
                      <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0' align='start'>
                    <div className='max-h-60 overflow-auto p-2'>
                      {operatingSites.map(site => (
                        <div
                          key={site.id}
                          role='button'
                          tabIndex={0}
                          className='flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer'
                          onClick={() => {
                            const isSelected = formData.operatingSite.includes(
                              site.id
                            );
                            if (isSelected) {
                              setFormData({
                                ...formData,
                                operatingSite: formData.operatingSite.filter(
                                  id => id !== site.id
                                ),
                              });
                            } else {
                              setFormData({
                                ...formData,
                                operatingSite: [
                                  ...formData.operatingSite,
                                  site.id,
                                ],
                              });
                            }
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              const isSelected =
                                formData.operatingSite.includes(site.id);
                              if (isSelected) {
                                setFormData({
                                  ...formData,
                                  operatingSite: formData.operatingSite.filter(
                                    id => id !== site.id
                                  ),
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  operatingSite: [
                                    ...formData.operatingSite,
                                    site.id,
                                  ],
                                });
                              }
                            }
                          }}
                        >
                          <Checkbox
                            checked={formData.operatingSite.includes(site.id)}
                            onCheckedChange={checked => {
                              if (checked) {
                                setFormData({
                                  ...formData,
                                  operatingSite: [
                                    ...formData.operatingSite,
                                    site.id,
                                  ],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  operatingSite: formData.operatingSite.filter(
                                    id => id !== site.id
                                  ),
                                });
                              }
                            }}
                          />
                          <Label
                            className='flex-1 cursor-pointer font-normal'
                            onClick={e => e.stopPropagation()}
                          >
                            {site.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                {formData.operatingSite.length === 0 && (
                  <p className='text-sm text-red-500 mt-1'>
                    At least one operating site is required
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <Label htmlFor='category'>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={value =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {dealCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div>
                <Label htmlFor='price'>Deal Price (AUD) *</Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  value={formData.price}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  min='0'
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor='duration'>Duration (minutes) *</Label>
                <Input
                  id='duration'
                  type='number'
                  value={formData.duration}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  min='1'
                  max='1440'
                  required
                />
              </div>

              {/* Start Date */}
              <div>
                <Label htmlFor='startDate'>Start Date *</Label>
                <Input
                  id='startDate'
                  type='date'
                  value={formData.startDate}
                  onChange={e => {
                    const updatedAvailability = normalizeAvailability(
                      e.target.value,
                      formData.endDate
                    );
                    setFormData({
                      ...formData,
                      startDate: updatedAvailability.startDate,
                      endDate: updatedAvailability.endDate,
                    });
                  }}
                  min={todayString}
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor='endDate'>End Date *</Label>
                <Input
                  id='endDate'
                  type='date'
                  value={formData.endDate}
                  onChange={e => {
                    const updatedAvailability = normalizeAvailability(
                      formData.startDate,
                      e.target.value
                    );
                    setFormData({
                      ...formData,
                      startDate: updatedAvailability.startDate,
                      endDate: updatedAvailability.endDate,
                    });
                  }}
                  min={minimumEndDate}
                  required
                />
              </div>
            </div>

            {/* Description - Full Width */}
            <div>
              <Label htmlFor='description'>Description *</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder='Describe your deal...'
                rows={4}
                required
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor='tags'>Tags (comma-separated)</Label>
              <Input
                id='tags'
                value={formData.tags.join(', ')}
                onChange={e =>
                  setFormData({
                    ...formData,
                    tags: e.target.value
                      .split(',')
                      .map(tag => tag.trim())
                      .filter(tag => tag),
                  })
                }
                placeholder='e.g., spring, cleaning, special'
              />
            </div>

            {/* Submit Button */}
            <div className='flex justify-end space-x-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsOpen(false)}
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
                    Creating Deal...
                  </>
                ) : (
                  <>
                    <Plus className='w-4 h-4 mr-2' />
                    Create Deal
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
