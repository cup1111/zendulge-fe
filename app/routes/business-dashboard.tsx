import {
  BarChart3,
  Bell,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Filter,
  Loader2,
  Plus,
  Settings,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { Button } from '~/components/ui/button';
import { API_CONFIG } from '~/config/api';
import zendulgeAxios from '~/config/axios';
import { OperatingSiteStatus } from '~/constants/enums';
import { useAuth } from '~/contexts/AuthContext';
import {
  mockActiveDeals,
  mockBusinessStats,
  mockRecentActivity,
  mockRecentBookings,
} from '~/lib/mockData';

// Types for our data
interface BusinessStats {
  totalRevenue: number;
  revenueGrowth: number;
  totalBookings: number;
  bookingsGrowth: number;
  activeDeals: number;
  expiringDeals: number;
  customerRating: number;
  reviewCount: number;
}

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

interface RecentBooking {
  id: number;
  customer: string;
  service: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: string;
}

interface ActiveDeal {
  id: number;
  title: string;
  timeSlot: string;
  bookings: number;
  status: 'active' | 'expiring' | 'inactive';
}

interface RecentActivity {
  action: string;
  details: string;
  time: string;
}

async function fetchBusinessStats(): Promise<BusinessStats> {
  // Since there's no dedicated stats endpoint, we'll use mock data
  // In a real scenario, you'd calculate these from other endpoints
  return mockBusinessStats;
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

async function fetchRecentBookings(): Promise<RecentBooking[]> {
  // Backend doesn't have booking system yet
  return mockRecentBookings;
}

async function fetchActiveDeals(): Promise<ActiveDeal[]> {
  // Backend doesn't have deals system yet
  return mockActiveDeals;
}

async function fetchRecentActivity(): Promise<RecentActivity[]> {
  // Backend doesn't have activity tracking yet
  return mockRecentActivity;
}

export default function BusinessDashboard() {
  const { user, currentBusiness, isAuthenticated, isLoading } = useAuth();
  const [businessStats, setBusinessStats] = useState<BusinessStats | null>(
    null
  );

  const [operatingSites, setOperatingSites] = useState<OperatingSite[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [activeDeals, setActiveDeals] = useState<ActiveDeal[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
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

        // Fetch operating sites from real backend (REQUIRED)
        const sitesData = await fetchOperatingSites(businessIdString);
        setOperatingSites(sitesData);

        // Fetch other data (using mock data where endpoints don't exist yet)
        const [statsData, bookingsData, dealsData, activityData] =
          await Promise.all([
            fetchBusinessStats(),
            fetchRecentBookings(),
            fetchActiveDeals(),
            fetchRecentActivity(),
          ]);

        setBusinessStats(statsData);
        setRecentBookings(bookingsData);
        setActiveDeals(dealsData);
        setRecentActivity(activityData);
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
          <p className='text-gray-600'>Loading dashboard data...</p>
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

  if (operatingSites.length === 0) {
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
              | Stats, Bookings, Deals, Activity using mock data (endpoints not
              implemented yet)
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
                Business Dashboard
              </h1>
              <p className='text-gray-600'>
                Monitor your business performance and key metrics
              </p>
            </div>
            <div className='mt-4 md:mt-0 flex gap-3'>
              <Button className='bg-shadow-lavender hover:bg-shadow-lavender/90'>
                <Plus className='w-4 h-4 mr-2' />
                Create Deal
              </Button>
              <Button
                variant='ghost'
                className='border border-gray-300 hover:bg-gray-50'
              >
                <Download className='w-4 h-4 mr-2' />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className='py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <div className='bg-white p-6 rounded-lg border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Total Revenue</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    ${businessStats?.totalRevenue.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm ${
                      businessStats?.revenueGrowth &&
                      businessStats.revenueGrowth > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {businessStats?.revenueGrowth &&
                    businessStats.revenueGrowth > 0
                      ? '+'
                      : ''}
                    {businessStats?.revenueGrowth ?? 0}% from last month
                  </p>
                </div>
                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                  <DollarSign className='w-6 h-6 text-green-600' />
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Total Bookings</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {businessStats?.totalBookings}
                  </p>
                  <p
                    className={`text-sm ${
                      businessStats?.bookingsGrowth &&
                      businessStats.bookingsGrowth > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {businessStats?.bookingsGrowth &&
                    businessStats.bookingsGrowth > 0
                      ? '+'
                      : ''}
                    {businessStats?.bookingsGrowth ?? 0}% from last month
                  </p>
                </div>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <Calendar className='w-6 h-6 text-blue-600' />
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Active Deals</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {businessStats?.activeDeals}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {businessStats?.expiringDeals} expiring soon
                  </p>
                </div>
                <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                  <TrendingUp className='w-6 h-6 text-purple-600' />
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Customer Rating</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {businessStats?.customerRating}
                  </p>
                  <p className='text-sm text-gray-500'>
                    Based on {businessStats?.reviewCount} reviews
                  </p>
                </div>
                <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center'>
                  <Star className='w-6 h-6 text-yellow-600' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className='pb-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Recent Bookings */}
            <div className='lg:col-span-2'>
              <div className='bg-white rounded-lg border border-gray-200'>
                <div className='p-6 border-b border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold text-gray-900'>
                      Recent Bookings
                    </h2>
                    <div className='flex gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='border border-gray-300 hover:bg-gray-50'
                      >
                        <Filter className='w-4 h-4 mr-2' />
                        Filter
                      </Button>
                      <Link to='/bookings'>
                        <Button variant='ghost' size='sm'>
                          View All
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='p-6'>
                  <div className='space-y-4'>
                    {recentBookings.length > 0 ? (
                      recentBookings.map(booking => (
                        <div
                          key={booking.id}
                          className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
                        >
                          <div className='flex items-center space-x-4'>
                            <div className='w-10 h-10 bg-shadow-lavender/10 rounded-full flex items-center justify-center'>
                              <Users className='w-5 h-5 text-shadow-lavender' />
                            </div>
                            <div>
                              <p className='font-medium text-gray-900'>
                                {booking.customer}
                              </p>
                              <p className='text-sm text-gray-600'>
                                {booking.service}
                              </p>
                              <p className='text-sm text-gray-500'>
                                {booking.date}
                              </p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className='font-semibold text-gray-900'>
                              {booking.amount}
                            </p>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${(() => {
                                if (booking.status === 'confirmed')
                                  return 'bg-green-100 text-green-800';
                                if (booking.status === 'pending')
                                  return 'bg-yellow-100 text-yellow-800';
                                return 'bg-red-100 text-red-800';
                              })()}`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='text-center py-8'>
                        <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                        <p className='text-gray-500'>
                          No recent bookings found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Active Deals */}
            <div className='space-y-8'>
              {/* Quick Actions */}
              <div className='bg-white rounded-lg border border-gray-200'>
                <div className='p-6 border-b border-gray-200'>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    Quick Actions
                  </h2>
                </div>
                <div className='p-6'>
                  <div className='space-y-3'>
                    <Button className='w-full justify-start bg-shadow-lavender hover:bg-shadow-lavender/90'>
                      <Plus className='w-4 h-4 mr-3' />
                      Create New Deal
                    </Button>
                    <Button
                      variant='ghost'
                      className='w-full justify-start border border-gray-300 hover:bg-gray-50'
                    >
                      <Calendar className='w-4 h-4 mr-3' />
                      Manage Calendar
                    </Button>
                    <Button
                      variant='ghost'
                      className='w-full justify-start border border-gray-300 hover:bg-gray-50'
                    >
                      <Settings className='w-4 h-4 mr-3' />
                      Business Settings
                    </Button>
                    <Button
                      variant='ghost'
                      className='w-full justify-start border border-gray-300 hover:bg-gray-50'
                    >
                      <BarChart3 className='w-4 h-4 mr-3' />
                      View Analytics
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Deals */}
              <div className='bg-white rounded-lg border border-gray-200'>
                <div className='p-6 border-b border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold text-gray-900'>
                      Active Deals
                    </h2>
                    <Link to='/deals'>
                      <Button variant='ghost' size='sm'>
                        View All
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className='p-6'>
                  <div className='space-y-4'>
                    {activeDeals.length > 0 ? (
                      activeDeals.map(deal => (
                        <div
                          key={deal.id}
                          className='p-4 bg-gray-50 rounded-lg'
                        >
                          <div className='flex items-start justify-between mb-2'>
                            <h3 className='font-medium text-gray-900 text-sm'>
                              {deal.title}
                            </h3>
                          </div>
                          <div className='flex items-center text-xs text-gray-600 mb-2'>
                            <Clock className='w-3 h-3 mr-1' />
                            {deal.timeSlot}
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-xs text-gray-600'>
                              {deal.bookings} bookings
                            </span>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${(() => {
                                if (deal.status === 'active')
                                  return 'bg-green-100 text-green-800';
                                if (deal.status === 'expiring')
                                  return 'bg-orange-100 text-orange-800';
                                return 'bg-gray-100 text-gray-800';
                              })()}`}
                            >
                              {deal.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='text-center py-8'>
                        <TrendingUp className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                        <p className='text-gray-500'>No active deals found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className='py-8 border-t border-gray-200 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h2 className='text-2xl font-bold text-shadow-lavender mb-4'>
                Recent Activity
              </h2>
              <div className='space-y-3'>
                {recentActivity.length > 0 ? (
                  recentActivity.map(activity => (
                    <div
                      key={`${activity.action}-${activity.time}`}
                      className='p-3 bg-gray-50 rounded-lg'
                    >
                      <p className='font-medium text-gray-900 text-sm'>
                        {activity.action}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {activity.details}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        {activity.time}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-8'>
                    <Bell className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-500'>No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className='text-2xl font-bold text-shadow-lavender mb-4'>
                Quick Stats
              </h2>
              <div className='space-y-4'>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-600'>Operating Sites</p>
                      <p className='text-2xl font-bold text-gray-900'>
                        {operatingSites.length}
                      </p>
                    </div>
                    <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                      <BarChart3 className='w-6 h-6 text-blue-600' />
                    </div>
                  </div>
                </div>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-600'>Active Sites</p>
                      <p className='text-2xl font-bold text-gray-900'>
                        {
                          operatingSites.filter(
                            site => site.status === OperatingSiteStatus.Active
                          ).length
                        }
                      </p>
                    </div>
                    <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                      <TrendingUp className='w-6 h-6 text-green-600' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
