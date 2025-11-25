import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { registerCustomer } from '~/api/register';
import appIcon from '~/assets/app-icon.png';
import heroBackground from '~/assets/massage.jpeg';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from '~/utils/validationUtils';

import ConfirmPasswordInput from '../components/inputs/ConfirmPasswordInput';
import EmailInput from '../components/inputs/EmailInput';
import PasswordInput from '../components/inputs/PasswordInput';

type CustomerField<T> = {
  isRequired?: boolean;
  validate?: (value: T, ...args: string[]) => string | null;
  value: T;
  defaultValue: T;
};

type CustomerRegistrationFormData = {
  email: CustomerField<string>;
  password: CustomerField<string>;
  confirmPassword: CustomerField<string>;
};

type ErrorState = {
  [K in keyof CustomerRegistrationFormData]?: string;
};

export default function CustomerRegistration() {
  const [customerRegistrationFormData, setCustomerRegistrationFormData] =
    useState<CustomerRegistrationFormData>({
      email: {
        isRequired: true,
        validate: value => validateEmail(value) ?? null,
        value: '',
        defaultValue: '',
      },
      password: {
        isRequired: true,
        validate: value => validatePassword(value) ?? null,
        value: '',
        defaultValue: '',
      },
      confirmPassword: {
        validate: (value, password) =>
          validateConfirmPassword(value, password) ?? null,
        value: '',
        defaultValue: '',
      },
    });
  const [error, setError] = useState<ErrorState>({});

  const navigate = useNavigate();

  const validateField = (
    field: keyof CustomerRegistrationFormData,
    value: string,
    formData: CustomerRegistrationFormData
  ): string | undefined => {
    const currentField = formData[field];

    // Check required field validation
    if (currentField.isRequired && !value) {
      return 'This field is required';
    }

    // Run custom validation if provided
    if (currentField.validate) {
      const isConfirmPassword = field === 'confirmPassword';
      const validationMsg = isConfirmPassword
        ? currentField.validate(value, formData.password.value)
        : currentField.validate(value);

      return validationMsg ?? undefined;
    }

    return undefined;
  };

  const handleInputChange = (
    field: keyof CustomerRegistrationFormData,
    value: string
  ) => {
    // Get current field configuration
    const currentField = customerRegistrationFormData[field];

    // Update form data
    const updatedField = {
      ...currentField,
      value,
    };
    const updatedFormData = {
      ...customerRegistrationFormData,
      [field]: updatedField,
    };
    setCustomerRegistrationFormData(updatedFormData);

    // Validate field with updated form data to ensure synchronization
    // Pass updated formData so confirmPassword validation can access latest password value
    const errorMsg = validateField(field, value, updatedFormData);

    if (errorMsg) {
      setError(prev => ({ ...prev, [field]: errorMsg }));
      return;
    }

    // Clear error if validation passes
    setError(prev => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { [field]: _, ...rest } = prev as Record<string, string>;
      return rest;
    });
  };

  const handleSubmit = async () => {
    // Validate all form fields using validateField
    const validateAll = (formData: CustomerRegistrationFormData) => {
      const errs: ErrorState = {};

      (
        Object.keys(formData) as Array<keyof CustomerRegistrationFormData>
      ).forEach(key => {
        const fieldValue = formData[key].value;
        const errorMsg = validateField(key, fieldValue, formData);
        if (errorMsg) {
          errs[key] = errorMsg;
        }
      });

      return errs;
    };

    const newErrors = validateAll(customerRegistrationFormData);

    setError(newErrors);

    const hasError = Object.values(newErrors).some(msg => msg);
    if (hasError) {
      return;
    }

    const submitForm = {
      email: customerRegistrationFormData.email.value,
      password: customerRegistrationFormData.password.value,
    };
    const response = await registerCustomer(submitForm);
    if (response.success) {
      navigate('/verify-email', {
        state: { email: submitForm.email },
      });
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
              Sign up and book your next appointment!
            </h1>
          </div>

          {/* Login Form */}
          <Card className='text-center shadow-2xl'>
            <CardHeader className='pb-6'>
              <CardTitle className='text-3xl'>Sign Up</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 px-8 pb-8'>
              <div>
                <EmailInput
                  value={customerRegistrationFormData.email.value}
                  onChange={(email: string) =>
                    handleInputChange('email', email)
                  }
                  onEnter={e => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                />
                {error.email && (
                  <p className='text-xs text-red-600 mt-1'>{error.email}</p>
                )}
              </div>
              <div>
                <PasswordInput
                  value={customerRegistrationFormData.password.value}
                  onChange={(password: string) =>
                    handleInputChange('password', password)
                  }
                  onEnter={e => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                />
                {error.password && (
                  <p className='text-xs text-red-600 mt-1'>{error.password}</p>
                )}
              </div>
              <div>
                <ConfirmPasswordInput
                  value={customerRegistrationFormData.confirmPassword.value}
                  onChange={(confirmPassword: string) =>
                    handleInputChange('confirmPassword', confirmPassword)
                  }
                  onEnter={e => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                />
                {error.confirmPassword && (
                  <p className='text-xs text-red-600 mt-1'>
                    {error.confirmPassword}
                  </p>
                )}
              </div>
              <Button
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
              <Button
                variant='default'
                className='w-full h-12 text-base'
                asChild
              >
                <Link to='/login'>Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
