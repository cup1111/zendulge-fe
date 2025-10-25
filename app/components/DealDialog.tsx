import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
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
import { OperateSiteService } from '~/services/operateSiteService';
import { ServiceService } from '~/services/serviceService';

interface DealDialogProps {
  companyId: string;
  trigger: React.ReactNode;
  onDealCreated?: () => void;
}

export default function DealDialog({
  companyId,
  trigger,
  onDealCreated,
}: DealDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [operatingSites, setOperatingSites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    duration: 60,
    operatingSite: '',
    availability: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
    status: 'active' as const,
    tags: [] as string[],
    service: '',
  });

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
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [servicesData, sitesData] = await Promise.all([
        ServiceService.getServices(companyId),
        OperateSiteService.getOperateSites(companyId),
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
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await DealService.createDeal(companyId, formData);
      toast({
        title: 'Success',
        description: 'Deal created successfully!',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        price: 0,
        duration: 60,
        operatingSite: '',
        availability: {
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        status: 'active',
        tags: [],
        service: '',
      });

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
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
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

              {/* Operating Site */}
              <div>
                <Label htmlFor='operatingSite'>Operating Site *</Label>
                <Select
                  value={formData.operatingSite}
                  onValueChange={value =>
                    setFormData({ ...formData, operatingSite: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select operating site' />
                  </SelectTrigger>
                  <SelectContent>
                    {operatingSites.map(site => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  value={formData.availability.startDate}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      availability: {
                        ...formData.availability,
                        startDate: e.target.value,
                      },
                    })
                  }
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor='endDate'>End Date *</Label>
                <Input
                  id='endDate'
                  type='date'
                  value={formData.availability.endDate}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      availability: {
                        ...formData.availability,
                        endDate: e.target.value,
                      },
                    })
                  }
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
