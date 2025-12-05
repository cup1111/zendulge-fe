import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Tag,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { BusinessUserRole } from '~/constants/enums';
import { useAuth } from '~/hooks/useAuth';
import { useToast } from '~/hooks/useToast';
import type { OperateSite } from '~/services/operateSiteService';
import { OperateSiteService } from '~/services/operateSiteService';

import SiteDialog from './SiteDialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import {
  DropdownClick,
  DropdownClickContent,
  DropdownClickItem,
} from './ui/dropdown-click';

interface SiteManagementProps {
  businessId: string;
}

export default function SiteManagement({ businessId }: SiteManagementProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const [operatingSites, setOperatingSites] = useState<OperateSite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [editingSite, setEditingSite] = useState<OperateSite | null>(null);
  const [siteToDelete, setSiteToDelete] = useState<OperateSite | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isOwner = user?.role?.slug === BusinessUserRole.Owner;
  const isManager = user?.role?.slug === BusinessUserRole.Manager;

  const canCreateSite = () => {
    if (isOwner) return true; // Managers cannot create sites
    return false;
  };

  const canEditSite = () => {
    if (isOwner || isManager) return true;
    return false;
  };

  const canDeleteSite = () => {
    if (isOwner) return true; // TODO: if there are unsolved deals, cannot delete，should be implemented in backend
    return false;
  };

  // Pagination and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const filteredSites = useMemo(() => {
    const filtered = operatingSites.filter(site => {
      const searchLower = searchTerm.toLowerCase();
      return (
        site.name?.toLowerCase().includes(searchLower) ||
        site.country?.toLowerCase().includes(searchLower) ||
        site.street?.toLowerCase().includes(searchLower) ||
        site.suburb?.toLowerCase().includes(searchLower) ||
        site.city?.toLowerCase().includes(searchLower) ||
        site.state?.toLowerCase().includes(searchLower) ||
        site.postcode?.toLowerCase().includes(searchLower) ||
        site.specialInstruction?.toLowerCase().includes(searchLower)
      );
    });
    return filtered;
  }, [operatingSites, searchTerm]);

  const totalPages = Math.ceil(filteredSites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSites = filteredSites.slice(startIndex, endIndex);

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

  const loadSites = useCallback(
    async (resetPage = false) => {
      try {
        setIsLoading(true);
        const operatingSitesData =
          await OperateSiteService.getOperateSites(businessId);

        setOperatingSites(
          Array.isArray(operatingSitesData) ? operatingSitesData : []
        );

        // Reset to first page after creating a new Site
        if (resetPage) {
          setCurrentPage(1);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load sites',
          variant: 'destructive',
        });
        // Set empty arrays on error
        setOperatingSites([]);
      } finally {
        setIsLoading(false);
      }
    },
    [businessId, toast]
  );
  useEffect(() => {
    loadSites();
  }, [businessId, loadSites]);

  const openEditDialog = (site: OperateSite) => {
    setEditingSite(site);
  };

  const handleSubmitSuccess = async () => {
    await loadSites;
  };

  const openDeleteDialog = (site: OperateSite) => {
    setSiteToDelete(site);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSite = async () => {
    if (!siteToDelete) return;

    try {
      await OperateSiteService.deleteOperateSite(businessId, siteToDelete.id);
      toast({
        title: 'Success',
        description: 'Site deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setSiteToDelete(null);
      await loadSites();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete site',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-lg'>Loading sites...</div>
      </div>
    );
  }
  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h2 className='text-2xl font-bold text-shadow-lavender mb-2'>
            Operating Sites
          </h2>
          <p className='text-gray-600'>
            Manage all business locations and their details
          </p>
        </div>
        {/* Search and Add Site */}
        <div className='flex flex-col sm:flex-row gap-3'>
          {/* Search Input */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <input
              type='text'
              placeholder='Search services...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64'
            />
          </div>

          {canCreateSite() && (
            <Button
              className='bg-shadow-lavender hover:bg-shadow-lavender/90 cursor-pointer whitespace-nowrap'
              onClick={() => {
                setOpenCreateDialog(true);
              }}
            >
              <Plus className='w-4 h-4 mr-2' />
              Add Site (WIP)
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary */}

      <div className='text-sm text-gray-600'>
        Showing {startIndex + 1}-{Math.min(endIndex, filteredSites.length)} of{' '}
        {filteredSites.length} sites.
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Sites Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {paginatedSites.length > 0 ? (
          paginatedSites.map(site => (
            <Card
              key={site.id}
              className='hover:shadow-lg transition-shadow duration-200'
            >
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between mb-2'>
                  <CardTitle className='text-lg font-semibold text-gray-900 truncate pr-2'>
                    <div className='flex items-center'>
                      <div className='w-12 h-12 bg-shadow-lavender/10 rounded-lg flex items-center justify-center mr-3'>
                        <Building2 className='w-6 h-6 text-shadow-lavender' />
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                          {site.name}
                        </h3>
                      </div>
                    </div>
                  </CardTitle>
                  <div className='flex space-x-1 flex-shrink-0'>
                    <DropdownClick>
                      <Button variant='ghost' size='sm'>
                        <MoreHorizontal className='w-4 h-4' />
                      </Button>
                      <DropdownClickContent align='start'>
                        <DropdownClickItem>
                          {canEditSite() && (
                            <button
                              type='button'
                              onClick={() => openEditDialog(site)}
                              className='w-full'
                            >
                              Edit Site
                            </button>
                          )}
                        </DropdownClickItem>
                        <DropdownClickItem>
                          {canDeleteSite() && (
                            <button
                              type='button'
                              onClick={() => openDeleteDialog(site)}
                              className='w-full text-red-600'
                            >
                              Delete Site
                            </button>
                          )}
                        </DropdownClickItem>
                      </DropdownClickContent>
                    </DropdownClick>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <Badge variant='secondary' className='w-fit'>
                    <Tag className='w-3 h-3 mr-1' />
                    Uncategorized WIP: Site has a category?
                  </Badge>
                  <Badge
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${(() => {
                      if (site.isActive === true)
                        return 'bg-green-100 text-green-800';
                      if (site.isActive === false)
                        return 'bg-yellow-100 text-yellow-800';
                      return 'bg-gray-100 text-gray-800';
                    })()}`}
                  >
                    {site.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className='space-y-3 pt-0'>
                <div className='space-y-3 mb-4'>
                  <div className='flex items-start'>
                    <MapPin className='w-4 h-4 mr-2 text-gray-400 mt-0.5' />
                    <div>
                      {/* <p className='text-sm text-gray-900'>{site.address}</p> */}
                    </div>
                  </div>

                  <div className='flex items-center'>
                    <Phone className='w-4 h-4 mr-2 text-gray-400' />
                    <p className='text-sm text-gray-900'>{site.phoneNumber}</p>
                  </div>

                  <div className='flex items-center'>
                    <Mail className='w-4 h-4 mr-2 text-gray-400' />
                    <p className='text-sm text-gray-900'>{site.emailAddress}</p>
                  </div>

                  <div className='flex items-center'>
                    <Users className='w-4 h-4 mr-2 text-gray-400' />
                    <p className='text-sm text-gray-900'>Manager: Unassigned</p>
                  </div>

                  <div className='flex items-center'>
                    <Clock className='w-4 h-4 mr-2 text-gray-400' />
                    <p className='text-sm text-gray-900'>operatingHours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className='col-span-full text-center py-12'>
            <Building2 className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500 text-lg'>No operating sites found</p>
            <p className='text-gray-400 text-sm'>
              Add your first location to get started
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Delete Site</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p className='text-gray-600'>
              Are you sure you want to delete &quot;{siteToDelete?.name}&quot;?
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
                onClick={handleDeleteSite}
                className='cursor-pointer'
              >
                Delete Site
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create or Edit Site Dialog */}
      <SiteDialog
        isOpen={openCreateDialog || !!editingSite}
        initialData={editingSite}
        businessId={businessId}
        onSuccess={handleSubmitSuccess}
        closeDialog={() => {
          setOpenCreateDialog(false);
          setEditingSite(null);
        }}
      />

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
