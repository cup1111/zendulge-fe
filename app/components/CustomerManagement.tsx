import {
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  Users as UsersIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import CompanyService from '~/services/companyService';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  active: boolean;
}

interface CustomerManagementProps {
  companyId: string;
}

export default function CustomerManagement({
  companyId,
}: CustomerManagementProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomers() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await CompanyService.getCustomers(companyId);
        setCustomers(data);
      } catch (err) {
        setError('Failed to load customers');
      } finally {
        setIsLoading(false);
      }
    }

    if (companyId) {
      loadCustomers();
    }
  }, [companyId]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='w-8 h-8 animate-spin text-shadow-lavender' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <p className='text-red-600'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-shadow-lavender mb-2'>
              Customers
            </h2>
            <p className='text-gray-600'>
              Manage your company&apos;s customers
            </p>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <UsersIcon className='w-4 h-4' />
            <span>{customers.length} Customers</span>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
        {customers.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Phone
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {customers.map(customer => (
                  <tr key={customer.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='w-10 h-10 rounded-full bg-shadow-lavender/10 flex items-center justify-center mr-3'>
                          <span className='text-shadow-lavender font-medium'>
                            {customer.firstName[0]}
                            {customer.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {customer.firstName} {customer.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center text-sm text-gray-900'>
                        <Mail className='w-4 h-4 mr-2 text-gray-400' />
                        {customer.email}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {customer.phoneNumber ? (
                        <div className='flex items-center text-sm text-gray-900'>
                          <Phone className='w-4 h-4 mr-2 text-gray-400' />
                          {customer.phoneNumber}
                        </div>
                      ) : (
                        <span className='text-sm text-gray-400'>N/A</span>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          customer.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {customer.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='text-shadow-lavender hover:bg-shadow-lavender/10'
                              aria-label={`Email ${customer.firstName} ${customer.lastName}`}
                              onClick={() => {
                                window.location.href = `mailto:${customer.email}`;
                              }}
                            >
                              <Mail className='w-4 h-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Email Customer</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-center py-12'>
            <UsersIcon className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500 text-lg'>No customers found</p>
            <p className='text-gray-400 text-sm mt-1'>
              Customers will appear here once added to your company
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
