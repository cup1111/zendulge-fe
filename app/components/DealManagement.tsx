import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Edit3,
  MapPin,
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
import { BusinessUserRole } from '~/constants/enums';
import { useAuth } from '~/contexts/AuthContext';
import { useToast } from '~/hooks/use-toast';
import type { Deal, DealCreateRequest } from '~/services/dealService';
import { DealService } from '~/services/dealService';
import { OperateSiteService } from '~/services/operateSiteService';
import { ServiceService } from '~/services/serviceService';

interface DealManagementProps {
  companyId: string;
}

export default function DealManagement({ companyId }: DealManagementProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [operatingSites, setOperatingSites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);

  // Pagination and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState<DealCreateRequest>({
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

  // Helper functions for role-based access control
  const isOwner = user?.role?.slug === BusinessUserRole.Owner;
  const isManager = user?.role?.slug === BusinessUserRole.Manager;
  const isEmployee = user?.role?.slug === BusinessUserRole.Employee;

  const canEditDeal = (deal: Deal) => {
    if (isOwner) return true;
    if (isManager) return true; // Managers can edit all deals in their operating sites
    if (isEmployee) {
      // Employees can only edit deals they created
      return deal.createdBy?.id === user?.id;
    }
    return false;
  };

  const canDeleteDeal = (deal: Deal) => {
    if (isOwner) return true;
    if (isManager) return true; // Managers can delete all deals in their operating sites
    if (isEmployee) {
      // Employees can only delete deals they created
      return deal.createdBy?.id === user?.id;
    }
    return false;
  };

  const canCreateDeal = () => isOwner || isManager || isEmployee;

  // Deal categories
  const dealCategories = [
    'Education',
    'Technology',
    'Home Services',
    'Automotive',
    'Entertainment',
    'Health & Medical',
    'Business Services',
    'Travel',
    'Shopping',
    'Other',
  ];

  // Filtered and paginated deals
  const filteredDeals = useMemo(() => {
    const filtered = deals.filter(deal => {
      const searchLower = searchTerm.toLowerCase();
      return (
        deal.title?.toLowerCase().includes(searchLower) ||
        deal.category?.toLowerCase().includes(searchLower) ||
        deal.description?.toLowerCase().includes(searchLower) ||
        deal.operatingSite?.name?.toLowerCase().includes(searchLower) ||
        deal.service?.name?.toLowerCase().includes(searchLower)
      );
    });

    return filtered;
  }, [deals, searchTerm]);

  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDeals = filteredDeals.slice(startIndex, endIndex);

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

  const loadDeals = useCallback(async () => {
    try {
      setIsLoading(true);
      const [dealsData, servicesData, sitesData] = await Promise.all([
        DealService.getDeals(companyId),
        ServiceService.getServices(companyId),
        OperateSiteService.getOperateSites(companyId),
      ]);

      // Ensure we have arrays
      setDeals(Array.isArray(dealsData) ? dealsData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setOperatingSites(Array.isArray(sitesData) ? sitesData : []);

      console.log('Loaded data:', {
        deals: dealsData,
        services: servicesData,
        sites: sitesData,
      });
    } catch (error) {
      console.error('Error loading deals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load deals',
        variant: 'destructive',
      });
      // Set empty arrays on error
      setDeals([]);
      setServices([]);
      setOperatingSites([]);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, toast]);

  useEffect(() => {
    loadDeals();
  }, [companyId, loadDeals]);

  const handleCreateDeal = async () => {
    try {
      await DealService.createDeal(companyId, formData);
      toast({
        title: 'Success',
        description: 'Deal created successfully',
      });
      setIsCreateDialogOpen(false);
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
      await loadDeals();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create deal',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title ?? '',
      description: deal.description ?? '',
      category: deal.category ?? '',
      price: deal.price ?? 0,
      duration: deal.duration ?? 60,
      operatingSite: deal.operatingSite?.id ?? '',
      availability: {
        startDate:
          deal.availability?.startDate?.split('T')[0] ??
          new Date().toISOString().split('T')[0],
        endDate:
          deal.availability?.endDate?.split('T')[0] ??
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        maxBookings: deal.availability?.maxBookings,
      },
      status: deal.status ?? 'active',
      tags: deal.tags ?? [],
      service: deal.service?.id ?? '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateDeal = async () => {
    if (!editingDeal) return;

    try {
      await DealService.updateDeal(companyId, editingDeal.id, formData);
      toast({
        title: 'Success',
        description: 'Deal updated successfully',
      });
      setIsEditDialogOpen(false);
      setEditingDeal(null);
      await loadDeals();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update deal',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (deal: Deal) => {
    setDealToDelete(deal);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDeal = async () => {
    if (!dealToDelete) return;

    try {
      await DealService.deleteDeal(companyId, dealToDelete.id);
      toast({
        title: 'Success',
        description: 'Deal deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setDealToDelete(null);
      await loadDeals();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete deal',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(price);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'sold_out':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-lg'>Loading deals...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-shadow-lavender mb-2'>
            Deal Management
          </h2>
          <p className='text-gray-600'>
            Manage your company&apos;s deals and promotions
          </p>
        </div>

        {/* Search and Add Deal */}
        <div className='flex flex-col sm:flex-row gap-3'>
          {/* Search Input */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <input
              type='text'
              placeholder='Search deals...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64'
            />
          </div>

          {canCreateDeal() && (
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer whitespace-nowrap'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Deal
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-md'>
                <DialogHeader>
                  <DialogTitle>Create New Deal</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='title'>Deal Title</Label>
                      <Input
                        id='title'
                        value={formData.title}
                        onChange={e =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder='e.g., Spring Cleaning Special'
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
                          {dealCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='service'>Service</Label>
                      <Select
                        value={formData.service}
                        onValueChange={value => {
                          const selectedService = services.find(
                            s => s.id === value
                          );
                          setFormData({
                            ...formData,
                            service: value,
                            duration:
                              selectedService?.duration ?? formData.duration,
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select service' />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(services) &&
                            services.map(service => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name ?? 'Unknown Service'} -{' '}
                                {formatPrice(service.basePrice || 0)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor='operatingSite'>Operating Site</Label>
                      <Select
                        value={formData.operatingSite}
                        onValueChange={value =>
                          setFormData({ ...formData, operatingSite: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select operating site' />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(operatingSites) &&
                            operatingSites.map(site => (
                              <SelectItem key={site.id} value={site.id}>
                                {site.name ?? 'Unknown Site'}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    {' '}
                    {/* Single column for price */}
                    <div>
                      <Label htmlFor='price'>Deal Price (AUD)</Label>
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
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='duration'>Duration (minutes)</Label>
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
                      />
                    </div>
                    <div>
                      <Label htmlFor='maxBookings'>Max Bookings</Label>
                      <Input
                        id='maxBookings'
                        type='number'
                        value={formData.availability.maxBookings ?? ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            availability: {
                              ...formData.availability,
                              maxBookings:
                                parseInt(e.target.value, 10) || undefined,
                            },
                          })
                        }
                        min='1'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='startDate'>Start Date</Label>
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
                      />
                    </div>
                    <div>
                      <Label htmlFor='endDate'>End Date</Label>
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
                      />
                    </div>
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
                      placeholder='Deal description...'
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
                      onClick={handleCreateDeal}
                      className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer'
                    >
                      Create Deal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className='text-sm text-gray-600'>
        Showing {startIndex + 1}-{Math.min(endIndex, filteredDeals.length)} of{' '}
        {filteredDeals.length} deals
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Deals Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
        {paginatedDeals.map(deal => (
          <Card
            key={deal.id}
            className='hover:shadow-lg transition-shadow duration-200'
          >
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between mb-2'>
                <CardTitle className='text-lg font-semibold text-gray-900 truncate pr-2'>
                  {deal.title ?? 'Untitled Deal'}
                </CardTitle>
                <div className='flex space-x-1 flex-shrink-0'>
                  {canEditDeal(deal) && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => openEditDialog(deal)}
                      className='cursor-pointer p-1 h-8 w-8'
                    >
                      <Edit3 className='w-4 h-4' />
                    </Button>
                  )}
                  {canDeleteDeal(deal) && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => openDeleteDialog(deal)}
                      className='text-red-600 hover:text-red-700 cursor-pointer p-1 h-8 w-8'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  )}
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <Badge variant='secondary' className='w-fit'>
                  <Tag className='w-3 h-3 mr-1' />
                  {deal.category ?? 'Uncategorized'}
                </Badge>
                <Badge
                  className={`w-fit ${getStatusColor(deal.status ?? 'unknown')}`}
                >
                  {deal.status ?? 'unknown'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-3 pt-0'>
              <div className='flex items-center text-sm text-gray-600'>
                <DollarSign className='w-4 h-4 mr-2 flex-shrink-0' />
                <span className='font-medium text-green-600'>
                  {formatPrice(deal.price ?? 0)}
                </span>
              </div>
              <div className='flex items-center text-sm text-gray-600'>
                <Clock className='w-4 h-4 mr-2 flex-shrink-0' />
                <span className='font-medium'>
                  {formatDuration(deal.duration ?? 60)}
                </span>
              </div>
              <div className='flex items-center text-sm text-gray-600'>
                <MapPin className='w-4 h-4 mr-2 flex-shrink-0' />
                <span className='font-medium truncate'>
                  {deal.operatingSite?.name ?? 'Unknown Site'}
                </span>
              </div>
              <div className='flex items-center text-sm text-gray-600'>
                <Calendar className='w-4 h-4 mr-2 flex-shrink-0' />
                <span className='font-medium'>
                  {formatDate(deal.availability?.startDate ?? '')} -{' '}
                  {formatDate(deal.availability?.endDate ?? '')}
                </span>
              </div>
              {deal.createdBy && (
                <div className='flex items-center text-sm text-gray-500'>
                  <span className='text-xs'>
                    Created by: {deal.createdBy.firstName}{' '}
                    {deal.createdBy.lastName}
                  </span>
                </div>
              )}
              {deal.description && (
                <div className='pt-2 border-t border-gray-100'>
                  <p className='text-sm text-gray-600 line-clamp-3 leading-relaxed'>
                    {deal.description ?? ''}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDeals.length === 0 && (
        <div className='text-center py-12'>
          <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Tag className='w-8 h-8 text-gray-400' />
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            {searchTerm
              ? `No deals found matching "${searchTerm}"`
              : 'No deals yet'}
          </h3>
          <p className='text-gray-600 mb-4'>
            {searchTerm
              ? 'Try adjusting your search terms or create a new deal.'
              : 'Create your first deal to start promoting your business.'}
          </p>
          {canCreateDeal() && (
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer'
            >
              <Plus className='w-4 h-4 mr-2' />
              {searchTerm ? 'Add New Deal' : 'Add Your First Deal'}
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              {' '}
              {/* Two columns */}
              <div>
                <Label htmlFor='edit-title'>Deal Title</Label>
                <Input
                  id='edit-title'
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder='e.g., Spring Cleaning Special'
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
                    {dealCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {' '}
              {/* Two columns */}
              <div>
                <Label htmlFor='edit-service'>Service</Label>
                <Select
                  value={formData.service}
                  onValueChange={value => {
                    const selectedService = services.find(s => s.id === value);
                    setFormData({
                      ...formData,
                      service: value,
                      duration: selectedService?.duration ?? formData.duration,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select service' />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(services) &&
                      services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name ?? 'Unknown Service'} -{' '}
                          {formatPrice(service.basePrice || 0)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='edit-operatingSite'>Operating Site</Label>
                <Select
                  value={formData.operatingSite}
                  onValueChange={value =>
                    setFormData({ ...formData, operatingSite: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select operating site' />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(operatingSites) &&
                      operatingSites.map(site => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name ?? 'Unknown Site'}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              {' '}
              {/* Single column for price */}
              <div>
                <Label htmlFor='edit-price'>Deal Price (AUD)</Label>
                <Input
                  id='edit-price'
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
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {' '}
              {/* Two columns */}
              <div>
                <Label htmlFor='edit-duration'>Duration (minutes)</Label>
                <Input
                  id='edit-duration'
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
                />
              </div>
              <div>
                <Label htmlFor='edit-maxBookings'>Max Bookings</Label>
                <Input
                  id='edit-maxBookings'
                  type='number'
                  value={formData.availability.maxBookings ?? ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      availability: {
                        ...formData.availability,
                        maxBookings: parseInt(e.target.value, 10) || undefined,
                      },
                    })
                  }
                  min='1'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {' '}
              {/* Two columns */}
              <div>
                <Label htmlFor='edit-startDate'>Start Date</Label>
                <Input
                  id='edit-startDate'
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
                />
              </div>
              <div>
                <Label htmlFor='edit-endDate'>End Date</Label>
                <Input
                  id='edit-endDate'
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
                />
              </div>
            </div>

            <div>
              {' '}
              {/* Full width for description */}
              <Label htmlFor='edit-description'>Description</Label>
              <Textarea
                id='edit-description'
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder='Deal description...'
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
                onClick={handleUpdateDeal}
                className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer'
              >
                Update Deal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Delete Deal</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p className='text-gray-600'>
              Are you sure you want to delete &quot;{dealToDelete?.title}&quot;?
              This action cannot be undone.
            </p>
            <div className='flex justify-end space-x-2'>
              <Button
                variant='outline'
                onClick={() => setIsDeleteDialogOpen(false)}
                className='cursor-pointer'
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={handleDeleteDeal}
                className='cursor-pointer'
              >
                Delete Deal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
