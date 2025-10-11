import { Link, useLocation } from "react-router";
import { Users } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function Header() {
  const location = useLocation();
  
  // 静态展示：模拟已登录用户
  const isAuthenticated = false;
  const user = {
    firstName: "Demo",
    lastName: "User",
    email: "demo@zendulge.com",
    role: "super_admin" as const,
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/assets/app-icon.png" 
                alt="Zendulge Logo" 
                className="w-8 h-8 mr-3 rounded-lg"
                onError={(e) => {
                  // 如果图片加载失败，显示渐变色方块
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div 
                className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center mr-3"
                style={{ display: 'none' }}
              >
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="text-xl font-bold text-shadow-lavender">
                Zendulge
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-8 ml-12">
            <Link
              to="/"
              className={`text-shadow-lavender hover:opacity-80 transition-colors font-bold font-montserrat ${
                location.pathname === '/customer' ? 'opacity-80' : ''
              }`}
            >
              For Customer
            </Link>

            <Link
              to="/business"
              className={`text-shadow-lavender hover:opacity-80 transition-colors font-bold font-montserrat ${
                location.pathname === '/business' ? 'opacity-80' : ''
              }`}
            >
              For Business
            </Link>

            <Link
              to="/help"
              className={`text-shadow-lavender hover:opacity-80 transition-colors font-bold font-montserrat ${
                location.pathname === '/help' ? 'opacity-80' : ''
              }`}
            >
              Help
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button variant="secondary">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="default">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                </span>

                {user.role && (
                  <span className="px-2 py-1 text-xs font-medium bg-shadow-lavender text-white rounded-full capitalize">
                    {user.role === 'super_admin' ? 'Super Admin' : user.role}
                  </span>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Users className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="mt-2 z-50">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}