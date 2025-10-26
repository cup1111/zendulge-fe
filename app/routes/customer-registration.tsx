import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { registerCustomer } from '~/api/register';
import appIcon from '~/assets/app-icon.png';
import heroBackground from '~/assets/massage.jpeg';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

import ConfirmPasswordValidator from '../components/validator/ConfirmPasswordInput';
import EmailValidator from '../components/validator/EmailInput';
import PasswordValidator from '../components/validator/PasswordInput';

export default function CustomerRegistration() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  // New state to track validity for email and password and confirm password
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const onPasswordValidityChange = (isValid: boolean) => {
    setIsPasswordValid(isValid);
  };

  const [isEmailValid, setIsEmailValid] = useState(false);
  const onEmailValidityChange = (isValid: boolean) => {
    setIsEmailValid(isValid);
  };

  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const onConfirmPasswordValidityChange = (isValid: boolean) => {
    setIsConfirmPasswordValid(isValid);
  };

  const navigatory = useNavigate();

  const handleSubmit = async () => {
    const submitForm = { email: formData.email, password: formData.password };
    const response = await registerCustomer(submitForm);
    if (response.success) {
      navigatory('/verify-email', {
        state: { email: submitForm.email },
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              Sign up and book your next appointment!
            </h1>
          </div>

          {/* Login Form */}
          <Card className='text-center shadow-2xl'>
            <CardHeader className='pb-6'>
              <CardTitle className='text-3xl'>Sign Up</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 px-8 pb-8'>
              <EmailValidator
                onEmailValidityChange={onEmailValidityChange}
                value={formData.email}
                onChange={(email: string) => handleInputChange('email', email)}
              />
              <PasswordValidator
                onPasswordValidityChange={onPasswordValidityChange}
                value={formData.password}
                onChange={(password: string) =>
                  handleInputChange('password', password)
                }
              />
              <ConfirmPasswordValidator
                onConfirmPasswordValidityChange={
                  onConfirmPasswordValidityChange
                }
                password={formData.password}
                value={formData.confirmPassword}
                onChange={(confirmPassword: string) =>
                  handleInputChange('confirmPassword', confirmPassword)
                }
              />
              <Button
                disabled={
                  !(isEmailValid && isPasswordValid && isConfirmPasswordValid)
                }
                variant='default'
                className='w-full h-12 text-base mt-6'
                onClick={handleSubmit}
              >
                Sign Up
              </Button>
              <div className='flex justify-center'>
                <p className='text-sm text-gray-600'>
                  Already have an account?
                </p>
              </div>
              <Button variant='default' className='w-full h-12 text-base'>
                <Link to='/login'>Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
