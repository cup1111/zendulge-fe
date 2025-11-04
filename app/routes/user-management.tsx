import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import UserManagement from '~/components/UserManagement';
import { BusinessUserRole } from '~/constants/enums';
import { useAuth } from '~/contexts/AuthContext';

export default function UserManagementPage() {
  const { user, currentCompany, isAuthenticated, isLoading } = useAuth();
  const [error] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin text-shadow-lavender mx-auto mb-4' />
          <p className='text-gray-600'>Loading user management...</p>
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
            You don't have permission to access this page
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
          {currentCompany?.id && user?.id && (
            <UserManagement
              companyId={currentCompany.id}
              excludeUserId={user.id}
            />
          )}
        </div>
      </section>
    </div>
  );
}
