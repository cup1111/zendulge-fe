import { XCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import appIcon from '~/assets/app-icon.png';
import heroBackground from '~/assets/massage.jpeg';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useAuth } from '~/contexts/AuthContext';

import EmailInput from '../components/validator/EmailInput';
import PasswordInput from '../components/validator/PasswordInput';

export default function Login() {
  const navigate = useNavigate();
  const authContext = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleLogin = () => {
    authContext.login(formData.email, formData.password);
    if (authContext.isAuthenticated) {
      navigate('/');
    }
  };
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section
        className='relative min-h-screen bg-gradient-to-br from-frosted-lilac to-pure-white pt-16 pb-16'
        style={{
          backgroundImage: `linear-gradient(rgba(248, 245, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-8'>
            {/* App Icon */}
            <div className='flex justify-center mb-6'>
              <img
                src={appIcon}
                alt='Zendulge App Icon'
                className='w-24 h-24 rounded-2xl shadow-lg'
              />
            </div>
            {/* Tagline */}
            <h1
              className='text-5xl text-gray-900 max-w-3xl mx-auto mb-8 font-semibold'
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Login and book your next appointment!
            </h1>
          </div>

          {/* Login Form */}
          <Card className='text-center shadow-2xl'>
            <CardHeader className='pb-6'>
              <CardTitle className='text-3xl'>Login</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 px-8 pb-8'>
              <EmailInput
                value={formData.email}
                onChange={(email: string) => handleInputChange('email', email)}
                onEnter={e => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
              <PasswordInput
                value={formData.password}
                onChange={(password: string) =>
                  handleInputChange('password', password)
                }
                onEnter={e => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
              {!authContext.isAuthenticated && authContext.errorMessage && (
                <div className='text-xs text-red-600'>
                  <XCircle className='w-3 h-3 inline mr-1' />
                  {authContext.errorMessage}
                </div>
              )}
              <Button
                variant='default'
                className='w-full h-12 text-base mt-6'
                onClick={handleLogin}
              >
                Login
              </Button>
              <div className='flex justify-center'>
                <p className='text-sm text-gray-600'>Don't have an account?</p>
              </div>
              <Button variant='default' className='w-full h-12 text-base'>
                <Link to='/signup'>Sign Up</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
