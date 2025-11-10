// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { MapPin } from 'lucide-react';

import AddressInput from '~/components/validator/AddressInput';
import EmailInput from '~/components/validator/EmailInput';
import PhoneInput from '~/components/validator/PhoneInput';

const WELLNESS_CATEGORIES = [
  'Massage',
  'Yoga',
  'Meditation',
  'Spa',
  'Fitness',
  'Nutrition',
  'Beauty',
  'Therapy',
  'Acupuncture',
  'Pilates',
  'Reiki',
  'Aromatherapy',
] as const;

export default function BusinessRegistrationFlow({
  sectionStep,
  businessRegistrationFormData,
  error,
  setError,
  onInputChange,
  onAddressChange,
  onSubmit,
  onNext,
  onPrev,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasChanged,
}: JSX.Element) {
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

  const currentSection = sections[sectionStep - 1];
  const maxSteps = sections.length;
  const canProceedToNextStep = true; // TODO: need to fix
  const showError = (message: string) => (
    <p className='text-xs text-red-600'>{message}</p>
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Banner */}
      <div className='bg-blue-100 border-b border-blue-200 p-4'>
        <div className='max-w-4xl mx-auto'>
          <p className='text-blue-800 text-sm'>
            Business Registration Process - {currentSection?.title} (
            {sectionStep} of {maxSteps})
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
              {sections.slice(0, -1).map((section, i) => (
                <div
                  key={section.key}
                  className={`h-2 flex-1 rounded ${i < sectionStep ? 'bg-shadow-lavender' : 'bg-gray-200'}`}
                />
              ))}
            </div>

            <h2 className='text-xl font-semibold text-gray-800 mb-6'>
              {currentSection?.title}
            </h2>
          </div>

          {/* Section 1: Basic Information -  */}
          {sectionStep === SectionNumber.basicInformation && (
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
                    value={businessRegistrationFormData.companyName.value}
                    onChange={e => onInputChange('companyName', e.target.value)}
                    className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                  />
                </label>
                {error.companyName && showError(error.companyName)}
              </div>
              <div>
                <label
                  className='block text-sm font-medium text-gray-700 mb-2'
                  htmlFor='businessDescription'
                >
                  Business Description
                  <div className='relative'>
                    <textarea
                      id='businessDescription'
                      placeholder='Describe your wellness business, services, and unique approach...'
                      value={businessRegistrationFormData.description.value}
                      onChange={e =>
                        onInputChange('description', e.target.value)
                      }
                      className='w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent pr-12'
                    />
                    <span
                      className={`absolute bottom-2 right-3 text-xs ${
                        businessRegistrationFormData.description.value.length >
                        500
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {businessRegistrationFormData.description.value.length}
                      /500
                    </span>
                  </div>
                </label>
                {error.description && showError(error.description)}
                <p className='text-sm text-gray-600 mt-1'>
                  Tell potential customers about your business and what makes it
                  special
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Business Group Admin Information -  */}
          {sectionStep === SectionNumber.adminInformation && (
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
                      value={businessRegistrationFormData.firstName.value}
                      onChange={e => onInputChange('firstName', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.firstName && showError(error.firstName)}
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
                      value={businessRegistrationFormData.lastName.value}
                      onChange={e => onInputChange('lastName', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.lastName && showError(error.lastName)}
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
                    value={businessRegistrationFormData.jobTitle.value}
                    onChange={e => onInputChange('jobTitle', e.target.value)}
                    className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                  />
                </label>
                {error.jobTitle && showError(error.jobTitle)}
                <p className='text-sm text-gray-600 mt-1'>
                  Your role within the business
                </p>
              </div>
            </div>
          )}

          {/* Section 3: Service Categories -  */}
          {sectionStep === SectionNumber.serviceCategories && (
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
                          checked={businessRegistrationFormData.categories?.value.includes(
                            service
                          )}
                          onChange={e => {
                            const categories =
                              businessRegistrationFormData.categories.value ||
                              [];
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
                {error.categories && showError(error.categories)}
              </div>
              {businessRegistrationFormData.categories.value.length > 1 && (
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='serviceCategory'
                  >
                    Primary Service Category *
                    <select
                      id='serviceCategory'
                      value={businessRegistrationFormData.serviceCategory.value}
                      onChange={e =>
                        onInputChange('serviceCategory', e.target.value)
                      }
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    >
                      <option value=''>Select your primary category</option>
                      {businessRegistrationFormData.categories?.value.map(
                        (category: string) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                  {error.serviceCategory && showError(error.serviceCategory)}
                  <p className='text-sm text-gray-600 mt-1'>
                    Choose your main category for business listing and search
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Section 4: Business Address -  */}
          {sectionStep === SectionNumber.businessAddress && (
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
                <AddressInput
                  value={businessRegistrationFormData.businessAddress}
                  onChange={address => onAddressChange(address)}
                  error={error}
                  errorSetter={setError}
                />
                <p className='text-sm text-gray-600'>
                  This is where customers will visit for your wellness services
                </p>
              </div>
            </div>
          )}

          {/* Section 5: Contact Information -  */}
          {sectionStep === SectionNumber.contactInformation && (
            <div className='space-y-6'>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                <p className='text-blue-800 text-sm'>
                  Primary contact details for customer enquiries and bookings
                </p>
              </div>
              <div>
                <PhoneInput
                  value={businessRegistrationFormData.phone.value || ''}
                  selectedCountry={
                    businessRegistrationFormData.selectedCountry.value ||
                    'Australia +61'
                  }
                  onChange={value => onInputChange('phone', value)}
                  onCountryChange={value =>
                    onInputChange('selectedCountry', value)
                  }
                  label='Business Phone Number * (for customer contact)'
                  placeholder='Enter business phone (landline or mobile)'
                  showValidationDetails
                />
                {error.phone && showError(error.phone)}
                <p className='text-sm text-gray-600 mt-1'>
                  Landline or mobile number for customer contact
                </p>
              </div>
              <div>
                <EmailInput
                  value={businessRegistrationFormData.companyEmail.value || ''}
                  onChange={value => onInputChange('companyEmail', value)}
                  label='Business Email Address *'
                  placeholder='hello@yourbusiness.com'
                  showValidationDetails
                />
                {error.companyEmail && showError(error.companyEmail)}
                <p className='text-sm text-gray-600 mt-1'>
                  Primary email for customer communication
                </p>
              </div>
            </div>
          )}

          {/* Section 6: Contact Person -  */}
          {sectionStep === SectionNumber.contactPerson && (
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
                    value={businessRegistrationFormData.contactPersonName.value}
                    onChange={e =>
                      onInputChange('contactPersonName', e.target.value)
                    }
                    className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                  />
                </label>
                {error.contactPersonName && showError(error.contactPersonName)}
              </div>
              <div>
                <EmailInput
                  value={
                    businessRegistrationFormData.contactPersonEmail.value || ''
                  }
                  onChange={value => onInputChange('contactPersonEmail', value)}
                  label='Contact Person Email *'
                  placeholder='john@yourbusiness.com'
                  showValidationDetails
                />
                {error.contactPersonEmail &&
                  showError(error.contactPersonEmail)}
              </div>
              <div>
                <PhoneInput
                  value={
                    businessRegistrationFormData.contactPersonPhone.value || ''
                  }
                  selectedCountry={
                    businessRegistrationFormData.contactPersonSelectedCountry
                      .value || 'Australia +61'
                  }
                  onChange={value => onInputChange('contactPersonPhone', value)}
                  onCountryChange={value =>
                    onInputChange('contactPersonSelectedCountry', value)
                  }
                  label='Business Group Admin Mobile Phone *'
                  placeholder='Enter mobile phone for account management'
                  mobileOnly
                  showValidationDetails
                />
                {error.contactPersonPhone &&
                  showError(error.contactPersonPhone)}
                <p className='text-sm text-gray-600 mt-1'>
                  Mobile number for account management purposes
                </p>
              </div>
            </div>
          )}

          {/* Section 7: Branding & Social Media -  */}
          {sectionStep === SectionNumber.brandingSocialMedia && (
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
                      value={businessRegistrationFormData.website.value}
                      onChange={e => onInputChange('website', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.website && showError(error.website)}
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
                      value={businessRegistrationFormData.facebook.value}
                      onChange={e => onInputChange('facebook', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.facebook && showError(error.facebook)}
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
                      value={businessRegistrationFormData.twitter.value}
                      onChange={e => onInputChange('twitter', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.twitter && showError(error.twitter)}
                </div>
                {/* Logo removed per request */}
              </div>
            </div>
          )}
          {/* Section 8: Login Information -  */}
          {sectionStep === SectionNumber.loginInformation && (
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
                      value={businessRegistrationFormData.email.value}
                      onChange={e => onInputChange('email', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.email && showError(error.email)}
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
                      value={businessRegistrationFormData.password.value}
                      onChange={e => onInputChange('password', e.target.value)}
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.password && showError(error.password)}
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='confirmPassword'
                  >
                    Confirm Password
                    <input
                      id='confirmPassword'
                      type='password'
                      placeholder='confirm your password'
                      value={businessRegistrationFormData.confirmPassword.value}
                      onChange={e =>
                        onInputChange('confirmPassword', e.target.value)
                      }
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.confirmPassword && showError(error.confirmPassword)}
                </div>
              </div>
            </div>
          )}

          {/* Section 9: Completion Screen */}
          {sectionStep === SectionNumber.completed && (
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

          {/* Navigation Button */}
          <div className='flex justify-between mt-8'>
            {sectionStep > 1 && sectionStep < maxSteps && (
              <button
                type='button'
                onClick={onPrev}
                className='px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Previous
              </button>
            )}
            <div className='flex-1' />
            {sectionStep < maxSteps - 1 ? (
              <button
                type='button'
                onClick={onNext}
                disabled={!canProceedToNextStep}
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
