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
import type { Deal } from '~/services/dealService';
import { DealService } from '~/services/dealService';
import {
  OperateSiteService,
  type OperateSite,
} from '~/services/operateSiteService';
import { ServiceService, type Service } from '~/services/serviceService';

interface DealDialogProps {
  businessId: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  initialData?: Deal; // Full Deal object for edit mode, undefined for create mode
  dealId?: string; // Deal ID for edit mode, undefined for create mode
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const formatDate = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized.toISOString().split('T')[0];
};

const formatTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const calculateEndTime = (
  startTime: string,
  durationMinutes: number,
  sections: number = 1
): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  const totalMinutes = durationMinutes * sections;
  const endDate = new Date(startDate.getTime() + totalMinutes * 60 * 1000);
  return formatTime(endDate);
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
  onSuccess,
  initialData,
  dealId,
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
    (
      startInput?: string,
      durationMinutes?: number,
      allDay?: boolean,
      sections?: number
    ) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let start = parseDateInput(startInput);
      if (!start || Number.isNaN(start.getTime())) {
        start = new Date(today);
        if (!allDay) {
          start.setHours(9, 0, 0, 0); // Default to 9 AM if not all day
        }
      } else if (allDay) {
        start.setHours(0, 0, 0, 0);
      }
      if (!startInput && start.getTime() < today.getTime()) {
        start = new Date(today);
        if (!allDay) {
          start.setHours(9, 0, 0, 0);
        } else {
          start.setHours(0, 0, 0, 0);
        }
      }

      const duration = durationMinutes ?? 60;
      const sectionsValue = sections ?? 1;
      const startTimeStr = allDay ? undefined : formatTime(start);
      let endTimeStr: string | undefined;
      if (allDay) {
        endTimeStr = undefined;
      } else if (startTimeStr) {
        endTimeStr = calculateEndTime(startTimeStr, duration, sectionsValue);
      } else {
        endTimeStr = '10:00';
      }

      // For endDate, calculate based on if the end time crosses midnight
      let endDate: Date | undefined;
      if (!allDay && startTimeStr) {
        const endDateTime = new Date(start);
        const [hours, minutes] = startTimeStr.split(':').map(Number);
        endDateTime.setHours(hours, minutes, 0, 0);
        const totalMinutes = duration * sectionsValue;
        endDateTime.setTime(endDateTime.getTime() + totalMinutes * 60 * 1000);

        // If end time is next day, use next day as endDate, otherwise same as startDate
        if (endDateTime.toDateString() !== start.toDateString()) {
          endDate = endDateTime;
        } else {
          endDate = new Date(start);
        }
      } else if (allDay) {
        // For all day, default to 30 days from start
        endDate = addDays(start, 30);
        endDate.setHours(23, 59, 59, 999);
      }

      let formattedEndDate: string | undefined;
      if (endDate) {
        formattedEndDate = allDay
          ? formatDate(endDate)
          : endDate.toISOString().split('T')[0];
      }

      return {
        startDate: allDay
          ? formatDate(start)
          : start.toISOString().split('T')[0],
        startTime: startTimeStr,
        endDate: formattedEndDate,
        endTime: endTimeStr,
      };
    },
    []
  );

  const getInitialSchedule = useCallback(() => {
    const allDay = initialData?.allDay ?? false;
    const sections = initialData?.sections ?? 1;
    const normalizedAvailability = normalizeAvailability(
      initialData?.startDate,
      initialData?.duration,
      allDay,
      sections
    );

    return {
      ...normalizedAvailability,
      allDay,
      recurrenceType: initialData?.recurrenceType ?? 'none',
      maxBookings: initialData?.maxBookings,
    };
  }, [initialData, normalizeAvailability]);

  const isEditMode = !!initialData && !!dealId;

  // Helper to extract operating site IDs from Deal object
  const getOperatingSiteIds = (deal?: Deal): string[] => {
    if (!deal) return [];
    if (!deal.operatingSite) return [];
    return deal.operatingSite.map(site => site.id ?? site).filter(Boolean);
  };

  // Helper to extract service ID from Deal object
  const getServiceId = (deal?: Deal): string => {
    if (!deal) return '';
    if (typeof deal.service === 'string') return deal.service;
    return deal.service?.id ?? '';
  };

  // Helper to convert Deal startDate to time input value
  const toTimeInputValue = (dateString: string) => {
    if (!dateString) return '09:00';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '09:00';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Helper to calculate end time from start date, duration, and sections
  const calculateEndTimeFromDeal = (
    startDate: string,
    duration: number,
    sections: number = 1
  ): string | undefined => {
    if (!startDate || !duration) return undefined;
    const date = new Date(startDate);
    if (Number.isNaN(date.getTime())) return undefined;
    const totalMinutes = duration * sections;
    const endDate = new Date(date.getTime() + totalMinutes * 60 * 1000);
    const hours = endDate.getHours().toString().padStart(2, '0');
    const minutes = endDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState(() => {
    const initialSchedule = getInitialSchedule();
    const operatingSiteIds = getOperatingSiteIds(initialData);
    const serviceId = getServiceId(initialData);
    const sections = initialData?.sections ?? 1;
    const endTime =
      initialData && !initialData.allDay
        ? calculateEndTimeFromDeal(
            initialData.startDate,
            initialData.duration,
            sections
          )
        : initialSchedule.endTime;

    return {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price ?? 0,
      originalPrice: initialData?.originalPrice,
      duration: initialData?.duration ?? 60,
      sections: initialData?.sections ?? 1,
      operatingSite: operatingSiteIds,
      allDay: initialSchedule.allDay,
      startDate: initialSchedule.startDate,
      startTime: (() => {
        if (initialData?.allDay) {
          return undefined;
        }
        if (initialData) {
          return toTimeInputValue(initialData.startDate);
        }
        return initialSchedule.startTime;
      })(),
      endDate: initialSchedule.endDate,
      endTime,
      recurrenceType: initialSchedule.recurrenceType,
      maxBookings: initialData?.maxBookings ?? undefined,
      status: initialData?.status ?? ('active' as const),
      tags: initialData?.tags ?? [],
      service: serviceId,
    };
  });

  const todayString = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return formatDate(today);
  }, []);

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

  // Update formData when initialData changes (for editing deals)
  useEffect(() => {
    if (initialData && isOpen) {
      const schedule = getInitialSchedule();
      const operatingSiteIds = getOperatingSiteIds(initialData);
      const serviceId = getServiceId(initialData);
      const sections = initialData?.sections ?? 1;
      const endTime = !initialData.allDay
        ? calculateEndTimeFromDeal(
            initialData.startDate,
            initialData.duration,
            sections
          )
        : undefined;

      setFormData({
        title: initialData.title ?? '',
        description: initialData.description ?? '',
        price: initialData.price ?? 0,
        originalPrice: initialData.originalPrice,
        duration: initialData.duration ?? 60,
        sections: initialData?.sections ?? 1,
        operatingSite: operatingSiteIds,
        allDay: schedule.allDay,
        startDate: schedule.startDate,
        startTime: initialData.allDay
          ? undefined
          : toTimeInputValue(initialData.startDate),
        endDate: schedule.endDate,
        endTime,
        recurrenceType: schedule.recurrenceType,
        maxBookings: schedule.maxBookings,
        status: initialData.status ?? ('active' as const),
        tags: initialData.tags ?? [],
        service: serviceId,
      });
    }
  }, [initialData, isOpen, getInitialSchedule]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && !initialData) {
      // Reset form when dialog closes (unless we have initialData)
      const defaultSchedule = normalizeAvailability(undefined, 60, false, 1);
      setFormData({
        title: '',
        description: '',
        price: 0,
        originalPrice: undefined,
        duration: 60,
        sections: 1,
        operatingSite: [],
        allDay: false,
        startDate: defaultSchedule.startDate,
        startTime: defaultSchedule.startTime,
        endDate: defaultSchedule.endDate,
        endTime: defaultSchedule.endTime,
        recurrenceType: 'none',
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
        title: 'Invalid recurrence settings',
        description: message,
        variant: 'destructive',
      });
    };

    // Parse start datetime
    let startDateTime: Date | undefined;
    if (formData.allDay) {
      startDateTime = parseDateInput(formData.startDate);
      if (startDateTime) {
        startDateTime.setHours(0, 0, 0, 0);
      }
    } else {
      const startDateStr = formData.startDate;
      const startTimeStr = formData.startTime ?? '09:00';
      startDateTime = parseDateInput(`${startDateStr}T${startTimeStr}`);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!startDateTime || Number.isNaN(startDateTime.getTime())) {
      showValidationError('Start date and time must be valid.');
      return;
    }

    const normalizedStart = formData.allDay
      ? new Date(startDateTime)
      : new Date(startDateTime);
    if (formData.allDay) {
      normalizedStart.setHours(0, 0, 0, 0);
    }
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    if (normalizedStart.getTime() < todayStart.getTime()) {
      showValidationError('Start date cannot be before today.');
      return;
    }

    // Calculate end datetime from start datetime + duration
    let endDateTime: Date | undefined;
    if (!formData.allDay && formData.startTime) {
      const startTimeMinutes = formData.startTime.split(':').map(Number);
      const totalMinutes =
        startTimeMinutes[0] * 60 +
        startTimeMinutes[1] +
        formData.duration * formData.sections;
      endDateTime = new Date(startDateTime);
      endDateTime.setHours(
        Math.floor(totalMinutes / 60) % 24,
        totalMinutes % 60,
        0,
        0
      );

      // If end time is on next day, add a day
      if (endDateTime.getTime() <= startDateTime.getTime()) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }
    } else if (formData.allDay) {
      // For all day, end date is start date + 30 days
      endDateTime = addDays(startDateTime, 30);
      endDateTime.setHours(23, 59, 59, 999);
    }

    // Validation: end must be after start (already handled by calculation, but check anyway)
    if (endDateTime && endDateTime.getTime() <= startDateTime.getTime()) {
      showValidationError('End time must be after start time.');
      return;
    }

    // Validate that deal price is less than base price
    const selectedService = services.find(s => s.id === formData.service);
    if (selectedService && selectedService.basePrice > 0) {
      if (formData.price >= selectedService.basePrice) {
        toast({
          title: 'Invalid Price',
          description: 'Deal price must be less than the service base price',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Build datetime strings
      let startDateTimeStr: string;
      if (formData.allDay) {
        startDateTimeStr = toIsoUtcString(formData.startDate);
      } else {
        const { startDate } = formData;
        const startTime = formData.startTime ?? '09:00';
        startDateTimeStr = `${startDate}T${startTime}:00.000Z`;
      }

      // Calculate end datetime from start + duration
      let endDateTimeStr: string | undefined;
      if (endDateTime) {
        if (formData.allDay) {
          endDateTimeStr = `${endDateTime.toISOString().split('T')[0]}T23:59:59.999Z`;
        } else {
          const endDate = endDateTime.toISOString().split('T')[0];
          const endTime = formatTime(endDateTime);
          endDateTimeStr = `${endDate}T${endTime}:00.000Z`;
        }
      }

      const dealData: DealCreateRequest = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice,
        duration: formData.duration,
        sections: formData.allDay ? 1 : formData.sections,
        operatingSite: formData.operatingSite,
        allDay: formData.allDay,
        startDate: startDateTimeStr,
        endDate: endDateTimeStr,
        recurrenceType: formData.recurrenceType,
        maxBookings: formData.maxBookings ?? undefined,
        status: formData.status,
        tags: formData.tags,
        service: formData.service,
      };
      // Only include time fields if NOT all day
      if (!formData.allDay) {
        // Times are already included in startDate and endDate as datetime strings
      }
      // Handle create vs edit mode
      if (isEditMode && dealId) {
        await DealService.updateDeal(businessId, dealId, dealData);
        toast({
          title: 'Success',
          description: 'Deal updated successfully!',
        });
      } else {
        await DealService.createDeal(businessId, dealData);
        toast({
          title: 'Success',
          description: 'Deal created successfully!',
        });
      }

      // Reset form (unless we have initialData in edit mode, then keep it)
      if (!isEditMode) {
        const defaultSchedule = normalizeAvailability();
        setFormData({
          title: '',
          description: '',
          price: 0,
          originalPrice: undefined,
          duration: 60,
          operatingSite: [],
          allDay: false,
          startDate: defaultSchedule.startDate,
          startTime: defaultSchedule.startTime,
          endDate: defaultSchedule.endDate,
          endTime: defaultSchedule.endTime,
          recurrenceType: 'none',
          maxBookings: undefined,
          status: 'active' as const,
          tags: [],
          service: '',
        });
      }

      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditMode
          ? 'Failed to update deal'
          : 'Failed to create deal',
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
          <DialogTitle>{isEditMode ? 'Edit Deal' : 'Create Deal'}</DialogTitle>
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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

              {/* Base Price (Read-only) */}
              <div>
                <Label htmlFor='basePrice'>Service Base Price (AUD)</Label>
                <Input
                  id='basePrice'
                  type='number'
                  value={
                    services.find(s => s.id === formData.service)?.basePrice ??
                    0
                  }
                  disabled
                  readOnly
                  className='bg-gray-100 cursor-not-allowed'
                />
              </div>

              {/* Price */}
              <div>
                <Label htmlFor='price'>Deal Price (AUD) *</Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  value={formData.price}
                  onChange={e => {
                    const newPrice = parseFloat(e.target.value) || 0;
                    const selectedService = services.find(
                      s => s.id === formData.service
                    );
                    const basePrice = selectedService?.basePrice ?? 0;

                    if (
                      newPrice > 0 &&
                      basePrice > 0 &&
                      newPrice >= basePrice
                    ) {
                      toast({
                        title: 'Invalid Price',
                        description:
                          'Deal price must be less than the service base price',
                        variant: 'destructive',
                      });
                      return;
                    }

                    setFormData({
                      ...formData,
                      price: newPrice,
                    });
                  }}
                  min='0'
                  max={(() => {
                    const service = services.find(
                      s => s.id === formData.service
                    );
                    return service?.basePrice
                      ? service.basePrice - 0.01
                      : undefined;
                  })()}
                  required
                />
                {formData.service &&
                  (() => {
                    const selectedService = services.find(
                      s => s.id === formData.service
                    );
                    const basePrice = selectedService?.basePrice ?? 0;
                    if (
                      basePrice > 0 &&
                      formData.price > 0 &&
                      formData.price >= basePrice
                    ) {
                      return (
                        <p className='text-sm text-red-500 mt-1'>
                          Deal price must be less than base price ($
                          {basePrice.toFixed(2)})
                        </p>
                      );
                    }
                    return null;
                  })()}
              </div>

              {/* Status */}
              <div>
                <Label htmlFor='status'>Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={value =>
                    setFormData({
                      ...formData,
                      status: value as
                        | 'active'
                        | 'inactive'
                        | 'expired'
                        | 'sold_out',
                    })
                  }
                  required
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Inactive</SelectItem>
                    <SelectItem value='expired'>Expired</SelectItem>
                    <SelectItem value='sold_out'>Sold Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max Bookings - Full Width */}
              <div>
                <Label htmlFor='maxBookings'>Max Bookings</Label>
                <Input
                  id='maxBookings'
                  type='number'
                  value={formData.maxBookings ?? ''}
                  onChange={e => {
                    const { value } = e.target;
                    setFormData({
                      ...formData,
                      maxBookings:
                        value === ''
                          ? undefined
                          : parseInt(value, 10) || undefined,
                    });
                  }}
                  min='1'
                  placeholder='Optional - leave blank for unlimited'
                />
              </div>

              {/* Description - Full Width */}
              <div className='md:col-span-2'>
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

              {/* Tags - Full Width */}
              <div className='md:col-span-2'>
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

              {/* Horizontal rule */}
              <hr className='col-span-full mt-6 border-t border-gray-300' />
              <div className='col-span-full'>
                <h1>
                  <b>Time and Date</b>
                </h1>
              </div>
              {/* Duration and Sections */}
              <div>
                <Label htmlFor='duration'>Duration (minutes) *</Label>
                <Input
                  id='duration'
                  type='number'
                  value={formData.duration}
                  onChange={e => {
                    const newDuration = parseInt(e.target.value, 10) || 0;
                    setFormData({
                      ...formData,
                      duration: newDuration,
                      // Recalculate endTime when duration changes
                      endTime:
                        !formData.allDay && formData.startTime
                          ? calculateEndTime(
                              formData.startTime,
                              newDuration,
                              formData.sections
                            )
                          : formData.endTime,
                    });
                  }}
                  min='1'
                  max='1440'
                  required
                />
              </div>

              {/* Sections - only show when NOT all day */}
              {!formData.allDay && (
                <div>
                  <Label htmlFor='sections'>Sections *</Label>
                  <Input
                    id='sections'
                    type='number'
                    value={formData.sections}
                    onChange={e => {
                      const newSections = parseInt(e.target.value, 10) || 1;
                      setFormData({
                        ...formData,
                        sections: newSections,
                        // Recalculate endTime when sections changes
                        endTime:
                          !formData.allDay && formData.startTime
                            ? calculateEndTime(
                                formData.startTime,
                                formData.duration,
                                newSections
                              )
                            : formData.endTime,
                      });
                    }}
                    min='1'
                    required
                  />
                </div>
              )}

              {/* Schedule section - full width wrapper */}
              <div className='col-span-full space-y-4'>
                {/* All Day - full width row */}
                <div>
                  <div className='flex items-center space-x-2 justify-start'>
                    <input
                      type='checkbox'
                      id='allDay'
                      checked={formData.allDay}
                      onChange={e => {
                        const isAllDay = e.target.checked;
                        setFormData({
                          ...formData,
                          allDay: isAllDay,
                          // When switching to all day, clear times
                          startTime: isAllDay
                            ? undefined
                            : (formData.startTime ?? '09:00'),
                          endTime: (() => {
                            if (isAllDay) return undefined;
                            if (!formData.startTime) return undefined;
                            return calculateEndTime(
                              formData.startTime,
                              formData.duration,
                              formData.sections
                            );
                          })(),
                        });
                      }}
                      className='h-4 w-4'
                    />
                    <Label htmlFor='allDay' className='cursor-pointer'>
                      All Day (whole business day)
                    </Label>
                  </div>
                </div>

                {/* Start Date and Recurrence Type in same row */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='startDate'>Start Date *</Label>
                    <Input
                      id='startDate'
                      type='date'
                      value={formData.startDate}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          startDate: e.target.value,
                          endTime: formData.startTime
                            ? calculateEndTime(
                                formData.startTime,
                                formData.duration,
                                formData.sections
                              )
                            : formData.endTime,
                        });
                      }}
                      min={todayString}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='recurrenceType'>Recurrence Type *</Label>
                    <Select
                      value={formData.recurrenceType}
                      onValueChange={value => {
                        setFormData({
                          ...formData,
                          recurrenceType: value as
                            | 'none'
                            | 'daily'
                            | 'weekly'
                            | 'weekdays'
                            | 'monthly'
                            | 'annually',
                        });
                      }}
                      required
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select recurrence type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='none'>Does not repeat</SelectItem>
                        <SelectItem value='daily'>Daily</SelectItem>
                        <SelectItem value='weekly'>Weekly</SelectItem>
                        <SelectItem value='weekdays'>
                          Every weekday (Monday to Friday)
                        </SelectItem>
                        <SelectItem value='monthly'>Monthly</SelectItem>
                        <SelectItem value='annually'>Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Start Time, End Time in same row - only show when NOT all day */}
                {!formData.allDay && (
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='startTime'>Start Time *</Label>
                      <Input
                        id='startTime'
                        type='time'
                        value={formData.startTime ?? '09:00'}
                        onChange={e => {
                          const newStartTime = e.target.value;
                          setFormData({
                            ...formData,
                            startTime: newStartTime,
                            endTime: calculateEndTime(
                              newStartTime,
                              formData.duration,
                              formData.sections
                            ),
                          });
                        }}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor='endTime'>End Time</Label>
                      <Input
                        id='endTime'
                        type='time'
                        value={
                          formData.endTime ??
                          calculateEndTime(
                            formData.startTime ?? '09:00',
                            formData.duration
                          )
                        }
                        readOnly
                        className='bg-gray-100 cursor-not-allowed'
                      />
                    </div>
                  </div>
                )}
              </div>
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
                    {isEditMode ? 'Update Deal' : 'Create Deal'}
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
