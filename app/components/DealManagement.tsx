import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  DollarSign,
  Edit3,
  MapPin,
  Plus,
  Search,
  Tag,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import DealDialog from '~/components/DealDialog';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { BusinessUserRole } from '~/constants/enums';
import { useAuth } from '~/hooks/useAuth';
import { useToast } from '~/hooks/useToast';
import type { Deal } from '~/services/dealService';
import { DealService } from '~/services/dealService';

interface DealManagementProps {
  businessId: string;
}

export default function DealManagement({ businessId }: DealManagementProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [dealToDuplicate, setDealToDuplicate] = useState<Deal | null>(null);
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);

  // Pagination and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  const canDuplicateDeal = () =>
    // Anyone who can create deals can duplicate them
    canCreateDeal();

  // Filtered and paginated deals
  const filteredDeals = useMemo(() => {
    const filtered = deals.filter(deal => {
      const searchLower = searchTerm.toLowerCase();
      return (
        deal.title?.toLowerCase().includes(searchLower) ||
        (deal.service?.category ?? '').toLowerCase().includes(searchLower) ||
        deal.description?.toLowerCase().includes(searchLower) ||
        deal.operatingSite.some(site =>
          site.name?.toLowerCase().includes(searchLower)
        ) ||
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

  const loadDeals = useCallback(
    async (resetPage = false) => {
      try {
        setIsLoading(true);
        const dealsData = await DealService.getDeals(businessId);

        setDeals(Array.isArray(dealsData) ? dealsData : []);

        // Reset to first page after creating a new deal
        if (resetPage) {
          setCurrentPage(1);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load deals',
          variant: 'destructive',
        });
        // Set empty arrays on error
        setDeals([]);
      } finally {
        setIsLoading(false);
      }
    },
    [businessId, toast]
  );

  useEffect(() => {
    loadDeals();
  }, [businessId, loadDeals]);

  const openEditDialog = (deal: Deal) => {
    setEditingDeal(deal);
  };

  const handleEditSuccess = async () => {
    setEditingDeal(null);
    await loadDeals();
  };

  const openDeleteDialog = (deal: Deal) => {
    setDealToDelete(deal);
    setIsDeleteDialogOpen(true);
  };

  const openDuplicateDialog = (deal: Deal) => {
    setDealToDuplicate(deal);
    setIsDuplicateDialogOpen(true);
  };

  const handleDeleteDeal = async () => {
    if (!dealToDelete) return;

    try {
      await DealService.deleteDeal(businessId, dealToDelete.id);
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
    if (remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${hours}h`;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const formatStatus = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'expired':
        return 'Expired';
      case 'sold_out':
        return 'Sold Out';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

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

  const canToggleStatus = (status: string) =>
    status === 'active' || status === 'inactive';

  const getStatusToggleTitle = (deal: Deal) => {
    if (!canEditDeal(deal)) return '';
    if (!canToggleStatus(deal.status ?? '')) {
      return 'Only active or inactive deals can change status';
    }
    return deal.status === 'active'
      ? 'Click to deactivate'
      : 'Click to activate';
  };

  const handleToggleStatus = async (deal: Deal) => {
    if (!canEditDeal(deal)) return;

    if (!canToggleStatus(deal.status ?? '')) {
      toast({
        title: 'Unavailable',
        description:
          'Status changes are only available for active or inactive deals.',
        variant: 'destructive',
      });
      return;
    }

    const newStatus = deal.status === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'active' ? 'activated' : 'deactivated';

    try {
      await DealService.updateDealStatus(businessId, deal.id, {
        status: newStatus,
      });
      toast({
        title: 'Success',
        description: `Deal ${actionText} successfully`,
      });
      await loadDeals();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update deal status',
        variant: 'destructive',
      });
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
            Manage your business&apos;s deals and promotions
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
            <DealDialog
              businessId={businessId}
              trigger={
                <Button className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer whitespace-nowrap'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Deal
                </Button>
              }
              onSuccess={() => loadDeals(true)}
            />
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className='text-sm text-gray-600'>
        Showing {startIndex + 1}-{Math.min(endIndex, filteredDeals.length)} of{' '}
        {filteredDeals.length} deals
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Confirm Duplicate Dialog */}
      <Dialog open={confirmDuplicate} onOpenChange={setConfirmDuplicate}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Duplicate Deal</DialogTitle>
          </DialogHeader>

          <p className='text-gray-600'>
            Are you sure you want to duplicate this{' '}
            <span className='font-semibold'>
              {dealToDuplicate
                ? formatStatus(dealToDuplicate.status ?? 'unknown')
                : ''}
            </span>{' '}
            deal: "{dealToDuplicate?.title}"?
          </p>

          <div className='flex justify-end space-x-2 mt-4'>
            <Button
              variant='outline'
              onClick={() => {
                setConfirmDuplicate(false);
                setDealToDuplicate(null);
              }}
              className='cursor-pointer'
            >
              Cancel
            </Button>

            <Button
              className='cursor-pointer bg-shadow-lavender hover:bg-shadow-lavender/90'
              onClick={() => {
                setConfirmDuplicate(false);
                if (!dealToDuplicate) return;
                openDuplicateDialog(dealToDuplicate);
              }}
            >
              Duplicate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                  {canDuplicateDeal() && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setDealToDuplicate(deal);
                        setConfirmDuplicate(true);
                      }}
                      className='cursor-pointer p-1 h-8 w-8'
                      title='Duplicate deal'
                    >
                      <Copy className='w-4 h-4' />
                    </Button>
                  )}
                  {canEditDeal(deal) && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => openEditDialog(deal)}
                      className='cursor-pointer p-1 h-8 w-8'
                      title='Edit deal'
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
                      title='Delete deal'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  )}
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <Badge variant='secondary' className='w-fit'>
                  <Tag className='w-3 h-3 mr-1' />
                  {deal.category?.name ??
                    deal.service?.category ??
                    'Uncategorized'}
                </Badge>
                <Badge
                  className={`w-fit ${
                    canEditDeal(deal) && canToggleStatus(deal.status ?? '')
                      ? 'cursor-pointer hover:opacity-80 transition-opacity'
                      : 'cursor-not-allowed opacity-60'
                  } ${getStatusColor(deal.status ?? 'unknown')}`}
                  onClick={
                    canEditDeal(deal) && canToggleStatus(deal.status ?? '')
                      ? () => handleToggleStatus(deal)
                      : undefined
                  }
                  title={getStatusToggleTitle(deal)}
                >
                  {formatStatus(deal.status ?? 'unknown')}
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
                {deal.operatingSite.length > 0 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className='font-medium truncate cursor-help'>
                          {deal.operatingSite.map(site => site.name).join(', ')}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side='top'
                        className='max-w-xs'
                        sideOffset={5}
                      >
                        <div className='space-y-1'>
                          <p className='font-semibold text-sm mb-2'>
                            Operating Sites ({deal.operatingSite.length}):
                          </p>
                          <ul className='list-disc list-inside space-y-1'>
                            {deal.operatingSite.map(site => (
                              <li key={site.id} className='text-sm'>
                                {site.name}
                                {site.address && (
                                  <span className='text-xs text-gray-400 block ml-4'>
                                    {site.address}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className='font-medium truncate'>No sites</span>
                )}
              </div>
              <div className='flex items-center text-sm text-gray-600'>
                <Calendar className='w-4 h-4 mr-2 flex-shrink-0' />
                <span className='font-medium'>
                  {(() => {
                    if (!deal.startDate) return '—';
                    const startDate = new Date(deal.startDate);
                    let display = formatDate(deal.startDate);
                    if (!deal.allDay) {
                      const timeStr = startDate.toLocaleTimeString('en-AU', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      });
                      display += ` ${timeStr}`;
                    }
                    if (deal.recurrenceType !== 'none') {
                      display += ` (${deal.recurrenceType})`;
                    }
                    return display;
                  })()}
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
            <DealDialog
              businessId={businessId}
              trigger={
                <Button className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer'>
                  <Plus className='w-4 h-4 mr-2' />
                  {searchTerm ? 'Add New Deal' : 'Add Your First Deal'}
                </Button>
              }
              onSuccess={() => loadDeals(true)}
            />
          )}
        </div>
      )}

      {/* Edit Dialog - Now using DealDialog component */}
      {editingDeal && (
        <DealDialog
          businessId={businessId}
          initialData={editingDeal}
          dealId={editingDeal.id}
          open={!!editingDeal}
          onOpenChange={open => {
            if (!open) {
              setEditingDeal(null);
            }
          }}
          onSuccess={handleEditSuccess}
        />
      )}

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

      {/* Duplicate Deal Dialog */}
      {dealToDuplicate && (
        <DealDialog
          businessId={businessId}
          open={isDuplicateDialogOpen}
          onOpenChange={open => {
            setIsDuplicateDialogOpen(open);
            if (!open) {
              setDealToDuplicate(null);
            }
          }}
          onSuccess={() => {
            loadDeals();
            setIsDuplicateDialogOpen(false);
            setDealToDuplicate(null);
          }}
          initialData={{
            ...dealToDuplicate,
            title: `${dealToDuplicate.title ?? 'Untitled Deal'} (duplicate)`,
          }}
        />
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
