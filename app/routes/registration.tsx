import { useState } from 'react';
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import SimplePhoneValidator from "~/components/validator/SimplePhoneInput";
import SimpleStructuredAddressInput from "~/components/validator/SimpleAddressInput";
import SimpleEmailValidator from "~/components/validator/SimpleEmailInput";
import { 
  Heart, 
  MapPin, 
  Globe,
  UserCheck
} from "lucide-react";
import { registerCustomer } from '~/api/register';

// 服务类别常量（直接在页面中定义）
const WELLNESS_CATEGORIES = [
  "massage", "yoga", "meditation", "spa", "fitness", 
  "nutrition", "beauty", "therapy", "acupuncture", "pilates",
  "reiki", "aromatherapy"
] as const;

//enum

interface TestingRegistrationProps {
  type: 'customer' | 'business';
}


export default function TestingRegistration({ type }: TestingRegistrationProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Customer fields
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      country: 'Australia',
      streetNumber: '',
      streetName: '',
      suburb: '',
      city: '',
      state: '',
      postalCode: '',
      fullAddress: ''
    },
    interests: [] as string[],
    
    // Business fields
    businessName: '',
    description: '',
    categories: [] as string[],
    primaryCategory: '',
    jobTitle: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    website: '',
    facebook: '',
    twitter: '',
    logo: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  if (type === 'customer') {
    return <CustomerRegistrationFlow step={step} formData={formData} onInputChange={handleInputChange} onNext={nextStep} onPrev={prevStep} />;
  } else {
    return <BusinessRegistrationFlow step={step} formData={formData} onInputChange={handleInputChange} onNext={nextStep} onPrev={prevStep} />;
  }
}

function CustomerRegistrationFlow({ step, formData, onInputChange, onNext, onPrev }: any) {
  const sections = [
    { key: 'personal', title: 'Personal Information', number: 1 },
    { key: 'contact', title: 'Contact Details', number: 2 },
    { key: 'address', title: 'Address Information', number: 3 },
    { key: 'interests', title: 'Wellness Interests', number: 4 }
  ];

  const currentSection = sections[step - 1];
  const maxSteps = sections.length;

  const handleSubmit = async () => {
   await registerCustomer(formData);
    onNext();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Testing Banner - 完全一样的样式 */}
      <div className="bg-blue-100 border-b border-blue-200 p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-800 text-sm">
            <strong>Testing Mode:</strong> Customer Registration Process - {currentSection?.title} ({step} of {maxSteps})
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Join Zendulge as a Customer</h1>
            {/* 进度条 - 完全一样的样式 */}
            <div className="flex space-x-2 mb-6">
              {sections.map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded ${i < step ? 'bg-shadow-lavender' : 'bg-gray-200'}`} />
              ))}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{currentSection?.title}</h2>
          </div>

          {/* Section 1: Personal Information - 完全一样的布局 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  Basic personal details for your Zendulge customer account
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => onInputChange('firstName', e.target.value)}
                    className="focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => onInputChange('lastName', e.target.value)}
                    className="focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <SimpleEmailValidator
                  value={formData.email || ""}
                  onChange={(value) => onInputChange('email', value)}
                  label="Email Address *"
                  placeholder="Enter your email address"
                  showValidationDetails={true}
                />
                <p className="text-sm text-gray-600">Used for booking confirmations and account notifications</p>
              </div>
            </div>
          )}

          {/* Section 2: Contact Details - 完全一样的布局 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  Contact details for booking confirmations and wellness service communications
                </p>
              </div>
              <div className="space-y-2">
                <SimplePhoneValidator
                  value={formData.phone || ""}
                  onChange={(value) => onInputChange('phone', value)}
                  label="Mobile Phone (for booking confirmations)"
                  placeholder="Enter mobile phone number"
                  mobileOnly={true}
                  showValidationDetails={true}
                />
                <p className="text-sm text-gray-600">We'll send booking confirmations and important updates to this number</p>
              </div>
            </div>
          )}

          {/* Section 3: Address Information - 完全一样的布局 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  Your address helps us show you relevant deals and services in your area
                </p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-shadow-lavender" />
                  Address
                </Label>
                <SimpleStructuredAddressInput
                  value={formData.address}
                  onChange={(address) => onInputChange('address', address)}
                  country={formData.address?.country || "Australia"}
                  onCountryChange={(country) => {
                    onInputChange('address', { ...formData.address, country });
                  }}
                />
                <p className="text-sm text-gray-600">This helps us personalise deals and services in your location</p>
              </div>
            </div>
          )}

          {/* Section 4: Wellness Interests - 完全一样的布局 */}
          {step === 4 && (// TODO 使用 enum来判断
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  Select your wellness interests to receive personalised deal recommendations
                </p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-shadow-lavender" />
                  Wellness Interests
                </Label>
                <div className="space-y-3">
                  <Select 
                    onValueChange={(category) => {
                      const currentInterests = formData.interests || [];
                      if (!currentInterests.includes(category)) {
                        onInputChange('interests', [...currentInterests, category]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add a wellness interest" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...WELLNESS_CATEGORIES].sort().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests?.map((interest: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-shadow-lavender/10 text-shadow-lavender border-shadow-lavender/20 pr-1"
                      >
                        {interest.charAt(0).toUpperCase() + interest.slice(1)}
                        <button
                          type="button"
                          onClick={() => {
                            const currentInterests = formData.interests || [];
                            onInputChange('interests', currentInterests.filter((_: string, i: number) => i !== index));
                          }}
                          className="ml-2 text-shadow-lavender hover:text-shadow-lavender/80"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">These help us recommend deals that match your wellness goals</p>
              </div>
            </div>
          )}

          {/* Completion Screen - 完全一样的样式 */}
          {step === 5 && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-semibold">Customer Registration Complete!</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-800 mb-4">
                  <strong>Testing Mode Complete:</strong> In a real scenario, you would now:
                </p>
                <ul className="text-green-700 text-left space-y-2">
                  <li>• Browse and discover wellness deals in your area</li>
                  <li>• Save your favourite deals and businesses to your wellness favourites</li>
                  <li>• Book appointments with secure Stripe payment processing</li>
                  <li>• Track your wellness journey with comprehensive booking history</li>
                  <li>• Rate and review services to help other customers</li>
                  <li>• Receive personalised deal recommendations based on your interests</li>
                  <li>• Manage your profile and preferences from your account dashboard</li>
                </ul>
              </div>
            </div>
          )}

          {/* 导航按钮 - 完全一样的样式 */}
          <div className="flex justify-between mt-8">
            {step > 1 && step <= maxSteps && (
              <button onClick={onPrev} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Previous
              </button>
            )}
            <div className="flex-1" />

            {step === 4 && 
            <button onClick={handleSubmit} className="px-6 py-2 bg-shadow-lavender text-white rounded-lg hover:bg-shadow-lavender/90">
            Next ARRRR
          </button>
            }
            {step < maxSteps ? (
              <button onClick={onNext} className="px-6 py-2 bg-shadow-lavender text-white rounded-lg hover:bg-shadow-lavender/90">
                Next
              </button>
            ) : step === maxSteps ? (
              <button onClick={onNext} className="px-6 py-2 bg-shadow-lavender text-white rounded-lg hover:bg-shadow-lavender/90">
                Complete Registration
              </button>
            ) : (
              <a href="/test/customer" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Explore Customer Experience
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BusinessRegistrationFlow({ step, formData, onInputChange, onNext, onPrev }: any) {
  const sections = [
    { key: 'basicInfo', title: 'Basic Information', number: 1 },
    { key: 'adminInfo', title: 'Business Group Admin Information', number: 2 },
    { key: 'categories', title: 'Service Categories', number: 3 },
    { key: 'address', title: 'Business Address', number: 4 },
    { key: 'contact', title: 'Contact Information', number: 5 },
    { key: 'contactPerson', title: 'Contact Person', number: 6 },
    { key: 'branding', title: 'Branding & Social Media', number: 7 }
  ];

  const currentSection = sections[step - 1];
  const maxSteps = sections.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Testing Banner - 完全一样的样式 */}
      <div className="bg-blue-100 border-b border-blue-200 p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-800 text-sm">
            <strong>Testing Mode:</strong> Business Registration Process - {currentSection?.title} ({step} of {maxSteps})
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Register Your Wellness Business</h1>
            {/* 进度条 - 完全一样的样式 */}
            <div className="flex space-x-2 mb-6">
              {sections.map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded ${i < step ? 'bg-shadow-lavender' : 'bg-gray-200'}`} />
              ))}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{currentSection?.title}</h2>
          </div>

          {/* Section 1: Basic Information - 完全一样的布局 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  Basic business details that will appear on your public profile
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Zen Wellness Spa"
                  value={formData.businessName}
                  onChange={(e) => onInputChange('businessName', e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                <textarea
                  placeholder="Describe your wellness business, services, and unique approach..."
                  value={formData.description}
                  onChange={(e) => onInputChange('description', e.target.value)}
                  className="w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                />
                <p className="text-sm text-gray-600 mt-1">Tell potential customers about your business and what makes it special</p>
              </div>
            </div>
          )}

          {/* Section 2: Business Group Admin Information - 完全一样的布局 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-1">Business Group Admin Setup</h4>
                <p className="text-sm text-blue-700">
                  This information will be used to establish your Business Group Admin account, 
                  giving you full management access to your business profile and team.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => onInputChange('firstName', e.target.value)}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => onInputChange('lastName', e.target.value)}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Owner, Manager, Director"
                  value={formData.jobTitle}
                  onChange={(e) => onInputChange('jobTitle', e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                />
                <p className="text-sm text-gray-600 mt-1">Your role within the business</p>
              </div>
            </div>
          )}

          {/* Section 3: Service Categories - 完全一样的布局 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  Select all wellness services your business offers. Choose a primary category for business listing.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Service Categories *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[...WELLNESS_CATEGORIES].sort().map(service => (
                    <label key={service} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        className="rounded text-shadow-lavender focus:ring-shadow-lavender"
                        checked={formData.categories?.includes(service)}
                        onChange={(e) => {
                          const categories = formData.categories || [];
                          if (e.target.checked) {
                            onInputChange('categories', [...categories, service]);
                          } else {
                            onInputChange('categories', categories.filter((p: string) => p !== service));
                          }
                        }}
                      />
                      <span className="text-sm">{service.charAt(0).toUpperCase() + service.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
              {formData.categories?.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Service Category *</label>
                  <select
                    value={formData.primaryCategory}
                    onChange={(e) => onInputChange('primaryCategory', e.target.value)}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                  >
                    <option value="">Select your primary category</option>
                    {formData.categories?.map((category: string) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-600 mt-1">Choose your main category for business listing and search</p>
                </div>
              )}
            </div>
          )}

          {/* Section 4: Business Address - 完全一样的布局 */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  Your primary business address where customers will visit for services
                </p>
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-shadow-lavender" />
                  Business Address
                </label>
                <SimpleStructuredAddressInput
                  value={formData.address || {
                    country: "Australia",
                    streetNumber: "",
                    streetName: "",
                    suburb: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    fullAddress: ""
                  }}
                  onChange={(address) => onInputChange('address', address)}
                  country={formData.address?.country || "Australia"}
                  onCountryChange={(country) => {
                    onInputChange('address', { ...formData.address, country });
                  }}
                />
                <p className="text-sm text-gray-600">This is where customers will visit for your wellness services</p>
              </div>
            </div>
          )}

          {/* Section 5: Contact Information - 完全一样的布局 */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  Primary contact details for customer enquiries and bookings
                </p>
              </div>
              <div>
                <SimplePhoneValidator
                  value={formData.phone || ""}
                  onChange={(value) => onInputChange('phone', value)}
                  label="Business Phone Number * (for customer contact)"
                  placeholder="Enter business phone (landline or mobile)"
                  showValidationDetails={true}
                />
                <p className="text-sm text-gray-600 mt-1">Landline or mobile number for customer contact</p>
              </div>
              <div>
                <SimpleEmailValidator
                  value={formData.email || ""}
                  onChange={(value) => onInputChange('email', value)}
                  label="Business Email Address *"
                  placeholder="hello@yourbusiness.com"
                  showValidationDetails={true}
                />
                <p className="text-sm text-gray-600 mt-1">Primary email for customer communication</p>
              </div>
            </div>
          )}

          {/* Section 6: Contact Person - 完全一样的布局 */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  Business Group Admin contact for account management and platform communications
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name *</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={formData.contactPersonName}
                  onChange={(e) => onInputChange('contactPersonName', e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                />
              </div>
              <div>
                <SimpleEmailValidator
                  value={formData.contactPersonEmail || ""}
                  onChange={(value) => onInputChange('contactPersonEmail', value)}
                  label="Contact Person Email *"
                  placeholder="john@yourbusiness.com"
                  showValidationDetails={true}
                />
              </div>
              <div>
                <SimplePhoneValidator
                  value={formData.contactPersonPhone || ""}
                  onChange={(value) => onInputChange('contactPersonPhone', value)}
                  label="Business Group Admin Mobile Phone *"
                  placeholder="Enter mobile phone for account management"
                  mobileOnly={true}
                  showValidationDetails={true}
                />
                <p className="text-sm text-gray-600 mt-1">Mobile number for account management purposes</p>
              </div>
            </div>
          )}

          {/* Section 7: Branding & Social Media - 完全一样的布局 */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  Help customers find and recognize your business online (optional)
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Website URL</label>
                  <input
                    type="url"
                    placeholder="https://yourbusiness.com"
                    value={formData.website}
                    onChange={(e) => onInputChange('website', e.target.value)}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Page URL</label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/yourbusiness"
                    value={formData.facebook}
                    onChange={(e) => onInputChange('facebook', e.target.value)}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">X (Twitter) Profile URL</label>
                  <input
                    type="url"
                    placeholder="https://x.com/yourbusiness"
                    value={formData.twitter}
                    onChange={(e) => onInputChange('twitter', e.target.value)}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Logo URL</label>
                  <input
                    type="url"
                    placeholder="https://yourbusiness.com/logo.png"
                    value={formData.logo}
                    onChange={(e) => onInputChange('logo', e.target.value)}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-shadow-lavender focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Completion Screen - 完全一样的样式 */}
          {step === 8 && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-semibold">Business Registration Complete!</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-800 mb-4">
                  <strong>Testing Mode Complete:</strong> In a real scenario, you would now:
                </p>
                <ul className="text-green-700 text-left space-y-2">
                  <li>• Access your business dashboard with full admin capabilities</li>
                  <li>• Set up your first services with detailed descriptions</li>
                  <li>• Create time-limited deals with specific pricing and availability</li>
                  <li>• Configure Stripe payment processing for customer bookings</li>
                  <li>• Manage operating sites and business user access levels</li>
                  <li>• Start receiving customer bookings and enquiries</li>
                  <li>• View analytics and performance reports</li>
                </ul>
              </div>
            </div>
          )}

          {/* 导航按钮 - 完全一样的样式 */}
          <div className="flex justify-between mt-8">
            {step > 1 && step <= maxSteps && (
              <button onClick={onPrev} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Previous
              </button>
            )}
            <div className="flex-1" />
            {step < maxSteps ? (
              <button onClick={onNext} className="px-6 py-2 bg-shadow-lavender text-white rounded-lg hover:bg-shadow-lavender/90">
                Next
              </button>
            ) : step === maxSteps ? (
              <button onClick={onNext} className="px-6 py-2 bg-shadow-lavender text-white rounded-lg hover:bg-shadow-lavender/90">
                Complete Registration
              </button>
            ) : (
              <a href="/test/business" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Explore Business Portal
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
