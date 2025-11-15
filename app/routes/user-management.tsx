import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';
import UserManagement from '~/components/UserManagement';
import { BusinessStatus } from '~/constants/businessStatus';
import { BusinessUserRole } from '~/constants/enums';
import { useAuth } from '~/contexts/AuthContext';
import BusinessService, { type BusinessInfo } from '~/services/businessService';

export default function UserManagementPage() {
  const { user, currentBusiness, isAuthenticated, isLoading } = useAuth();
  const [error] = useState<string | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [businessLoading, setBusinessLoading] = useState(true);

  useEffect(() => {
    async function loadBusinessInfo() {
      if (!currentBusiness?.id) {
        setBusinessLoading(false);
        return;
      }

      try {
        const data = await BusinessService.getBusinessInfo(currentBusiness.id);
        setBusinessInfo(data);
      } catch (err) {
        // Ignore errors for now
      } finally {
        setBusinessLoading(false);
      }
    }

    loadBusinessInfo();
  }, [currentBusiness?.id]);

  if (isLoading || businessLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin text-shadow-lavender mx-auto mb-4' />
          <p className='text-gray-600'>Loading user management...</p>
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

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>Please log in to access this page</p>
          <Button
            onClick={() => {
              window.location.href = '/login';
            }}
            className='bg-shadow-lavender hover:bg-shadow-lavender/90'
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Check if user has permission (Owner or Manager only)
  if (
    user?.role?.slug !== BusinessUserRole.Owner &&
    user?.role?.slug !== BusinessUserRole.Manager
  ) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>
            You don&apos;t have permission to access this page
          </p>
          <p className='text-gray-600 text-sm'>
            Only Owners and Managers can manage users
          </p>
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

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Section */}
      <section className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-shadow-lavender mb-2'>
                User Management
              </h1>
              <p className='text-gray-600'>
                Manage your team members and their access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Management Section */}
      <section className='py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {currentBusiness?.id && user?.id && (
            <UserManagement
              businessId={currentBusiness.id}
              excludeUserId={user.id}
            />
          )}
        </div>
      </section>
    </div>
  );
}
