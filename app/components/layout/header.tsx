import { Building2, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu';
import { useAuth } from '~/contexts/AuthContext';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, currentCompany, companies, setCurrentCompany } = useAuth();

  // 静态展示：模拟已登录用户 (fallback for demo)
  const isAuthenticated = !!user;
  const displayUser = user ?? {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@zendulge.com',
    role: { name: 'Super Admin', slug: 'super_admin', id: '1' },
  };

  // context useCOntext = useAuth()
  // 1. I need to get the context
  // 2. you need use a variable call useContext with useAuth function

  // 需要意识到这个问题，这是我惯用的思维模式，最好在写之前想清楚，或者是想明白自己在想什么
  // 先意识到，然后想办法改正

  // I need to create a variable call authContext which uses the useAuth hook
  // 1. create a var const/let keyword + variable name +
  // 2.. If you see there is use keywork this is a hook
  // 3. normal function that has no 'use' at front cannot use useState or other hooks inside
  const authContext = useAuth();

  const handleSignOut = () => {
    authContext.logout();
  };
  // 把这个handleSignOut 函数放到sign out Button的onclick变量上
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
            <Button
              className='ml-6 bg-shadow-lavender hover:bg-shadow-lavender/90 text-white font-bold font-montserrat'
              onClick={() => navigate('/create-deal')}
            >
              Create Deal
            </Button>

            {/* Browse Deals - After Create Deal */}
            <Link
              to='/'
              className={`ml-6 text-shadow-lavender hover:opacity-80 transition-colors font-bold font-montserrat ${
                location.pathname === '/customer' ? 'opacity-80' : ''
              }`}
            >
              Browse Deals
            </Link>

            {/* Business Dropdown Menu - After Browse Deals */}
            {isAuthenticated && (
              <DropdownMenu>
                <div
                  className={`ml-6 text-shadow-lavender hover:opacity-80 transition-colors font-bold font-montserrat cursor-pointer flex items-center ${
                    location.pathname === '/business-dashboard' ||
                    location.pathname === '/business-management'
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
                      Dashboard
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
                      Management
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Navigation Links */}
          <nav className='flex space-x-8 ml-12'>
            {/* Navigation content can be added here if needed */}
          </nav>

          {/* Company Selector (if user has multiple companies) */}
          {isAuthenticated && companies.length > 1 && (
            <div className='flex items-center space-x-2'>
              <Building2 className='w-4 h-4 text-shadow-lavender' />
              <DropdownMenu>
                <Button variant='ghost' className='text-shadow-lavender'>
                  {currentCompany?.name ?? 'Select Company'}
                  <ChevronDown className='ml-1 h-4 w-4' />
                </Button>

                <DropdownMenuContent align='end'>
                  {companies.map(company => (
                    <DropdownMenuItem
                      key={company.id}
                      onClick={() => setCurrentCompany(company)}
                      className={
                        currentCompany?.id === company.id ? 'bg-gray-100' : ''
                      }
                    >
                      {company.name}
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
              Help
            </Link>

            {!isAuthenticated ? (
              <>
                <Button variant='secondary'>
                  <Link to='/login'>Sign In</Link>
                </Button>
                <Button variant='default'>
                  <Link to='/signup'>Sign Up</Link>
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
