import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Edit3,
  Plus,
  Search,
  Tag,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
import { useToast } from '~/hooks/useToast';
import type {
  Service,
  ServiceCreateRequest,
  ServiceUpdateRequest,
} from '~/services/serviceService';
import { ServiceService } from '~/services/serviceService';

import { BusinessUserRole } from '../constants/enums';
import { useAuth } from '../contexts/useAuth';

type ApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
};

interface ServiceManagementProps {
  businessId: string;
}

export default function ServiceManagement({
  businessId,
}: ServiceManagementProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isServiceLockedDialogOpen, setIsServiceLockedDialogOpen] =
    useState(false);
  const [lockedServiceName, setLockedServiceName] = useState('');
  const [lockedServiceMessage, setLockedServiceMessage] = useState('');

  // Pagination and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Helper functions for role-based access control
  const isOwner = user?.role?.slug === BusinessUserRole.Owner;
  const isManager = user?.role?.slug === BusinessUserRole.Manager;

  const canCreateService = () => isOwner || isManager; // Employees cannot create services
  const canEditService = () => isOwner || isManager; // Employees cannot edit services
  const canDeleteService = () => isOwner || isManager; // Employees cannot delete services
  const [formData, setFormData] = useState<ServiceCreateRequest>({
    name: '',
    category: '',
    duration: 60,
    basePrice: 0,
    description: '',
    status: 'active',
  });

  // Filtered and paginated services
  const filteredServices = useMemo(() => {
    const filtered = services.filter(service => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = service.name?.toLowerCase().includes(searchLower);

      return nameMatch;
    });
    return filtered;
  }, [services, searchTerm]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination helper functions
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const serviceCategories = [
    'Cleaning',
    'Commercial',
    'Specialized',
    'Maintenance',
    'Consultation',
  ];

  const serviceNameDisplay = lockedServiceName || 'This service';

  const handleLockedDialogChange = (open: boolean) => {
    setIsServiceLockedDialogOpen(open);
    if (!open) {
      setLockedServiceName('');
      setLockedServiceMessage('');
    }
  };

  const loadServices = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ServiceService.getServices(businessId);
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
  }, [businessId, toast]);

  useEffect(() => {
    loadServices();
  }, [businessId, loadServices]);

  const handleCreateService = async () => {
    try {
      await ServiceService.createService(businessId, formData);
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
        status: 'active',
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
        status: formData.status,
      };
      await ServiceService.updateService(
        businessId,
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
      const apiError = error as ApiError;
      if (apiError.response?.status === 409) {
        toast({
          title: 'Unable to update service',
          description:
            apiError.response?.data?.message ??
            'This service is in use by existing deals. Please update or remove those deals before making it inactive.',
          variant: 'destructive',
        });
        return;
      }

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
      await ServiceService.deleteService(businessId, serviceToDelete.id);
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
      loadServices();
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 409) {
        const serviceName = serviceToDelete?.name ?? 'This service';
        const message =
          apiError.response?.data?.message ??
          'This service is in use by existing deals. Please update or remove those deals before deleting it.';

        setLockedServiceName(serviceName);
        setLockedServiceMessage(message);
        setIsDeleteDialogOpen(false);
        setServiceToDelete(null);
        setIsServiceLockedDialogOpen(true);
        return;
      }

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
      status: service.status,
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
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-shadow-lavender mb-2'>
            Service Management
          </h2>
        </div>

        {/* Search and Add Service */}
        <div className='flex flex-col sm:flex-row gap-3'>
          {/* Search Input */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <input
              type='text'
              placeholder='Search services...'
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
              }}
              className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64'
            />
          </div>

          {canCreateService() && (
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer whitespace-nowrap'>
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
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder='Service description...'
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor='status'>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={value =>
                        setFormData({
                          ...formData,
                          status: value as 'active' | 'inactive',
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='inactive'>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
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
          )}
        </div>

        {/* Services Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' />

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
              <div>
                <Label htmlFor='edit-status'>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={value =>
                    setFormData({
                      ...formData,
                      status: value as 'active' | 'inactive',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Inactive</SelectItem>
                  </SelectContent>
                </Select>
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

        {/* Service Locked Dialog */}
        <Dialog
          open={isServiceLockedDialogOpen}
          onOpenChange={handleLockedDialogChange}
        >
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>Unable to Delete Service</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center'>
                  <AlertCircle className='w-6 h-6 text-amber-600' />
                </div>
                <div>
                  <p className='text-sm text-gray-600'>
                    {serviceNameDisplay} cannot be deleted right now.
                  </p>
                  <p className='text-sm text-gray-500'>
                    {lockedServiceMessage}
                  </p>
                </div>
              </div>
              <div className='flex justify-end'>
                <Button
                  onClick={() => handleLockedDialogChange(false)}
                  className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer'
                >
                  Got it
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Results Summary */}
      <div className='text-sm text-gray-600'>
        Showing {startIndex + 1}-{Math.min(endIndex, filteredServices.length)}{' '}
        of {filteredServices.length} services
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {paginatedServices.map(service => (
        <Card
          key={service.id}
          className='hover:shadow-lg transition-shadow duration-200'
        >
          <CardHeader className='pb-3'>
            <div className='flex items-start justify-between mb-2'>
              <div className='flex-1 min-w-0'>
                <CardTitle className='text-lg font-semibold text-gray-900 truncate pr-2'>
                  {service.name}
                </CardTitle>
                <Badge
                  className={`mt-1 w-fit ${
                    service.status === 'active'
                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {service.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className='flex space-x-1 flex-shrink-0'>
                {canEditService() && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => openEditDialog(service)}
                    className='cursor-pointer p-1 h-8 w-8'
                  >
                    <Edit3 className='w-4 h-4' />
                  </Button>
                )}
                {canDeleteService() && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => openDeleteDialog(service)}
                    className='text-red-600 hover:text-red-700 cursor-pointer p-1 h-8 w-8'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                )}
              </div>
            </div>
            <Badge variant='secondary' className='w-fit'>
              <Tag className='w-3 h-3 mr-1' />
              {service.category}
            </Badge>
          </CardHeader>
          <CardContent className='space-y-3 pt-0'>
            <div className='flex items-center text-sm text-gray-600'>
              <Clock className='w-4 h-4 mr-2 flex-shrink-0' />
              <span className='font-medium'>
                {formatDuration(service.duration)}
              </span>
            </div>
            <div className='flex items-center text-sm text-gray-600'>
              <DollarSign className='w-4 h-4 mr-2 flex-shrink-0' />
              <span className='font-medium text-green-600'>
                {formatPrice(service.basePrice)}
              </span>
            </div>
            {service.description && (
              <div className='pt-2 border-t border-gray-100'>
                <p className='text-sm text-gray-600 line-clamp-3 leading-relaxed'>
                  {service.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {filteredServices.length === 0 && (
        <div className='text-center py-12'>
          <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Tag className='w-8 h-8 text-gray-400' />
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            {searchTerm
              ? `No services found matching "${searchTerm}"`
              : 'No services yet'}
          </h3>
          <p className='text-gray-600 mb-4'>
            {searchTerm
              ? 'Try adjusting your search terms or create a new service.'
              : 'Create your first service to start managing your business offerings.'}
          </p>
          {canCreateService() && (
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer'
            >
              <Plus className='w-4 h-4 mr-2' />
              {searchTerm ? 'Add New Service' : 'Add Your First Service'}
            </Button>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6'>
          <div className='flex-1 flex justify-between sm:hidden'>
            <button
              type='button'
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            >
              Previous
            </button>
            <button
              type='button'
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            >
              Next
            </button>
          </div>
          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                Showing page <span className='font-medium'>{currentPage}</span>{' '}
                of <span className='font-medium'>{totalPages}</span>
              </p>
            </div>
            <div>
              <nav
                className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                aria-label='Pagination'
              >
                <button
                  type='button'
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                >
                  <span className='sr-only'>Previous</span>
                  <ChevronLeft className='h-5 w-5' aria-hidden='true' />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      type='button'
                      onClick={() => goToPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type='button'
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                >
                  <span className='sr-only'>Next</span>
                  <ChevronRight className='h-5 w-5' aria-hidden='true' />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
