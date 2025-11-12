import {
  Building2,
  Clock,
  Edit3,
  Eye,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import CustomerManagement from '~/components/CustomerManagement';
import DealManagement from '~/components/DealManagement';
import ServiceManagement from '~/components/ServiceManagement';
import { Button } from '~/components/ui/button';
import { API_CONFIG } from '~/config/api';
import zendulgeAxios from '~/config/axios';
import { BusinessUserRole, OperatingSiteStatus } from '~/constants/enums';
import { useAuth } from '~/contexts/AuthContext';

interface OperatingSite {
  id: string | number;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: OperatingSiteStatus;
  manager: string;
  services: string[];
  hours: string;
  revenue: string;
  bookings: number;
}

// Helper function to format status with proper capitalization
function formatStatus(status: OperatingSiteStatus): string {
  return status
    .replace('_', ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to format operating hours
function formatOperatingHours(hours: Record<string, unknown>): string {
  if (!hours) return 'Not configured';

  const today = new Date().getDay();
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const todayName = days[today];
  const todayHours = hours[todayName] as Record<string, unknown>;

  if (todayHours?.isClosed) {
    return 'Closed today';
  }

  return `${(todayHours?.open as string) || '09:00'} - ${(todayHours?.close as string) || '17:00'}`;
}

async function fetchOperatingSites(
  companyId: string
): Promise<OperatingSite[]> {
  if (!companyId) {
    throw new Error('Company ID is required to fetch operating sites');
  }

  const response = await zendulgeAxios.get(
    API_CONFIG.endpoints.company.operateSites(companyId)
  );

  const result = response.data;

  // Transform backend data to match frontend interface
  interface BackendSite {
    id: string | number;
    name: string;
    address: string;
    phoneNumber?: string;
    emailAddress?: string;
    isActive: boolean;
    members?: Array<{ firstName?: string; lastName?: string }>;
    services?: string[];
    operatingHours?: Record<string, unknown>;
    revenue?: number;
    bookings?: number;
  }

  const sites = (result.data.operateSites as BackendSite[]).map(site => ({
    id: site.id,
    name: site.name,
    address: site.address,
    phone: site.phoneNumber ?? '',
    email: site.emailAddress ?? '',
    status: site.isActive
      ? OperatingSiteStatus.Active
      : OperatingSiteStatus.Inactive,
    manager:
      site.members && site.members.length > 0
        ? `${site.members[0].firstName ?? ''} ${site.members[0].lastName ?? ''}`.trim() ||
          'To be assigned'
        : 'To be assigned',
    services:
      site.services && Array.isArray(site.services) && site.services.length > 0
        ? site.services
        : ['To be configured'],
    hours: formatOperatingHours(site.operatingHours ?? {}),
    revenue: site.revenue ? `$${site.revenue}` : '$0',
    bookings: site.bookings ?? 0,
  }));

  return sites;
}

export default function BusinessManagement() {
  const { user, currentCompany, isAuthenticated, isLoading } = useAuth();
  const [operatingSites, setOperatingSites] = useState<OperatingSite[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setDataLoading(true);
        setError(null);

        // Wait for auth to finish loading
        if (isLoading) {
          return;
        }

        // Check if user is authenticated
        if (!isAuthenticated || !user) {
          throw new Error('No user authentication found');
        }

        // Ensure we have a current company selected
        if (!currentCompany?.id) {
          // Don't throw error, just wait for company to be available
          setDataLoading(false);
          return;
        }

        const companyIdString = currentCompany.id;

        // Fetch operating sites from real backend
        const sitesData = await fetchOperatingSites(companyIdString);
        setOperatingSites(sitesData);
      } catch (err) {
        // Show real errors for backend connectivity issues
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Backend connection failed: ${errorMessage}`);
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, [isLoading, isAuthenticated, user, currentCompany?.id]); // Re-run when auth state or company changes

  if (isLoading || dataLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin text-shadow-lavender mx-auto mb-4' />
          <p className='text-gray-600'>Loading management data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>Error: {error}</p>
          <Button
            onClick={() => globalThis.location.reload()}
            className='bg-shadow-lavender hover:bg-shadow-lavender/90'
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Show "no access" message if user has no operating sites
  // Business owners are excluded - they can access everything even without site assignments
  if (
    operatingSites.length === 0 &&
    user?.role?.slug !== BusinessUserRole.Owner
  ) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center p-6'>
          <p className='text-gray-600'>
            You have no access to any store, please contact your Admin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className='bg-blue-50 border-b border-blue-200 px-4 py-2'>
          <div className='max-w-7xl mx-auto'>
            <p className='text-blue-800 text-sm'>
              <strong>Backend Status:</strong> Operating Sites from real API ✅
              | Service Management integrated ✅
            </p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <section className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-shadow-lavender mb-2'>
                Business Management
              </h1>
              <p className='text-gray-600'>
                Manage your services, deals, customers, and business locations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customers Management Section (only for owners and managers) */}
      {(user?.role?.slug === BusinessUserRole.Owner ||
        user?.role?.slug === BusinessUserRole.Manager) && (
        <section className='py-8 border-t border-gray-200 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {currentCompany?.id && (
              <CustomerManagement companyId={currentCompany.id} />
            )}
          </div>
        </section>
      )}

      {/* Service Management Section (for owners, managers, and employees) */}
      {(user?.role?.slug === BusinessUserRole.Owner ||
        user?.role?.slug === BusinessUserRole.Manager ||
        user?.role?.slug === BusinessUserRole.Employee) && (
        <section className='py-8 border-t border-gray-200 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {currentCompany?.id && (
              <ServiceManagement companyId={currentCompany.id} />
            )}
          </div>
        </section>
      )}

      {/* Deal Management Section (for owners, managers, and employees) */}
      {(user?.role?.slug === BusinessUserRole.Owner ||
        user?.role?.slug === BusinessUserRole.Manager ||
        user?.role?.slug === BusinessUserRole.Employee) && (
        <section className='py-8 border-t border-gray-200 bg-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {currentCompany?.id && (
              <DealManagement companyId={currentCompany.id} />
            )}
          </div>
        </section>
      )}

      {/* Operating Sites Section (for owners and managers) */}
      {(user?.role?.slug === BusinessUserRole.Owner ||
        user?.role?.slug === BusinessUserRole.Manager) && (
        <section className='py-8 border-t border-gray-200 bg-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='mb-8'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-2xl font-bold text-shadow-lavender mb-2'>
                    Operating Sites (WIP)
                  </h2>
                  <p className='text-gray-600'>
                    Manage all business locations and their details
                  </p>
                </div>
                <Button className='bg-shadow-lavender hover:bg-shadow-lavender/90'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Location
                </Button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {operatingSites.length > 0 ? (
                  operatingSites.map(site => (
                    <div
                      key={site.id}
                      className='bg-white border border-gray-200 rounded-lg p-6'
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex items-center'>
                          <div className='w-12 h-12 bg-shadow-lavender/10 rounded-lg flex items-center justify-center mr-3'>
                            <Building2 className='w-6 h-6 text-shadow-lavender' />
                          </div>
                          <div>
                            <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                              {site.name}
                            </h3>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${(() => {
                                if (site.status === OperatingSiteStatus.Active)
                                  return 'bg-green-100 text-green-800';
                                if (
                                  site.status ===
                                  OperatingSiteStatus.OpeningSoon
                                )
                                  return 'bg-yellow-100 text-yellow-800';
                                return 'bg-gray-100 text-gray-800';
                              })()}`}
                            >
                              {formatStatus(site.status)}
                            </span>
                          </div>
                        </div>
                        <Button variant='ghost' size='sm'>
                          <MoreHorizontal className='w-4 h-4' />
                        </Button>
                      </div>

                      <div className='space-y-3 mb-4'>
                        <div className='flex items-start'>
                          <MapPin className='w-4 h-4 mr-2 text-gray-400 mt-0.5' />
                          <div>
                            <p className='text-sm text-gray-900'>
                              {site.address}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center'>
                          <Phone className='w-4 h-4 mr-2 text-gray-400' />
                          <p className='text-sm text-gray-900'>{site.phone}</p>
                        </div>

                        <div className='flex items-center'>
                          <Mail className='w-4 h-4 mr-2 text-gray-400' />
                          <p className='text-sm text-gray-900'>{site.email}</p>
                        </div>

                        <div className='flex items-center'>
                          <Users className='w-4 h-4 mr-2 text-gray-400' />
                          <p className='text-sm text-gray-900'>
                            Manager: {site.manager}
                          </p>
                        </div>

                        <div className='flex items-center'>
                          <Clock className='w-4 h-4 mr-2 text-gray-400' />
                          <p className='text-sm text-gray-900'>{site.hours}</p>
                        </div>
                      </div>

                      <div className='mb-4'>
                        <p className='text-sm font-medium text-gray-900 mb-2'>
                          Services:
                        </p>
                        <div className='flex flex-wrap gap-1'>
                          {site.services.map(service => (
                            <span
                              key={service}
                              className='inline-flex px-2 py-1 text-xs font-medium bg-shadow-lavender/10 text-shadow-lavender rounded-full'
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      {site.status === OperatingSiteStatus.Active && (
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                          <div className='text-center p-3 bg-gray-50 rounded-lg'>
                            <p className='text-sm text-gray-600'>Revenue</p>
                            <p className='text-lg font-semibold text-gray-900'>
                              {site.revenue}
                            </p>
                          </div>
                          <div className='text-center p-3 bg-gray-50 rounded-lg'>
                            <p className='text-sm text-gray-600'>Bookings</p>
                            <p className='text-lg font-semibold text-gray-900'>
                              {site.bookings}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className='flex gap-2'>
                        <Button
                          variant='ghost'
                          className='flex-1 border border-gray-300 hover:bg-gray-50'
                        >
                          <Eye className='w-4 h-4 mr-2' />
                          View Details
                        </Button>
                        <Button
                          variant='ghost'
                          className='flex-1 border border-gray-300 hover:bg-gray-50'
                        >
                          <Edit3 className='w-4 h-4 mr-2' />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='col-span-full text-center py-12'>
                    <Building2 className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-500 text-lg'>
                      No operating sites found
                    </p>
                    <p className='text-gray-400 text-sm'>
                      Add your first location to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
