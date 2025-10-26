// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { MapPin } from 'lucide-react';
import { useState } from 'react';

import { registerBusiness } from '~/api/register';
import SimpleEmailValidator from '~/components/validator/EmailInput';
import SimpleStructuredAddressInput from '~/components/validator/SimpleAddressInput';
import PhoneValidator from '~/components/validator/SimplePhoneInput';

const WELLNESS_CATEGORIES = [
  'massage',
  'yoga',
  'meditation',
  'spa',
  'fitness',
  'nutrition',
  'beauty',
  'therapy',
  'acupuncture',
  'pilates',
  'reiki',
  'aromatherapy',
] as const;

function BusinessRegistrationFlow({
  step,
  formData,
  onInputChange,
  onSubmit,
  onNext,
  onPrev,
}: any) {
  enum SectionNumber {
    basicInformation = 1,
    adminInformation,
    serviceCategories,
    businessAddress,
    contactInformation,
    contactPerson,
    brandingSocialMedia,
    loginInformation,
    completed,
  }
  const sections = [
    {
      key: 'basicInfo',
      title: 'Basic Information',
      number: SectionNumber.basicInformation,
    },
    {
      key: 'adminInfo',
      title: 'Business Group Admin Information',
      number: SectionNumber.adminInformation,
    },
    {
      key: 'categories',
      title: 'Service Categories',
      number: SectionNumber.serviceCategories,
    },
    {
      key: 'address',
      title: 'Business Address',
      number: SectionNumber.businessAddress,
    },
    {
      key: 'contact',
      title: 'Contact Information',
      number: SectionNumber.contactInformation,
    },
    {
      key: 'contactPerson',
      title: 'Contact Person',
      number: SectionNumber.contactPerson,
    },
    {
      key: 'branding',
      title: 'Branding & Social Media',
      number: SectionNumber.brandingSocialMedia,
    },
    {
      key: 'login',
      title: 'login information',
      number: SectionNumber.loginInformation,
    },
    {
      key: 'completed',
      title: 'Completed',
      number: SectionNumber.completed,
    },
  ];

  const currentSection = sections[step - 1];
  const maxSteps = sections.length;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Banner */}
      <div className='bg-blue-100 border-b border-blue-200 p-4'>
        <div className='max-w-4xl mx-auto'>
          <p className='text-blue-800 text-sm'>
            Business Registration Process - {currentSection?.title} ({step} of{' '}
            {maxSteps})
          </p>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow-md p-8'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Register Your Wellness Business
            </h1>
            {/* 进度条 */}
            <div className='flex space-x-2 mb-6'>
              {sections.map((_, i) => (
                <div
                  key={_.key}
                  className={`h-2 flex-1 rounded ${i < step ? 'bg-shadow-lavender' : 'bg-gray-200'}`}
                />
              ))}
            </div>
            <h2 className='text-xl font-semibold text-gray-800 mb-6'>
              {currentSection?.title}
            </h2>
          </div>

          {/* Section 1: Basic Information - 完全一样的布局 */}
          {step === SectionNumber.basicInformation && (
            <div className='space-y-6'>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                <p className='text-blue-800 text-sm'>
                  Basic business details that will appear on your public profile
                </p>
              </div>
              <div>
                <label
                  className='block text-sm font-medium text-gray-700 mb-2'
                  htmlFor='BusinessRegistrationFlow'
                >
                  Business Name *
                  <input
                    type='text'
                    id='BusinessRegistrationFlow'
                    placeholder='e.g., Zen Wellness Spa'
                    value={formData.businessName}
                    onChange={e =>
                      onInputChange('businessName', e.target.value)
                    }
                    className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                  />
                </label>
              </div>
              <div>
                <label
                  className='block text-sm font-medium text-gray-700 mb-2'
                  htmlFor='businessDescription'
                >
                  Business Description
                  <textarea
                    placeholder='Describe your wellness business, services, and unique approach...'
                    value={formData.description}
                    onChange={e => onInputChange('description', e.target.value)}
                    className='w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    id='businessDescription'
                  />
                </label>
                <p className='text-sm text-gray-600 mt-1'>
                  Tell potential customers about your business and what makes it
                  special
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Business Group Admin Information - 完全一样的布局 */}
          {step === SectionNumber.adminInformation && (
            <div className='space-y-6'>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                <h4 className='font-medium text-blue-900 mb-1'>
                  Business Group Admin Setup
                </h4>
                <p className='text-sm text-blue-700'>
                  This information will be used to establish your Business Group
                  Admin account, giving you full management access to your
                  business profile and team.
                </p>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='fristNameInput'
                  >
                    First Name *
                    <input
                      id='fristNameInput'
                      type='text'
                      placeholder='Enter your first name'
                      value={formData.firstName}
                      onChange={e => onInputChange('firstName', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='lastNameInput'
                  >
                    Last Name *
                    <input
                      id='lastNameInput'
                      type='text'
                      placeholder='Enter your last name'
                      value={formData.lastName}
                      onChange={e => onInputChange('lastName', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                </div>
              </div>
              <div>
                <label
                  className='block text-sm font-medium text-gray-700 mb-2'
                  htmlFor='jobTitleInput'
                >
                  Job Title *
                  <input
                    id='jobTitleInput'
                    type='text'
                    placeholder='e.g., Owner, Manager, Director'
                    value={formData.jobTitle}
                    onChange={e => onInputChange('jobTitle', e.target.value)}
                    className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                  />
                </label>
                <p className='text-sm text-gray-600 mt-1'>
                  Your role within the business
                </p>
              </div>
            </div>
          )}

          {/* Section 3: Service Categories - 完全一样的布局 */}
          {step === SectionNumber.serviceCategories && (
            <div className='space-y-6'>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                <p className='text-blue-800 text-sm'>
                  Select all wellness services your business offers. Choose a
                  primary category for business listing.
                </p>
              </div>
              <div>
                <label
                  className='block text-sm font-medium text-gray-700 mb-4'
                  htmlFor='serviceCategories'
                >
                  Service Categories *
                  <div
                    id='serviceCategories'
                    className='grid grid-cols-2 md:grid-cols-3 gap-3'
                  >
                    {[...WELLNESS_CATEGORIES].sort().map(service => (
                      <label
                        key={service}
                        className='flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50'
                        htmlFor={`category-${service}`}
                      >
                        <input
                          id={`category-${service}`}
                          type='checkbox'
                          className='rounded text-shadow-lavender focus:ring-shadow-lavender'
                          checked={formData.categories?.includes(service)}
                          onChange={e => {
                            const categories = formData.categories || [];
                            if (e.target.checked) {
                              onInputChange('categories', [
                                ...categories,
                                service,
                              ]);
                            } else {
                              onInputChange(
                                'categories',
                                categories.filter((p: string) => p !== service)
                              );
                            }
                          }}
                        />
                        <span className='text-sm'>
                          {service.charAt(0).toUpperCase() + service.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </label>
              </div>
              {formData.categories?.length > 1 && (
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='primaryCategory'
                  >
                    Primary Service Category *
                    <select
                      id='primaryCategory'
                      value={formData.primaryCategory}
                      onChange={e =>
                        onInputChange('primaryCategory', e.target.value)
                      }
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    >
                      <option value=''>Select your primary category</option>
                      {formData.categories?.map((category: string) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                  <p className='text-sm text-gray-600 mt-1'>
                    Choose your main category for business listing and search
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Section 4: Business Address - 完全一样的布局 */}
          {step === SectionNumber.businessAddress && (
            <div className='space-y-6'>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                <p className='text-blue-800 text-sm'>
                  Your primary business address where customers will visit for
                  services
                </p>
              </div>
              <div className='space-y-2'>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className='flex items-center'>
                  <MapPin className='w-4 h-4 mr-2 text-shadow-lavender' />
                  Business Address
                </label>
                <SimpleStructuredAddressInput
                  value={
                    formData.address || {
                      country: 'Australia',
                      streetNumber: '',
                      streetName: '',
                      suburb: '',
                      city: '',
                      state: '',
                      postalCode: '',
                      fullAddress: '',
                    }
                  }
                  onChange={address => onInputChange('address', address)}
                  country={formData.address?.country || 'Australia'}
                  onCountryChange={country => {
                    onInputChange('address', {
                      ...formData.address,
                      country,
                    });
                  }}
                />
                <p className='text-sm text-gray-600'>
                  This is where customers will visit for your wellness services
                </p>
              </div>
            </div>
          )}

          {/* Section 5: Contact Information - 完全一样的布局 */}
          {step === SectionNumber.contactInformation && (
            <div className='space-y-6'>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                <p className='text-blue-800 text-sm'>
                  Primary contact details for customer enquiries and bookings
                </p>
              </div>
              <div>
                <PhoneValidator
                  value={formData.phone || ''}
                  onChange={value => onInputChange('phone', value)}
                  label='Business Phone Number * (for customer contact)'
                  placeholder='Enter business phone (landline or mobile)'
                  showValidationDetails
                />
                <p className='text-sm text-gray-600 mt-1'>
                  Landline or mobile number for customer contact
                </p>
              </div>
              <div>
                <SimpleEmailValidator
                  value={formData.email || ''}
                  onChange={value => onInputChange('email', value)}
                  label='Business Email Address *'
                  placeholder='hello@yourbusiness.com'
                  showValidationDetails
                />
                <p className='text-sm text-gray-600 mt-1'>
                  Primary email for customer communication
                </p>
              </div>
            </div>
          )}

          {/* Section 6: Contact Person - 完全一样的布局 */}
          {step === SectionNumber.contactPerson && (
            <div className='space-y-6'>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                <p className='text-blue-800 text-sm'>
                  Business Group Admin contact for account management and
                  platform communications
                </p>
              </div>
              <div>
                <label
                  className='block text-sm font-medium text-gray-700 mb-2'
                  htmlFor='contactPersonName'
                >
                  Contact Person Name *
                  <input
                    id='contactPersonName'
                    type='text'
                    placeholder='John Smith'
                    value={formData.contactPersonName}
                    onChange={e =>
                      onInputChange('contactPersonName', e.target.value)
                    }
                    className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                  />
                </label>
              </div>
              <div>
                <SimpleEmailValidator
                  value={formData.contactPersonEmail || ''}
                  onChange={value => onInputChange('contactPersonEmail', value)}
                  label='Contact Person Email *'
                  placeholder='john@yourbusiness.com'
                  showValidationDetails
                />
              </div>
              <div>
                <PhoneValidator
                  value={formData.contactPersonPhone || ''}
                  onChange={value => onInputChange('contactPersonPhone', value)}
                  label='Business Group Admin Mobile Phone *'
                  placeholder='Enter mobile phone for account management'
                  mobileOnly
                  showValidationDetails
                />
                <p className='text-sm text-gray-600 mt-1'>
                  Mobile number for account management purposes
                </p>
              </div>
            </div>
          )}

          {/* Section 7: Branding & Social Media - 完全一样的布局 */}
          {step === SectionNumber.brandingSocialMedia && (
            <div className='space-y-6'>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                <p className='text-blue-800 text-sm'>
                  Help customers find and recognize your business online
                  (optional)
                </p>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='businessWeb'
                  >
                    Business Website URL
                    <input
                      id='businessWeb'
                      type='url'
                      placeholder='https://yourbusiness.com'
                      value={formData.website}
                      onChange={e => onInputChange('website', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='facebook'
                  >
                    Facebook Page URL
                    <input
                      id='fecebook'
                      type='url'
                      placeholder='https://facebook.com/yourbusiness'
                      value={formData.facebook}
                      onChange={e => onInputChange('facebook', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='xProfile'
                  >
                    X (Twitter) Profile URL
                    <input
                      id='xProfile'
                      type='url'
                      placeholder='https://x.com/yourbusiness'
                      value={formData.twitter}
                      onChange={e => onInputChange('twitter', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='businessLogo'
                  >
                    Business Logo URL
                    <input
                      id='businessLogo'
                      type='url'
                      placeholder='https://yourbusiness.com/logo.png'
                      value={formData.logo}
                      onChange={e => onInputChange('logo', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === SectionNumber.loginInformation && (
            <div className='space-y-6'>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                <p className='text-blue-800 text-sm'>
                  Set up login information
                </p>
              </div>
              <div className='gap-6'>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='email'
                  >
                    Email
                    <input
                      id='email'
                      type='email'
                      placeholder='youremail@.com'
                      value={formData.loginEmail}
                      onChange={e =>
                        onInputChange('loginEmail', e.target.value)
                      }
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='password'
                  >
                    Password
                    <input
                      id='password'
                      type='password'
                      placeholder='your password'
                      value={formData.password}
                      onChange={e => onInputChange('password', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='confirmPassword'
                  >
                    Confirm Password
                    <input
                      id='confirmPassword'
                      type='password'
                      placeholder='your password'
                      value={formData.password}
                      onChange={e => onInputChange('password', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Completion Screen - 完全一样的样式 */}
          {step === SectionNumber.completed && (
            <div className='space-y-6 text-center'>
              <h2 className='text-xl font-semibold'>
                Business Registration Complete!
              </h2>
              <div className='bg-green-50 border border-green-200 rounded-lg p-6'>
                <ul className='text-green-700 text-left space-y-2'>
                  <li>
                    • Access your business dashboard with full admin
                    capabilities
                  </li>
                  <li>
                    • Set up your first services with detailed descriptions
                  </li>
                  <li>
                    • Create time-limited deals with specific pricing and
                    availability
                  </li>
                  <li>
                    • Configure Stripe payment processing for customer bookings
                  </li>
                  <li>
                    • Manage operating sites and business user access levels
                  </li>
                  <li>• Start receiving customer bookings and enquiries</li>
                  <li>• View analytics and performance reports</li>
                </ul>
              </div>
            </div>
          )}

          {/* 导航按钮 - 完全一样的样式 */}
          <div className='flex justify-between mt-8'>
            {step > 1 && step <= maxSteps && (
              <button
                type='button'
                onClick={onPrev}
                className='px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Previous
              </button>
            )}
            <div className='flex-1' />
            {step < maxSteps ? (
              <button
                type='button'
                onClick={onNext}
                className='px-6 py-2 bg-shadow-lavender text-white rounded-lg hover:bg-shadow-lavender/90'
              >
                Next
              </button>
            ) : (
              <button
                type='button'
                onClick={onSubmit}
                className='px-6 py-2 bg-shadow-lavender text-white rounded-lg hover:bg-shadow-lavender/90'
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BusinessRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business fields
    businessName: '',
    description: '',
    firstName: '',
    lastName: '',
    categories: [] as string[],
    primaryCategory: '',
    jobTitle: '',
    address: {
      country: '',
      streetNumber: '',
      streetName: '',
      suburb: '',
      city: '',
      state: '',
      postalCode: '',
      fullAddress: '',
    },
    phone: '',
    email: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    website: '',
    facebook: '',
    twitter: '',
    logo: '',
    loginEmail: '',
    password: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'businessName') {
      handleBusinessNameError(value);
    }
  };

  const handleSubmit = async () => {
    await registerBusiness(formData);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <BusinessRegistrationFlow
      step={step}
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onNext={nextStep}
      onPrev={prevStep}
      error={error}
    />
  );
}
