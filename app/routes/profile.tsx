import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building,
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { BusinessUserRole } from '~/constants/enums';
import { useAuth } from '~/contexts/AuthContext';
import CompanyService, { type CompanyInfo } from '~/services/companyService';
import ProfileService, { type UserProfile } from '~/services/profileService';

import { useToast } from '../hooks/use-toast';

// 表单验证 Schema
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phoneNumber: z.string().min(8, 'Phone number is required').max(20),
  userName: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .optional(),
});

// Company form validation schema
const companySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100),
  email: z.string().email('Invalid email address'),
  description: z.string().max(500).optional(),
  serviceCategory: z.string().min(1, 'Service category is required'),
  businessAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postcode: z.string().min(1, 'Postcode is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  abn: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  facebookUrl: z
    .string()
    .url('Invalid Facebook URL')
    .optional()
    .or(z.literal('')),
  twitterUrl: z
    .string()
    .url('Invalid Twitter URL')
    .optional()
    .or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type CompanyFormData = z.infer<typeof companySchema>;

export default function Profile() {
  const { toast } = useToast();
  const { user: authUser, isAuthenticated, currentCompany } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      userName: '',
    },
  });

  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      email: '',
      description: '',
      serviceCategory: '',
      businessAddress: {
        street: '',
        city: '',
        state: '',
        postcode: '',
        country: 'Australia',
      },
      abn: '',
      website: '',
      facebookUrl: '',
      twitterUrl: '',
    },
  });

  // Load user profile and company data on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Load user profile
        const profileData = await ProfileService.getProfile();
        console.log('Profile data received:', profileData);
        setUser(profileData);

        // Update form with loaded data
        form.reset({
          firstName: profileData.firstName ?? '',
          lastName: profileData.lastName ?? '',
          phoneNumber: profileData.phoneNumber ?? '',
          userName: profileData.userName ?? '',
        });

        // Load company data if user is owner/admin and has a company
        if (
          authUser?.role?.slug === BusinessUserRole.Owner &&
          currentCompany?.id
        ) {
          try {
            const companyData = await CompanyService.getCompanyInfo(
              currentCompany.id
            );
            setCompany(companyData);

            // Update company form with loaded data
            companyForm.reset({
              name: companyData.name ?? '',
              email: companyData.email ?? '',
              description: companyData.description ?? '',
              serviceCategory: companyData.serviceCategory ?? '',
              businessAddress: {
                street: companyData.businessAddress?.street ?? '',
                city: companyData.businessAddress?.city ?? '',
                state: companyData.businessAddress?.state ?? '',
                postcode: companyData.businessAddress?.postcode ?? '',
                country: companyData.businessAddress?.country ?? 'Australia',
              },
              abn: companyData.abn ?? '',
              website: companyData.website ?? '',
              facebookUrl: companyData.facebookUrl ?? '',
              twitterUrl: companyData.twitterUrl ?? '',
            });
          } catch (companyError) {
            console.error('Error loading company data:', companyError);
            toast({
              title: 'Warning',
              description: 'Failed to load company information.',
              variant: 'destructive',
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, form, companyForm, toast, authUser, currentCompany]);

  // Submit profile form (real API call)
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);

      // Update profile using the API service
      const updatedProfile = await ProfileService.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        userName: data.userName,
      });

      // Update local state
      setUser(updatedProfile);

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit company form (real API call)
  const onCompanySubmit = async (data: CompanyFormData) => {
    if (!currentCompany?.id) {
      toast({
        title: 'Error',
        description: 'No company selected.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCompanyLoading(true);

      // Update company using the API service
      const updatedCompany = await CompanyService.updateCompanyInfo(
        currentCompany.id,
        {
          name: data.name,
          email: data.email,
          description: data.description,
          serviceCategory: data.serviceCategory,
          businessAddress: data.businessAddress,
          abn: data.abn,
          website: data.website,
          facebookUrl: data.facebookUrl,
          twitterUrl: data.twitterUrl,
        }
      );

      // Update local state
      setCompany(updatedCompany);

      toast({
        title: 'Company updated',
        description: 'Your company information has been successfully updated.',
      });

      setIsEditingCompany(false);
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: 'Error',
        description: 'Failed to update company information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCompanyLoading(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.firstName || !user?.lastName) return 'U';
    return `${user.firstName[0]}${user.lastName[0]}`;
  };
  // Show loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-shadow-lavender mx-auto' />
          <p className='mt-4 text-gray-600'>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show not authenticated state
  if (!isAuthenticated || !user) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Please log in
          </h1>
          <p className='text-gray-600'>
            You need to be logged in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-shadow-lavender mb-2'>
            Profile Settings
          </h1>
          <p className='text-gray-600'>
            Manage your account settings and preferences.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Profile Overview Sidebar */}
          <div className='lg:col-span-1'>
            <Card>
              <CardHeader className='text-center'>
                <Avatar className='w-24 h-24 mx-auto mb-4'>
                  <AvatarFallback className='bg-shadow-lavender text-pure-white text-xl'>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className='text-xl'>
                  {user?.firstName ?? ''} {user?.lastName ?? ''}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Mail className='w-4 h-4 mr-2' />
                    {user?.email ?? 'No email'}
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Phone className='w-4 h-4 mr-2' />
                    {user?.phoneNumber ?? 'No phone number'}
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Calendar className='w-4 h-4 mr-2' />
                    Joined{' '}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'Unknown'}
                  </div>
                </div>

                <Separator className='my-4' />

                <div className='grid grid-cols-2 gap-4 text-center'>
                  <div>
                    <div className='text-2xl font-bold text-shadow-lavender'>
                      0
                    </div>
                    <div className='text-xs text-gray-600'>Bookings</div>
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-shadow-lavender'>
                      0
                    </div>
                    <div className='text-xs text-gray-600'>Favorites</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area with Tabs */}
          <div className='lg:col-span-2'>
            <Tabs defaultValue='personal' className='space-y-4'>
              <TabsList
                className={`grid w-full ${authUser?.role?.slug === BusinessUserRole.Owner ? 'grid-cols-3' : 'grid-cols-2'}`}
              >
                <TabsTrigger value='personal'>Personal</TabsTrigger>
                <TabsTrigger value='account'>Account(WIP)</TabsTrigger>
                {authUser?.role?.slug === BusinessUserRole.Owner && (
                  <TabsTrigger value='business'>Business</TabsTrigger>
                )}
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value='personal'>
                <Card>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='flex items-center'>
                        <User className='w-5 h-5 mr-2' />
                        Personal Information
                      </CardTitle>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          if (isEditing) {
                            form.reset();
                          }
                          setIsEditing(!isEditing);
                        }}
                      >
                        {isEditing ? (
                          <>
                            <Save className='w-4 h-4 mr-2' />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit className='w-4 h-4 mr-2' />
                            Edit
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className='space-y-4'
                    >
                      {/* Name Fields */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='firstName'>First Name</Label>
                          {isEditing ? (
                            <Input
                              id='firstName'
                              {...form.register('firstName')}
                            />
                          ) : (
                            <p className='text-sm text-gray-900 py-2'>
                              {user?.firstName ?? 'No first name'}
                            </p>
                          )}
                          {form.formState.errors.firstName && (
                            <p className='text-sm text-red-600'>
                              {form.formState.errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='lastName'>Last Name</Label>
                          {isEditing ? (
                            <Input
                              id='lastName'
                              {...form.register('lastName')}
                            />
                          ) : (
                            <p className='text-sm text-gray-900 py-2'>
                              {user?.lastName ?? 'No last name'}
                            </p>
                          )}
                          {form.formState.errors.lastName && (
                            <p className='text-sm text-red-600'>
                              {form.formState.errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Email - Read Only */}
                      <div className='space-y-2'>
                        <Label htmlFor='email'>Email Address</Label>
                        <div className='relative'>
                          <Input
                            id='email'
                            type='email'
                            value={user?.email ?? ''}
                            disabled
                            className='bg-gray-50 text-gray-600 cursor-not-allowed'
                          />
                          <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                            <span className='text-xs text-gray-500'>
                              Read Only
                            </span>
                          </div>
                        </div>
                        <p className='text-xs text-gray-500'>
                          Email address cannot be changed for security reasons
                        </p>
                      </div>

                      {/* Phone */}
                      <div className='space-y-2'>
                        <Label htmlFor='phoneNumber'>Mobile Phone</Label>
                        {isEditing ? (
                          <Input
                            id='phoneNumber'
                            type='tel'
                            {...form.register('phoneNumber')}
                          />
                        ) : (
                          <p className='text-sm text-gray-900 py-2'>
                            {user?.phoneNumber ?? 'No phone number'}
                          </p>
                        )}
                        {form.formState.errors.phoneNumber && (
                          <p className='text-sm text-red-600'>
                            {form.formState.errors.phoneNumber.message}
                          </p>
                        )}
                      </div>

                      {/* Username */}
                      <div className='space-y-2'>
                        <Label htmlFor='userName'>Username</Label>
                        {isEditing ? (
                          <Input
                            id='userName'
                            {...form.register('userName')}
                            placeholder='Enter your username'
                          />
                        ) : (
                          <p className='text-sm text-gray-900 py-2'>
                            {user?.userName ?? 'No username'}
                          </p>
                        )}
                        {form.formState.errors.userName && (
                          <p className='text-sm text-red-600'>
                            {form.formState.errors.userName.message}
                          </p>
                        )}
                      </div>

                      {/* Save Button */}
                      {isEditing && (
                        <Button
                          type='submit'
                          className='bg-shadow-lavender hover:bg-shadow-lavender/90'
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Settings Tab */}
              <TabsContent value='account'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <Settings className='w-5 h-5 mr-2' />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label className='text-base'>Email Notifications</Label>
                        <div className='text-sm text-gray-600'>
                          Receive email updates about bookings and deals
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label className='text-base'>
                          Marketing Communications
                        </Label>
                        <div className='text-sm text-gray-600'>
                          Receive promotional offers and newsletters
                        </div>
                      </div>
                      <Switch />
                    </div>

                    <Separator />
                    <div>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => {
                          toast({
                            title: 'Account deletion',
                            description:
                              'This feature is not available in demo mode.',
                          });
                        }}
                      >
                        Delete Account
                      </Button>
                      <p className='text-sm text-gray-600 mt-2'>
                        This action cannot be undone. All your data will be
                        permanently deleted.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Business Tab - Only for Owners */}
              {authUser?.role?.slug === BusinessUserRole.Owner && (
                <TabsContent value='business'>
                  <Card>
                    <CardHeader>
                      <div className='flex items-center justify-between'>
                        <CardTitle className='flex items-center'>
                          <Building className='w-5 h-5 mr-2' />
                          Business Information
                        </CardTitle>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            if (isEditingCompany) {
                              companyForm.reset();
                            }
                            setIsEditingCompany(!isEditingCompany);
                          }}
                        >
                          {isEditingCompany ? (
                            <>
                              <Save className='w-4 h-4 mr-2' />
                              Cancel
                            </>
                          ) : (
                            <>
                              <Edit className='w-4 h-4 mr-2' />
                              Edit
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {company ? (
                        <form
                          onSubmit={companyForm.handleSubmit(onCompanySubmit)}
                          className='space-y-6'
                        >
                          {/* Company Name */}
                          <div className='space-y-2'>
                            <Label htmlFor='companyName'>Company Name</Label>
                            {isEditingCompany ? (
                              <Input
                                id='companyName'
                                {...companyForm.register('name')}
                              />
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {company.name}
                              </p>
                            )}
                            {companyForm.formState.errors.name && (
                              <p className='text-sm text-red-600'>
                                {companyForm.formState.errors.name.message}
                              </p>
                            )}
                          </div>

                          {/* Company Email */}
                          <div className='space-y-2'>
                            <Label htmlFor='companyEmail'>Company Email</Label>
                            {isEditingCompany ? (
                              <Input
                                id='companyEmail'
                                type='email'
                                {...companyForm.register('email')}
                              />
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {company.email}
                              </p>
                            )}
                            {companyForm.formState.errors.email && (
                              <p className='text-sm text-red-600'>
                                {companyForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>

                          {/* Service Category */}
                          <div className='space-y-2'>
                            <Label htmlFor='serviceCategory'>
                              Service Category
                            </Label>
                            {isEditingCompany ? (
                              <Input
                                id='serviceCategory'
                                {...companyForm.register('serviceCategory')}
                                placeholder='e.g., Wellness, Beauty, Fitness'
                              />
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {company.serviceCategory}
                              </p>
                            )}
                            {companyForm.formState.errors.serviceCategory && (
                              <p className='text-sm text-red-600'>
                                {
                                  companyForm.formState.errors.serviceCategory
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          {/* Description */}
                          <div className='space-y-2'>
                            <Label htmlFor='description'>Description</Label>
                            {isEditingCompany ? (
                              <textarea
                                id='description'
                                {...companyForm.register('description')}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-shadow-lavender'
                                rows={3}
                                placeholder='Describe your business...'
                              />
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {company.description ??
                                  'No description provided'}
                              </p>
                            )}
                            {companyForm.formState.errors.description && (
                              <p className='text-sm text-red-600'>
                                {
                                  companyForm.formState.errors.description
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          {/* Business Address */}
                          <div className='space-y-4'>
                            <Label className='flex items-center'>
                              <MapPin className='w-4 h-4 mr-2 text-shadow-lavender' />
                              Business Address
                            </Label>
                            {isEditingCompany ? (
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='md:col-span-2'>
                                  <Input
                                    placeholder='Street Address'
                                    {...companyForm.register(
                                      'businessAddress.street'
                                    )}
                                  />
                                </div>
                                <Input
                                  placeholder='City'
                                  {...companyForm.register(
                                    'businessAddress.city'
                                  )}
                                />
                                <Input
                                  placeholder='State'
                                  {...companyForm.register(
                                    'businessAddress.state'
                                  )}
                                />
                                <Input
                                  placeholder='Postcode'
                                  {...companyForm.register(
                                    'businessAddress.postcode'
                                  )}
                                />
                                <Input
                                  placeholder='Country'
                                  {...companyForm.register(
                                    'businessAddress.country'
                                  )}
                                />
                              </div>
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {company.businessAddress
                                  ? `${company.businessAddress.street}, ${company.businessAddress.city}, ${company.businessAddress.state} ${company.businessAddress.postcode}, ${company.businessAddress.country}`
                                  : 'No address provided'}
                              </p>
                            )}
                          </div>

                          {/* ABN */}
                          <div className='space-y-2'>
                            <Label htmlFor='abn'>
                              ABN (Australian Business Number)
                            </Label>
                            {isEditingCompany ? (
                              <Input
                                id='abn'
                                {...companyForm.register('abn')}
                                placeholder='11-digit ABN'
                              />
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {company.abn ?? 'No ABN provided'}
                              </p>
                            )}
                            {companyForm.formState.errors.abn && (
                              <p className='text-sm text-red-600'>
                                {companyForm.formState.errors.abn.message}
                              </p>
                            )}
                          </div>

                          {/* Website */}
                          <div className='space-y-2'>
                            <Label htmlFor='website'>Website</Label>
                            {isEditingCompany ? (
                              <Input
                                id='website'
                                {...companyForm.register('website')}
                                placeholder='https://example.com'
                              />
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {company.website ?? 'No website provided'}
                              </p>
                            )}
                            {companyForm.formState.errors.website && (
                              <p className='text-sm text-red-600'>
                                {companyForm.formState.errors.website.message}
                              </p>
                            )}
                          </div>

                          {/* Social Media Links */}
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                              <Label htmlFor='facebookUrl'>Facebook URL</Label>
                              {isEditingCompany ? (
                                <Input
                                  id='facebookUrl'
                                  {...companyForm.register('facebookUrl')}
                                  placeholder='https://facebook.com/yourpage'
                                />
                              ) : (
                                <p className='text-sm text-gray-900 py-2'>
                                  {company.facebookUrl ?? 'No Facebook page'}
                                </p>
                              )}
                              {companyForm.formState.errors.facebookUrl && (
                                <p className='text-sm text-red-600'>
                                  {
                                    companyForm.formState.errors.facebookUrl
                                      .message
                                  }
                                </p>
                              )}
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor='twitterUrl'>Twitter URL</Label>
                              {isEditingCompany ? (
                                <Input
                                  id='twitterUrl'
                                  {...companyForm.register('twitterUrl')}
                                  placeholder='https://twitter.com/yourhandle'
                                />
                              ) : (
                                <p className='text-sm text-gray-900 py-2'>
                                  {company.twitterUrl ?? 'No Twitter handle'}
                                </p>
                              )}
                              {companyForm.formState.errors.twitterUrl && (
                                <p className='text-sm text-red-600'>
                                  {
                                    companyForm.formState.errors.twitterUrl
                                      .message
                                  }
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Save Button */}
                          {isEditingCompany && (
                            <Button
                              type='submit'
                              className='bg-shadow-lavender hover:bg-shadow-lavender/90'
                              disabled={isCompanyLoading}
                            >
                              {isCompanyLoading
                                ? 'Saving...'
                                : 'Save Company Information'}
                            </Button>
                          )}
                        </form>
                      ) : (
                        <div className='text-center py-8'>
                          <Building className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                          <h3 className='font-semibold text-gray-600 mb-2'>
                            No company information available
                          </h3>
                          <p className='text-gray-500 text-sm'>
                            Company information could not be loaded.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
