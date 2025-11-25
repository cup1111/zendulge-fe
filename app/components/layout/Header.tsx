import { Building2, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';

import DealDialog from '~/components/DealDialog';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu';
import { BusinessUserRole } from '~/constants/enums';
import { useAuth } from '~/hooks/useAuth';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, currentBusiness, businesses, setCurrentBusiness } = useAuth();

  // 静态展示：模拟已登录用户 (fallback for demo)
  const isAuthenticated = !!user;
  const displayUser = user ?? {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@zendulge.com',
    role: { name: 'Super Admin', slug: 'super_admin', id: '1' },
  };

  const authContext = useAuth();

  const handleSignOut = () => {
    authContext.logout();
  };

  const handleLinkToProfile = () => {
    navigate('/profile');
  };
  return (
    <header className='fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link to='/' className='flex items-center'>
              <img
                src='/assets/app-icon.png'
                alt='Zendulge Logo'
                className='w-8 h-8 mr-3 rounded-lg'
                onError={e => {
                  // 如果图片加载失败，显示渐变色方块
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget
                    .nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                className='w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center mr-3'
                style={{ display: 'none' }}
              >
                <span className='text-white font-bold text-xl'>Z</span>
              </div>
              <span className='text-xl font-bold text-shadow-lavender'>
                Zendulge
              </span>
            </Link>

            {/* Create Deal Button - Next to Logo */}
            {currentBusiness?.id && (
              <DealDialog
                businessId={currentBusiness.id}
                trigger={
                  <Button className='ml-6 bg-shadow-lavender hover:bg-shadow-lavender/90 text-white font-bold font-montserrat cursor-pointer'>
                    Create Deal
                  </Button>
                }
              />
            )}

            {/* Browse Deals - After Create Deal */}
            <Link
              to='/'
              className={`ml-6 text-shadow-lavender hover:opacity-80 transition-colors font-bold font-montserrat ${
                location.pathname === '/customer' ? 'opacity-80' : ''
              }`}
            >
              Browse Deals (WIP)
            </Link>

            {/* Business Dropdown Menu - After Browse Deals */}
            {isAuthenticated && businesses.length > 0 && (
              <DropdownMenu>
                <div
                  className={`ml-6 text-shadow-lavender hover:opacity-80 transition-colors font-bold font-montserrat cursor-pointer flex items-center ${
                    location.pathname === '/business-dashboard' ||
                    location.pathname === '/business-management' ||
                    location.pathname === '/user-management'
                      ? 'opacity-80'
                      : ''
                  }`}
                >
                  Business
                  <ChevronDown className='ml-1 h-4 w-4' />
                </div>
                <DropdownMenuContent align='start'>
                  <DropdownMenuItem>
                    <Link
                      to='/business-dashboard'
                      className={`w-full ${
                        location.pathname === '/business-dashboard'
                          ? 'bg-gray-100'
                          : ''
                      }`}
                    >
                      Dashboard (WIP)
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to='/business-management'
                      className={`w-full ${
                        location.pathname === '/business-management'
                          ? 'bg-gray-100'
                          : ''
                      }`}
                    >
                      Business Management
                    </Link>
                  </DropdownMenuItem>
                  {(user?.role?.slug === BusinessUserRole.Owner ||
                    user?.role?.slug === BusinessUserRole.Manager) && (
                    <DropdownMenuItem>
                      <Link
                        to='/user-management'
                        className={`w-full ${
                          location.pathname === '/user-management'
                            ? 'bg-gray-100'
                            : ''
                        }`}
                      >
                        User Management
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Navigation Links */}
          <nav className='flex space-x-8 ml-12'>
            {/* Navigation content can be added here if needed */}
          </nav>

          {/* Business Selector (if user has multiple businesses) */}
          {isAuthenticated && businesses.length > 1 && (
            <div className='flex items-center space-x-2'>
              <Building2 className='w-4 h-4 text-shadow-lavender' />
              <DropdownMenu>
                <Button variant='ghost' className='text-shadow-lavender'>
                  {currentBusiness?.name ?? 'Select Business'}
                  <ChevronDown className='ml-1 h-4 w-4' />
                </Button>

                <DropdownMenuContent align='end'>
                  {businesses.map(business => (
                    <DropdownMenuItem
                      key={business.id}
                      onClick={() => setCurrentBusiness(business)}
                      className={
                        currentBusiness?.id === business.id ? 'bg-gray-100' : ''
                      }
                    >
                      {business.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Right Side Actions */}
          <div className='flex items-center space-x-4'>
            {/* Help Link */}
            <Link
              to='/help'
              className={`text-shadow-lavender hover:opacity-80 transition-colors font-bold font-montserrat ${
                location.pathname === '/help' ? 'opacity-80' : ''
              }`}
            >
              Help (WIP)
            </Link>

            {!isAuthenticated ? (
              <>
                <Button variant='secondary' asChild>
                  <Link to='/login'>Sign In</Link>
                </Button>
                <Button variant='default' asChild>
                  <Link to='/customer-registration'>Sign Up</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <div className='flex items-center space-x-2 cursor-pointer'>
                  <div className='w-8 h-8 bg-shadow-lavender rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm font-bold'>
                      {displayUser.firstName?.charAt(0) ?? 'U'}
                      {displayUser.lastName?.charAt(0) ?? ''}
                    </span>
                  </div>
                  <ChevronDown className='w-4 h-4 text-shadow-lavender' />
                </div>
                <DropdownMenuContent align='end' className='mt-2 z-50'>
                  <div className='px-2 py-1.5 border-b border-gray-200'>
                    <div className='text-sm font-semibold text-gray-900'>
                      {displayUser.firstName
                        ? `${displayUser.firstName} ${displayUser.lastName ?? ''}`.trim()
                        : displayUser.email}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {displayUser.email}
                    </div>
                  </div>
                  <DropdownMenuItem onClick={handleLinkToProfile}>
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
