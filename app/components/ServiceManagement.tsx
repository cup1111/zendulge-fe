import { Clock, DollarSign, Edit3, Plus, Tag, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
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
import { useToast } from '~/hooks/use-toast';
import type {
  Service,
  ServiceCreateRequest,
  ServiceUpdateRequest,
} from '~/services/serviceService';
import { ServiceService } from '~/services/serviceService';

interface ServiceManagementProps {
  companyId: string;
}

export default function ServiceManagement({
  companyId,
}: ServiceManagementProps) {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceCreateRequest>({
    name: '',
    category: '',
    duration: 60,
    basePrice: 0,
    description: '',
  });

  const serviceCategories = [
    'Cleaning',
    'Commercial',
    'Specialized',
    'Maintenance',
    'Consultation',
  ];

  const loadServices = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ServiceService.getServices(companyId);
      setServices(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load services',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [companyId, toast]);

  useEffect(() => {
    loadServices();
  }, [companyId, loadServices]);

  const handleCreateService = async () => {
    try {
      await ServiceService.createService(companyId, formData);
      toast({
        title: 'Success',
        description: 'Service created successfully',
      });
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        category: '',
        duration: 60,
        basePrice: 0,
        description: '',
      });
      loadServices();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create service',
        variant: 'destructive',
      });
    }
  };

  const handleEditService = async () => {
    if (!editingService) return;

    try {
      const updateData: ServiceUpdateRequest = {
        name: formData.name,
        category: formData.category,
        duration: formData.duration,
        basePrice: formData.basePrice,
        description: formData.description,
      };
      await ServiceService.updateService(
        companyId,
        editingService.id,
        updateData
      );
      toast({
        title: 'Success',
        description: 'Service updated successfully',
      });
      setIsEditDialogOpen(false);
      setEditingService(null);
      loadServices();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update service',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      await ServiceService.deleteService(companyId, serviceToDelete.id);
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
      loadServices();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      duration: service.duration,
      basePrice: service.basePrice,
      description: service.description ?? '',
    });
    setIsEditDialogOpen(true);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(price);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-shadow-lavender mx-auto mb-4' />
          <p className='text-gray-600'>Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-shadow-lavender mb-2'>
            Service Management
          </h2>
          <p className='text-gray-600'>
            Manage your company&apos;s services and pricing
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer'>
              <Plus className='w-4 h-4 mr-2' />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='name'>Service Name</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder='e.g., Basic Cleaning Service'
                />
              </div>
              <div>
                <Label htmlFor='category'>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={value =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='duration'>Duration (minutes)</Label>
                <Input
                  id='duration'
                  type='number'
                  value={formData.duration}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value, 10) ?? 0,
                    })
                  }
                  min='1'
                  max='1440'
                />
              </div>
              <div>
                <Label htmlFor='basePrice'>Base Price (AUD)</Label>
                <Input
                  id='basePrice'
                  type='number'
                  step='0.01'
                  value={formData.basePrice}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      basePrice: parseFloat(e.target.value) ?? 0,
                    })
                  }
                  min='0'
                />
              </div>
              <div>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder='Service description...'
                  rows={3}
                />
              </div>
              <div className='flex justify-end space-x-2'>
                <Button
                  variant='outline'
                  onClick={() => setIsCreateDialogOpen(false)}
                  className='cursor-pointer'
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateService}
                  className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer'
                >
                  Create Service
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {services.map(service => (
          <Card key={service.id} className='hover:shadow-lg transition-shadow'>
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between'>
                <CardTitle className='text-lg'>{service.name}</CardTitle>
                <div className='flex space-x-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => openEditDialog(service)}
                    className='cursor-pointer'
                  >
                    <Edit3 className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => openDeleteDialog(service)}
                    className='text-red-600 hover:text-red-700 cursor-pointer'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
              <Badge variant='secondary' className='w-fit'>
                <Tag className='w-3 h-3 mr-1' />
                {service.category}
              </Badge>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center text-sm text-gray-600'>
                <Clock className='w-4 h-4 mr-2' />
                {formatDuration(service.duration)}
              </div>
              <div className='flex items-center text-sm text-gray-600'>
                <DollarSign className='w-4 h-4 mr-2' />
                {formatPrice(service.basePrice)}
              </div>
              {service.description && (
                <p className='text-sm text-gray-600 line-clamp-2'>
                  {service.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className='text-center py-12'>
          <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Tag className='w-8 h-8 text-gray-400' />
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No services yet
          </h3>
          <p className='text-gray-600 mb-4'>
            Create your first service to start managing your business offerings.
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Your First Service
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='edit-name'>Service Name</Label>
              <Input
                id='edit-name'
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder='e.g., Basic Cleaning Service'
              />
            </div>
            <div>
              <Label htmlFor='edit-category'>Category</Label>
              <Select
                value={formData.category}
                onValueChange={value =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='edit-duration'>Duration (minutes)</Label>
              <Input
                id='edit-duration'
                type='number'
                value={formData.duration}
                onChange={e =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value, 10) ?? 0,
                  })
                }
                min='1'
                max='1440'
              />
            </div>
            <div>
              <Label htmlFor='edit-basePrice'>Base Price (AUD)</Label>
              <Input
                id='edit-basePrice'
                type='number'
                step='0.01'
                value={formData.basePrice}
                onChange={e =>
                  setFormData({
                    ...formData,
                    basePrice: parseFloat(e.target.value) || 0,
                  })
                }
                min='0'
              />
            </div>
            <div>
              <Label htmlFor='edit-description'>Description</Label>
              <Textarea
                id='edit-description'
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder='Service description...'
                rows={3}
              />
            </div>
            <div className='flex justify-end space-x-2'>
              <Button
                variant='outline'
                onClick={() => setIsEditDialogOpen(false)}
                className='cursor-pointer'
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditService}
                className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer'
              >
                Update Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
                <Trash2 className='w-6 h-6 text-red-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>
                  Are you sure you want to delete this service?
                </p>
                <p className='font-medium text-gray-900'>
                  {serviceToDelete?.name}
                </p>
                <p className='text-sm text-gray-500'>
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className='flex justify-end space-x-2'>
              <Button
                variant='outline'
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setServiceToDelete(null);
                }}
                className='cursor-pointer'
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteService}
                className='bg-red-600 hover:bg-red-700 text-white cursor-pointer'
              >
                Delete Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
