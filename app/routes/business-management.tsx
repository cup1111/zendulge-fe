import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import CustomerManagement from '~/components/CustomerManagement';
import DealManagement from '~/components/DealManagement';
import ServiceManagement from '~/components/ServiceManagement';
import { Button } from '~/components/ui/button';
import { API_CONFIG } from '~/config/api';
import zendulgeAxios from '~/config/axios';
import { BusinessStatus } from '~/constants/businessStatus';
import { BusinessUserRole, OperatingSiteStatus } from '~/constants/enums';
import { useAuth } from '~/hooks/useAuth';
import BusinessService, { type BusinessInfo } from '~/services/businessService';

import SiteManagement from '../components/SiteManagement';

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
  businessId: string
): Promise<OperatingSite[]> {
  if (!businessId) {
    throw new Error('Business ID is required to fetch operating sites');
  }

  const response = await zendulgeAxios.get(
    API_CONFIG.endpoints.business.operateSites(businessId)
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
  const { user, currentBusiness, isAuthenticated, isLoading } = useAuth();
  const [operatingSites, setOperatingSites] = useState<OperatingSite[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
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

        // Ensure we have a current business selected
        if (!currentBusiness?.id) {
          // Don't throw error, just wait for business to be available
          setDataLoading(false);
          return;
        }

        const businessIdString = currentBusiness.id;

        // Fetch business info to check active status
        const businessData =
          await BusinessService.getBusinessInfo(businessIdString);
        setBusinessInfo(businessData);

        // Fetch operating sites from real backend
        const sitesData = await fetchOperatingSites(businessIdString);
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
  }, [isLoading, isAuthenticated, user, currentBusiness?.id]); // Re-run when auth state or business changes

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

  // Block access if business is disabled
  if (businessInfo && businessInfo.status === BusinessStatus.DISABLED) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center p-6 max-w-md'>
          <p className='text-gray-800 text-lg font-semibold mb-2'>
            ⚠️ Business Disabled
          </p>
          <p className='text-gray-600 mb-4'>
            Your business is currently disabled. Please contact us to reactivate
            your business.
          </p>
        </div>
      </div>
    );
  }

  // Determine status indicator styling
  const getStatusIndicatorClass = () => {
    if (!businessInfo || businessInfo.status === BusinessStatus.ACTIVE) {
      return 'bg-blue-50 border-blue-200';
    }
    if (businessInfo.status === BusinessStatus.DISABLED) {
      return 'bg-gray-50 border-gray-300';
    }
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Business Status & Backend Status Indicator */}
      <div className={`border-b px-4 py-2 ${getStatusIndicatorClass()}`}>
        <div className='max-w-7xl mx-auto'>
          {businessInfo && businessInfo.status === BusinessStatus.PENDING && (
            <p className='text-red-800 text-sm font-semibold'>
              ⚠️ <strong>Verification in Progress:</strong> Your business
              details are being verified. Deals are temporarily hidden from
              customers until verification is complete. We&apos;ll notify you
              once verified.
            </p>
          )}
          {businessInfo && businessInfo.status === BusinessStatus.DISABLED && (
            <p className='text-gray-800 text-sm font-semibold'>
              ⚠️ <strong>Business Disabled:</strong> Your business is currently
              disabled. Please contact us to reactivate your business.
            </p>
          )}
          {businessInfo &&
            businessInfo.status === BusinessStatus.ACTIVE &&
            process.env.NODE_ENV === 'development' && (
              <p className='text-blue-800 text-sm'>
                <strong>Backend Status:</strong> Operating Sites from real API
                ✅ | Service Management integrated ✅
              </p>
            )}
        </div>
      </div>

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
            {currentBusiness?.id && (
              <CustomerManagement businessId={currentBusiness.id} />
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
            {currentBusiness?.id && (
              <ServiceManagement businessId={currentBusiness.id} />
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
            {currentBusiness?.id && (
              <DealManagement businessId={currentBusiness.id} />
            )}
          </div>
        </section>
      )}

      {/* Operating Sites Section (for owners and managers) */}
      {(user?.role?.slug === BusinessUserRole.Owner ||
        user?.role?.slug === BusinessUserRole.Manager) && (
        <section className='py-8 border-t border-gray-200 bg-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {currentBusiness?.id && (
              <SiteManagement businessId={currentBusiness.id} />
            )}
          </div>
        </section>
      )}
    </div>
  );
}
