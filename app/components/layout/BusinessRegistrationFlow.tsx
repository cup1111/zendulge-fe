// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { MapPin } from 'lucide-react';

import AddressInput from '~/components/inputs/AddressInput';
import EmailInput from '~/components/inputs/EmailInput';
import PhoneInput from '~/components/inputs/PhoneInput';
import { SectionNumber } from '~/enum/SectionNumber';

import ImageInput from '../inputs/ImageInput';

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
  businessBasicInfoFormData,
  setBusinessBasicInfoFormData,
  ownerIdentityFormData,
  setOwnerIdentityFormData,
  businessCategoryFormData,
  setBusinessCategoryFormData,
  businessAddressFormData,
  setBusinessAddressFormData,
  businessContactFormData,
  setBusinessContactFormData,
  contactPersonFormData,
  setContactPersonFormData,
  businessSocialMediaFormData,
  setBusinessSocialMediaFormData,
  accountCredentialsFormData,
  setAccountCredentialsFormData,
  error,
  setError,
  onInputChange,
  onSubmit,
  onNext,
  onPrev,
}: JSX.Element) {
  const sections = [
    {
      key: 'basicInfo',
      title: 'Basic Information',
      number: SectionNumber.businessBasicInfoSection,
    },
    {
      key: 'adminInfo',
      title: 'Business Group Admin Information',
      number: SectionNumber.ownerIdentitySection,
    },
    {
      key: 'categories',
      title: 'Service Categories',
      number: SectionNumber.businessCategorySection,
    },
    {
      key: 'address',
      title: 'Business Address',
      number: SectionNumber.businessAddressSection,
    },
    {
      key: 'contact',
      title: 'Contact Information',
      number: SectionNumber.businessContactSection,
    },
    {
      key: 'contactPerson',
      title: 'Contact Person',
      number: SectionNumber.contactPersonSection,
    },
    {
      key: 'branding',
      title: 'Branding & Social Media',
      number: SectionNumber.businessSocialMediaSection,
    },
    {
      key: 'login',
      title: 'login information',
      number: SectionNumber.accountCredentialsSection,
    },
    {
      key: 'completed',
      title: 'Completed',
      number: SectionNumber.completedSection,
    },
  ];

  const currentSection = sections[sectionStep - 1];
  const maxSteps = sections.length;
  // Determines if the user can proceed to the next step
  // Renders an error message component
  const renderErrorMessage = (message: string) => (
    <p className='text-xs text-red-600'>{message}</p>
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Banner */}
      <div className='bg-blue-100 border-b border-blue-200 p-4'>
        <div className='max-w-4xl mx-auto'>
          <p className='text-blue-800 text-sm'>
            Business Registration Process - {currentSection?.title} (
            {sectionStep} of {maxSteps - 1})
          </p>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow-md p-8'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Register Your Wellness Business
            </h1>
            {/* Progress bar */}
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
          {sectionStep === SectionNumber.businessBasicInfoSection && (
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
                    value={businessBasicInfoFormData.businessName.value}
                    onChange={e =>
                      onInputChange(
                        businessBasicInfoFormData,
                        setBusinessBasicInfoFormData,
                        'businessName',
                        e.target.value
                      )
                    }
                    className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                  />
                </label>
                {error.businessName && renderErrorMessage(error.businessName)}
              </div>
              <div>
                <span className='block text-sm font-medium text-gray-700 mb-2'>
                  Business Logo
                </span>
                <ImageInput
                  onChange={value => {
                    onInputChange(
                      businessBasicInfoFormData,
                      setBusinessBasicInfoFormData,
                      'companyLogo',
                      value
                    );
                  }}
                  onUploadError={err => {
                    setError({ ...error, ...{ companyLogo: err.message } });
                  }}
                  logoUrl={businessBasicInfoFormData.companyLogo.value}
                />
                {error.companyLogo && renderErrorMessage(error.companyLogo)}
              </div>
              <div>
                <label
                  className='block text-sm font-medium text-gray-700 mb-2'
                  htmlFor='BusinessABN'
                >
                  Business ABN *
                  <input
                    type='text'
                    id='BusinessABN'
                    placeholder='e.g., 12 345 678 901'
                    value={businessBasicInfoFormData.businessABN.value}
                    onChange={e =>
                      onInputChange(
                        businessBasicInfoFormData,
                        setBusinessBasicInfoFormData,
                        'businessABN',
                        e.target.value
                      )
                    }
                    className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                  />
                </label>
                {error.businessABN && renderErrorMessage(error.businessABN)}
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
                      value={businessBasicInfoFormData.description.value}
                      onChange={e =>
                        onInputChange(
                          businessBasicInfoFormData,
                          setBusinessBasicInfoFormData,
                          'description',
                          e.target.value
                        )
                      }
                      className='w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent pr-12'
                    />
                    <span
                      className={`absolute bottom-2 right-3 text-xs ${
                        businessBasicInfoFormData.description.value.length > 500
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {businessBasicInfoFormData.description.value.length}
                      /500
                    </span>
                  </div>
                </label>
                {error.description && renderErrorMessage(error.description)}
                <p className='text-sm text-gray-600 mt-1'>
                  Tell potential customers about your business and what makes it
                  special
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Business Group Admin Information -  */}
          {sectionStep === SectionNumber.ownerIdentitySection && (
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
                      value={ownerIdentityFormData.firstName.value}
                      onChange={e =>
                        onInputChange(
                          ownerIdentityFormData,
                          setOwnerIdentityFormData,
                          'firstName',
                          e.target.value
                        )
                      }
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.firstName && renderErrorMessage(error.firstName)}
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
                      value={ownerIdentityFormData.lastName.value}
                      onChange={e =>
                        onInputChange(
                          ownerIdentityFormData,
                          setOwnerIdentityFormData,
                          'lastName',
                          e.target.value
                        )
                      }
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.lastName && renderErrorMessage(error.lastName)}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Service Categories -  */}
          {sectionStep === SectionNumber.businessCategorySection && (
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
                          checked={businessCategoryFormData.categories?.value.includes(
                            service
                          )}
                          onChange={e => {
                            const categories =
                              businessCategoryFormData.categories.value || [];
                            if (e.target.checked) {
                              onInputChange(
                                businessCategoryFormData,
                                setBusinessCategoryFormData,
                                'categories',
                                [...categories, service]
                              );
                            } else {
                              onInputChange(
                                businessCategoryFormData,
                                setBusinessCategoryFormData,
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
                {error.categories && renderErrorMessage(error.categories)}
              </div>
            </div>
          )}

          {/* Section 4: Business Address -  */}
          {sectionStep === SectionNumber.businessAddressSection && (
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
                  businessAddress={businessAddressFormData}
                  setBusinessAddress={setBusinessAddressFormData}
                  onInputChange={onInputChange}
                  error={error}
                />
                <p className='text-sm text-gray-600'>
                  This is where customers will visit for your wellness services
                </p>
              </div>
            </div>
          )}

          {/* Section 5: Contact Information -  */}
          {sectionStep === SectionNumber.businessContactSection && (
            <div className='space-y-6'>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                <p className='text-blue-800 text-sm'>
                  Primary contact details for customer enquiries and bookings
                </p>
              </div>
              <div>
                <PhoneInput
                  value={businessContactFormData.phone.value || ''}
                  selectedCountry={
                    businessContactFormData.selectedCountry.value || 'AU'
                  }
                  onChange={value =>
                    onInputChange(
                      businessContactFormData,
                      setBusinessContactFormData,
                      'phone',
                      value
                    )
                  }
                  onCountryChange={value =>
                    onInputChange(
                      businessContactFormData,
                      setBusinessContactFormData,
                      'selectedCountry',
                      value
                    )
                  }
                  label='Business Phone Number * (for customer contact)'
                  placeholder='Enter business phone (landline or mobile)'
                />
                {error.phone && renderErrorMessage(error.phone)}
                <p className='text-sm text-gray-600 mt-1'>
                  Landline or mobile number for customer contact
                </p>
              </div>
              <div>
                <EmailInput
                  value={businessContactFormData.businessEmail.value || ''}
                  onChange={value =>
                    onInputChange(
                      businessContactFormData,
                      setBusinessContactFormData,
                      'businessEmail',
                      value
                    )
                  }
                  label='Business Email Address *'
                  placeholder='hello@yourbusiness.com'
                />
                {error.businessEmail && renderErrorMessage(error.businessEmail)}
              </div>
            </div>
          )}

          {/* Section 6: Contact Person -  */}
          {sectionStep === SectionNumber.contactPersonSection && (
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
                    value={contactPersonFormData.contactPersonName.value}
                    onChange={e =>
                      onInputChange(
                        contactPersonFormData,
                        setContactPersonFormData,
                        'contactPersonName',
                        e.target.value
                      )
                    }
                    className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                  />
                </label>
                {error.contactPersonName &&
                  renderErrorMessage(error.contactPersonName)}
              </div>
              <div>
                <EmailInput
                  value={contactPersonFormData.contactPersonEmail.value || ''}
                  onChange={value =>
                    onInputChange(
                      contactPersonFormData,
                      setContactPersonFormData,
                      'contactPersonEmail',
                      value
                    )
                  }
                  label='Contact Person Email *'
                  placeholder='john@yourbusiness.com'
                />
                {error.contactPersonEmail &&
                  renderErrorMessage(error.contactPersonEmail)}
              </div>
              <div>
                <PhoneInput
                  value={contactPersonFormData.contactPersonPhone.value || ''}
                  selectedCountry={
                    contactPersonFormData.contactPersonSelectedCountry.value ||
                    'AU'
                  }
                  onChange={value =>
                    onInputChange(
                      contactPersonFormData,
                      setContactPersonFormData,
                      'contactPersonPhone',
                      value
                    )
                  }
                  onCountryChange={value =>
                    onInputChange(
                      contactPersonFormData,
                      setContactPersonFormData,
                      'contactPersonSelectedCountry',
                      value
                    )
                  }
                  label='Business Group Admin Mobile Phone *'
                  placeholder='Enter mobile phone for account management'
                />
                {error.contactPersonPhone &&
                  renderErrorMessage(error.contactPersonPhone)}
                <p className='text-sm text-gray-600 mt-1'>
                  Mobile number for account management purposes
                </p>
              </div>
            </div>
          )}

          {/* Section 7: Branding & Social Media -  */}
          {sectionStep === SectionNumber.businessSocialMediaSection && (
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
                      value={businessSocialMediaFormData.website.value}
                      onChange={e =>
                        onInputChange(
                          businessSocialMediaFormData,
                          setBusinessSocialMediaFormData,
                          'website',
                          e.target.value
                        )
                      }
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.website && renderErrorMessage(error.website)}
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
                      value={businessSocialMediaFormData.facebook.value}
                      onChange={e =>
                        onInputChange(
                          businessSocialMediaFormData,
                          setBusinessSocialMediaFormData,
                          'facebook',
                          e.target.value
                        )
                      }
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.facebook && renderErrorMessage(error.facebook)}
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
                      value={businessSocialMediaFormData.twitter.value}
                      onChange={e =>
                        onInputChange(
                          businessSocialMediaFormData,
                          setBusinessSocialMediaFormData,
                          'twitter',
                          e.target.value
                        )
                      }
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.twitter && renderErrorMessage(error.twitter)}
                </div>
                {/* Logo removed per request */}
              </div>
            </div>
          )}
          {/* Section 8: Login Information -  */}
          {sectionStep === SectionNumber.accountCredentialsSection && (
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
                      value={accountCredentialsFormData.email.value}
                      onChange={e =>
                        onInputChange(
                          accountCredentialsFormData,
                          setAccountCredentialsFormData,
                          'email',
                          e.target.value
                        )
                      }
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.email && renderErrorMessage(error.email)}
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
                      value={accountCredentialsFormData.password.value}
                      onChange={e =>
                        onInputChange(
                          accountCredentialsFormData,
                          setAccountCredentialsFormData,
                          'password',
                          e.target.value
                        )
                      }
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.password && renderErrorMessage(error.password)}
                  <label
                    className='block text-sm font-medium text-gray-700 mb-2'
                    htmlFor='confirmPassword'
                  >
                    Confirm Password
                    <input
                      id='confirmPassword'
                      type='password'
                      placeholder='confirm your password'
                      value={accountCredentialsFormData.confirmPassword.value}
                      onChange={e =>
                        onInputChange(
                          accountCredentialsFormData,
                          setAccountCredentialsFormData,
                          'confirmPassword',
                          e.target.value
                        )
                      }
                      className='w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent'
                    />
                  </label>
                  {error.confirmPassword &&
                    renderErrorMessage(error.confirmPassword)}
                </div>
              </div>
            </div>
          )}

          {/* Section 9: Completion Screen */}
          {sectionStep === SectionNumber.completedSection && (
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
