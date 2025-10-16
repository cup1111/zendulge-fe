import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Edit3,
  Eye,
  Filter,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Settings,
  Shield,
  Star,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { Button } from '~/components/ui/button';
import { API_CONFIG, buildApiUrl } from '~/config/api';
import { useAuth } from '~/contexts/AuthContext';
import {
  mockActiveDeals,
  mockBusinessStats,
  mockBusinessUsers,
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

interface BusinessUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  lastActive: string;
  avatar: string;
}

interface OperatingSite {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'opening_soon';
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

// Get auth token from localStorage
const getAuthToken = () =>
  localStorage.getItem('accessToken') ?? localStorage.getItem('token');

async function fetchBusinessStats(): Promise<BusinessStats> {
  // Since there's no dedicated stats endpoint, we'll use mock data
  // In a real scenario, you'd calculate these from other endpoints
  console.warn('No stats endpoint available, using mock data');
  return mockBusinessStats;
}

async function fetchBusinessUsers(): Promise<BusinessUser[]> {
  // The backend doesn't have a dedicated users endpoint for business management
  // You'd need to create one or fetch from company/user relationships
  console.warn('No business users endpoint available, using mock data');
  return mockBusinessUsers;
}

async function fetchOperatingSites(
  companyId: string
): Promise<OperatingSite[]> {
  if (!companyId) {
    throw new Error('Company ID is required to fetch operating sites');
  }

  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Only add Authorization header if we have a token (development bypass allows no token)
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    buildApiUrl(API_CONFIG.endpoints.company.operateSites(companyId)),
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch operating sites: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();
  console.log('Backend operating sites response:', result);

  // Transform backend data to match frontend interface
  const sites = result.data.operateSites.map((site: any) => ({
    // eslint-disable-next-line no-underscore-dangle
    id: site._id,
    name: site.name,
    address: site.address,
    phone: site.phoneNumber,
    email: site.emailAddress,
    status: site.isActive ? 'active' : 'inactive',
    manager: 'To be assigned', // Backend doesn't have manager field yet
    services: ['To be configured'], // Backend doesn't have services field yet
    hours: formatOperatingHours(site.operatingHours),
    revenue: '$0', // Backend doesn't track revenue yet
    bookings: 0, // Backend doesn't track bookings yet
  }));

  return sites;
}

// Helper function to format operating hours
function formatOperatingHours(hours: any): string {
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
  const todayHours = hours[todayName];

  if (todayHours?.isClosed) {
    return 'Closed today';
  }

  return `${todayHours?.open || '09:00'} - ${todayHours?.close || '17:00'}`;
}

async function fetchRecentBookings(): Promise<RecentBooking[]> {
  // Backend doesn't have booking system yet
  console.warn('No booking endpoint available, using mock data');
  return mockRecentBookings;
}

async function fetchActiveDeals(): Promise<ActiveDeal[]> {
  // Backend doesn't have deals system yet
  console.warn('No deals endpoint available, using mock data');
  return mockActiveDeals;
}

async function fetchRecentActivity(): Promise<RecentActivity[]> {
  // Backend doesn't have activity tracking yet
  console.warn('No activity endpoint available, using mock data');
  return mockRecentActivity;
}

export default function BusinessManagement() {
  const { user, currentCompany, isAuthenticated, isLoading } = useAuth();
  const [businessStats, setBusinessStats] = useState<BusinessStats | null>(
    null
  );
  const [businessUsers, setBusinessUsers] = useState<BusinessUser[]>([]);
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

        // Ensure we have a current company selected
        if (!currentCompany) {
          throw new Error('No company selected');
        }

        // Fetch operating sites from real backend (REQUIRED)
        const sitesData = await fetchOperatingSites(currentCompany.id);
        setOperatingSites(sitesData);

        // Fetch other data (using mock data where endpoints don't exist yet)
        const [statsData, usersData, bookingsData, dealsData, activityData] =
          await Promise.all([
            fetchBusinessStats(),
            fetchBusinessUsers(),
            fetchRecentBookings(),
            fetchActiveDeals(),
            fetchRecentActivity(),
          ]);

        setBusinessStats(statsData);
        setBusinessUsers(usersData);
        setRecentBookings(bookingsData);
        setActiveDeals(dealsData);
        setRecentActivity(activityData);
      } catch (err) {
        // Show real errors for backend connectivity issues
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Backend connection failed: ${errorMessage}`);
        console.error('Backend API error:', err);
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, [user, currentCompany, isAuthenticated, isLoading]); // Re-run when auth state changes

  if (isLoading || dataLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin text-shadow-lavender mx-auto mb-4' />
          <p className='text-gray-600'>Loading business management data...</p>
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
            onClick={() => window.location.reload()}
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
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className='bg-blue-50 border-b border-blue-200 px-4 py-2'>
          <div className='max-w-7xl mx-auto'>
            <p className='text-blue-800 text-sm'>
              <strong>Backend Status:</strong> Operating Sites from real API ✅
              | Stats, Users, Bookings, Deals, Activity using mock data
              (endpoints not implemented yet)
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
                Business Management Dashboard
              </h1>
              <p className='text-gray-600'>
                Manage your business, deals, and bookings all in one place
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
                    className={`text-sm ${businessStats?.revenueGrowth && businessStats.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}
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
                    className={`text-sm ${businessStats?.bookingsGrowth && businessStats.bookingsGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}
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
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                booking.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
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
                            <Button variant='ghost' size='sm'>
                              <Edit3 className='w-3 h-3' />
                            </Button>
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
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                deal.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : deal.status === 'expiring'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
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

      {/* Users Management Section */}
      <section className='py-8 border-t border-gray-200 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-2xl font-bold text-shadow-lavender mb-2'>
                  Business Users
                </h2>
                <p className='text-gray-600'>
                  Manage staff members and their access permissions
                </p>
              </div>
              <Button className='bg-shadow-lavender hover:bg-shadow-lavender/90'>
                <Plus className='w-4 h-4 mr-2' />
                Add User
              </Button>
            </div>

            <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        User
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Role
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Contact
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Last Active
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {businessUsers.length > 0 ? (
                      businessUsers.map(user => (
                        <tr key={user.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='w-10 h-10 bg-shadow-lavender/10 rounded-full flex items-center justify-center'>
                                <span className='text-sm font-medium text-shadow-lavender'>
                                  {user.avatar}
                                </span>
                              </div>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {user.name}
                                </div>
                                <div className='text-sm text-gray-500'>
                                  ID: #{user.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <Shield className='w-4 h-4 mr-2 text-gray-400' />
                              <span className='text-sm text-gray-900'>
                                {user.role}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='space-y-1'>
                              <div className='flex items-center text-sm text-gray-900'>
                                <Mail className='w-3 h-3 mr-2 text-gray-400' />
                                {user.email}
                              </div>
                              <div className='flex items-center text-sm text-gray-500'>
                                <Phone className='w-3 h-3 mr-2 text-gray-400' />
                                {user.phone}
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                user.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <UserCheck className='w-3 h-3 mr-1' />
                              {user.status}
                            </span>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {user.lastActive}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                            <div className='flex items-center justify-end space-x-2'>
                              <Button variant='ghost' size='sm'>
                                <Eye className='w-4 h-4' />
                              </Button>
                              <Button variant='ghost' size='sm'>
                                <Edit3 className='w-4 h-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-red-600 hover:text-red-700'
                              >
                                <Trash2 className='w-4 h-4' />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className='px-6 py-8 text-center'>
                          <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                          <p className='text-gray-500'>No users found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Sites Section */}
      <section className='py-8 border-t border-gray-200 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
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
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              site.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : site.status === 'opening_soon'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {site.status.replace('_', ' ')}
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
                        {site.services.map((service, index) => (
                          <span
                            key={index}
                            className='inline-flex px-2 py-1 text-xs font-medium bg-shadow-lavender/10 text-shadow-lavender rounded-full'
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {site.status === 'active' && (
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

      {/* Business Info Section */}
      <section className='py-8 border-t border-gray-200 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h2 className='text-2xl font-bold text-shadow-lavender mb-4'>
                Business Profile
              </h2>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <MapPin className='w-5 h-5 text-gray-400' />
                  <div>
                    <p className='font-medium text-gray-900'>
                      Zen Spa & Wellness
                    </p>
                    <p className='text-sm text-gray-600'>
                      123 Wellness Street, San Francisco, CA 94110
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <Clock className='w-5 h-5 text-gray-400' />
                  <div>
                    <p className='font-medium text-gray-900'>Business Hours</p>
                    <p className='text-sm text-gray-600'>
                      Mon-Fri: 9:00 AM - 8:00 PM, Sat-Sun: 10:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <Bell className='w-5 h-5 text-gray-400' />
                  <div>
                    <p className='font-medium text-gray-900'>Notifications</p>
                    <p className='text-sm text-gray-600'>
                      Email and SMS notifications enabled
                    </p>
                  </div>
                </div>
              </div>
              <div className='mt-6'>
                <Button
                  variant='ghost'
                  className='border border-gray-300 hover:bg-gray-50'
                >
                  <Edit3 className='w-4 h-4 mr-2' />
                  Edit Business Profile
                </Button>
              </div>
            </div>

            <div>
              <h2 className='text-2xl font-bold text-shadow-lavender mb-4'>
                Recent Activity
              </h2>
              <div className='space-y-3'>
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className='p-3 bg-gray-50 rounded-lg'>
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
          </div>
        </div>
      </section>
    </div>
  );
}
