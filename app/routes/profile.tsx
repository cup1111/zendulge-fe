import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building,
  Calendar,
  Edit,
  Heart,
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

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { BusinessStatus } from '~/constants/businessStatus';
import { useAuth } from '~/hooks/useAuth';
import {
  mockBusinesses,
  mockUser,
  WELLNESS_CATEGORIES,
  type UserProfile,
  type WellnessCategory,
} from '~/lib/mockData';
import BusinessService, { type BusinessInfo } from '~/services/businessService';

import { useToast } from '../hooks/useToast';

// 表单验证 Schema
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is required'),
  address: z.object({
    country: z.string().min(1, 'Country is required'),
    streetNumber: z.string().min(1, 'Street number is required'),
    street: z.string().min(1, 'Street name is required'),
    suburb: z.string().min(1, 'Suburb is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postcode: z.string().min(1, 'Postal code is required'),
    fullAddress: z.string().min(1, 'Full address is required'),
  }),
  interests: z.array(z.enum(WELLNESS_CATEGORIES)).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Business form schema
const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(100),
  email: z.string().email('Invalid email address'),
  description: z.string().optional(),
  businessAddress: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postcode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  abn: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  facebookUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type BusinessFormData = z.infer<typeof businessSchema>;

export default function Profile() {
  const { toast } = useToast();
  const { currentBusiness } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isBusinessLoading, setIsBusinessLoading] = useState(false);
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [showAbnWarningDialog, setShowAbnWarningDialog] = useState(false);
  const [pendingBusinessData, setPendingBusinessData] =
    useState<BusinessFormData | null>(null);
  const businesses = mockBusinesses;

  // Load business info if user has a current business
  useEffect(() => {
    async function loadBusinessInfo() {
      if (currentBusiness?.id) {
        const businessInfo = await BusinessService.getBusinessInfo(
          currentBusiness.id
        );
        setBusiness(businessInfo);
      }
    }
    loadBusinessInfo();
  }, [currentBusiness]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address ?? {
        country: 'Australia',
        streetNumber: '',
        street: '',
        suburb: '',
        city: '',
        state: '',
        postcode: '',
        fullAddress: '',
      },
      interests: user.interests ?? [],
    },
  });

  const businessForm = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: business?.name ?? '',
      email: business?.email ?? '',
      description: business?.description ?? '',
      businessAddress: business?.businessAddress ?? {
        street: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
      },
      abn: business?.abn ?? '',
      website: business?.website ?? '',
      facebookUrl: business?.facebookUrl ?? '',
      twitterUrl: business?.twitterUrl ?? '',
    },
  });

  // Reset business form when business data changes
  useEffect(() => {
    if (business) {
      businessForm.reset({
        name: business.name ?? '',
        email: business.email ?? '',
        description: business.description ?? '',
        businessAddress: business.businessAddress ?? {
          street: '',
          city: '',
          state: '',
          postcode: '',
          country: '',
        },
        abn: business.abn ?? '',
        website: business.website ?? '',
        facebookUrl: business.facebookUrl ?? '',
        twitterUrl: business.twitterUrl ?? '',
      });
    }
  }, [business, businessForm]);

  // 重置表单当用户数据变化
  useEffect(() => {
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address ?? {
        country: 'Australia',
        streetNumber: '',
        street: '',
        suburb: '',
        city: '',
        state: '',
        postcode: '',
        fullAddress: '',
      },
      interests: user.interests ?? [],
    });
  }, [user, form]);

  // 提交表单（模拟 API 调用）
  const onSubmit = async (data: ProfileFormData) => {
    try {
      // 模拟 API 延迟
      // eslint-disable-next-line no-promise-executor-return
      await new Promise(resolve => setTimeout(resolve, 500));

      // 更新本地状态 - 只更新 UserProfile 中存在的字段
      setUser({
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        interests: data.interests,
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getUserInitials = () => `${user.firstName[0]}${user.lastName[0]}`;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-red-100 text-red-800';
      case 'business':
        return 'bg-blue-100 text-blue-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 添加兴趣
  const addInterest = (category: WellnessCategory) => {
    const currentInterests = form.watch('interests') ?? [];
    if (!currentInterests.includes(category)) {
      form.setValue('interests', [...currentInterests, category]);
    }
  };

  // 删除兴趣
  const removeInterest = (index: number) => {
    const currentInterests = form.watch('interests') ?? [];
    form.setValue(
      'interests',
      currentInterests.filter((_, i) => i !== index)
    );
  };

  // Actually submit the business update
  const submitBusinessUpdate = async (data: BusinessFormData) => {
    if (!currentBusiness?.id) {
      return;
    }

    try {
      setIsBusinessLoading(true);
      const response = await BusinessService.updateBusinessInfo(
        currentBusiness.id,
        data
      );
      setBusiness(response);
      toast({
        title: 'Business updated',
        description:
          response.warning ??
          'Your business information has been successfully updated.',
        variant: response.warning ? 'default' : 'default',
      });
      setIsEditingBusiness(false);
      setShowAbnWarningDialog(false);
      setPendingBusinessData(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update business information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBusinessLoading(false);
    }
  };

  // Handle business form submission
  const onBusinessSubmit = async (data: BusinessFormData) => {
    if (!currentBusiness?.id) {
      toast({
        title: 'Error',
        description: 'No business selected',
        variant: 'destructive',
      });
      return;
    }

    // Check if ABN is being changed
    const abnChanged =
      business &&
      data.abn &&
      business.abn &&
      data.abn.replace(/\s/g, '').toUpperCase() !==
        business.abn.replace(/\s/g, '').toUpperCase();

    // Show warning dialog if ABN is being changed
    if (abnChanged) {
      setPendingBusinessData(data);
      setShowAbnWarningDialog(true);
      return;
    }

    // Proceed with update if no ABN change
    await submitBusinessUpdate(data);
  };

  // Handle ABN warning confirmation
  const handleAbnWarningConfirm = () => {
    if (pendingBusinessData) {
      submitBusinessUpdate(pendingBusinessData);
    }
  };

  // Handle ABN warning cancellation
  const handleAbnWarningCancel = () => {
    setShowAbnWarningDialog(false);
    setPendingBusinessData(null);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* ABN Change Warning Dialog */}
      <AlertDialog
        open={showAbnWarningDialog}
        onOpenChange={setShowAbnWarningDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              <span>⚠️ Warning: ABN Change Detected</span>
            </AlertDialogTitle>
            <AlertDialogDescription className='space-y-3 pt-2'>
              <p>Changing your ABN will have the following consequences:</p>
              <ul className='list-disc list-inside space-y-1 text-left ml-2'>
                <li>
                  Set your business status to &quot;pending&quot; (requires
                  re-verification)
                </li>
                <li>Disable all active deals</li>
                <li>
                  Hide all deals from customers until verification is complete
                </li>
              </ul>
              <p className='font-semibold pt-2'>
                Are you sure you want to continue?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleAbnWarningCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAbnWarningConfirm}
              className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
            >
              Yes, Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                  {user.firstName} {user.lastName}
                </CardTitle>
                <Badge className={`${getRoleBadgeColor(user.role)} mt-2`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Mail className='w-4 h-4 mr-2' />
                    {user.email}
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Phone className='w-4 h-4 mr-2' />
                    {user.phone}
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Calendar className='w-4 h-4 mr-2' />
                    Joined {new Date(user.joinedDate).toLocaleDateString()}
                  </div>
                  {user.role === 'business' && (
                    <div className='flex items-center text-sm text-gray-600'>
                      <Building className='w-4 h-4 mr-2' />
                      {user.businessesCount} Business
                      {user.businessesCount !== 1 ? 'es' : ''}
                    </div>
                  )}
                </div>

                <Separator className='my-4' />

                {user.role === 'business' ? (
                  <div className='space-y-3'>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-shadow-lavender'>
                        $
                        {businesses
                          .reduce((sum, b) => sum + b.totalRevenue, 0)
                          .toLocaleString()}
                      </div>
                      <div className='text-xs text-gray-600'>Total Revenue</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-shadow-lavender'>
                        {businesses.reduce(
                          (sum, b) => sum + b.totalBookings,
                          0
                        )}
                      </div>
                      <div className='text-xs text-gray-600'>
                        Total Bookings
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='grid grid-cols-2 gap-4 text-center'>
                    <div>
                      <div className='text-2xl font-bold text-shadow-lavender'>
                        {user.bookingsCount}
                      </div>
                      <div className='text-xs text-gray-600'>Bookings</div>
                    </div>
                    <div>
                      <div className='text-2xl font-bold text-shadow-lavender'>
                        {user.favoritesCount}
                      </div>
                      <div className='text-xs text-gray-600'>Favorites</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area with Tabs */}
          <div className='lg:col-span-2'>
            <Tabs defaultValue='personal' className='space-y-4'>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='personal'>Personal</TabsTrigger>
                <TabsTrigger value='account'>Account</TabsTrigger>
                <TabsTrigger value='business'>Business</TabsTrigger>
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
                              {user.firstName}
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
                              {user.lastName}
                            </p>
                          )}
                          {form.formState.errors.lastName && (
                            <p className='text-sm text-red-600'>
                              {form.formState.errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div className='space-y-2'>
                        <Label htmlFor='email'>Email Address</Label>
                        {isEditing ? (
                          <Input
                            id='email'
                            type='email'
                            {...form.register('email')}
                          />
                        ) : (
                          <p className='text-sm text-gray-900 py-2'>
                            {user.email}
                          </p>
                        )}
                        {form.formState.errors.email && (
                          <p className='text-sm text-red-600'>
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className='space-y-2'>
                        <Label htmlFor='phone'>Mobile Phone</Label>
                        {isEditing ? (
                          <Input
                            id='phone'
                            type='tel'
                            {...form.register('phone')}
                          />
                        ) : (
                          <p className='text-sm text-gray-900 py-2'>
                            {user.phone}
                          </p>
                        )}
                        {form.formState.errors.phone && (
                          <p className='text-sm text-red-600'>
                            {form.formState.errors.phone.message}
                          </p>
                        )}
                      </div>

                      {/* Address - Simplified */}
                      <div className='space-y-2'>
                        <Label className='flex items-center'>
                          <MapPin className='w-4 h-4 mr-2 text-shadow-lavender' />
                          Address
                        </Label>
                        {isEditing ? (
                          <div className='grid grid-cols-2 gap-4'>
                            <Input
                              placeholder='Street Number'
                              {...form.register('address.streetNumber')}
                            />
                            <Input
                              placeholder='Street Name'
                              {...form.register('address.street')}
                            />
                            <Input
                              placeholder='Suburb'
                              {...form.register('address.suburb')}
                            />
                            <Input
                              placeholder='City'
                              {...form.register('address.city')}
                            />
                            <Input
                              placeholder='State'
                              {...form.register('address.state')}
                            />
                            <Input
                              placeholder='Postal Code'
                              {...form.register('address.postcode')}
                            />
                          </div>
                        ) : (
                          <p className='text-sm text-gray-900 py-2'>
                            {user.address?.fullAddress ?? 'No address provided'}
                          </p>
                        )}
                      </div>

                      {/* Wellness Interests */}
                      <div className='space-y-2'>
                        <Label className='flex items-center'>
                          <Heart className='w-4 h-4 mr-2 text-shadow-lavender' />
                          Wellness Interests
                        </Label>
                        {isEditing ? (
                          <div className='space-y-3'>
                            <Select onValueChange={addInterest}>
                              <SelectTrigger>
                                <SelectValue placeholder='Add a wellness interest' />
                              </SelectTrigger>
                              <SelectContent>
                                {WELLNESS_CATEGORIES.map(category => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className='flex flex-wrap gap-2'>
                              {form
                                .watch('interests')
                                ?.map((interest, index) => (
                                  <Badge
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    variant='secondary'
                                    className='bg-shadow-lavender/10 text-shadow-lavender border-shadow-lavender/20 pr-1'
                                  >
                                    {interest}
                                    <button
                                      type='button'
                                      onClick={() => removeInterest(index)}
                                      className='ml-2 text-shadow-lavender hover:text-shadow-lavender/80'
                                    >
                                      ×
                                    </button>
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        ) : (
                          <div className='py-2'>
                            {user.interests && user.interests.length > 0 ? (
                              <div className='flex flex-wrap gap-2'>
                                {user.interests.map((interest, index) => (
                                  <Badge
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    variant='secondary'
                                    className='bg-shadow-lavender/10 text-shadow-lavender border-shadow-lavender/20'
                                  >
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className='text-sm text-gray-500'>
                                No wellness interests selected
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Save Button */}
                      {isEditing && (
                        <Button
                          type='submit'
                          className='bg-shadow-lavender hover:bg-shadow-lavender/90'
                        >
                          Save Changes
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
                          if (isEditingBusiness) {
                            businessForm.reset();
                          }
                          setIsEditingBusiness(!isEditingBusiness);
                        }}
                      >
                        {isEditingBusiness ? (
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
                    {business ? (
                      <>
                        {/* Business Status Alert */}
                        {business.status === BusinessStatus.PENDING && (
                          <Alert variant='destructive' className='mb-6'>
                            <AlertTitle className='flex items-center gap-2'>
                              <span className='font-bold'>
                                ⚠️ Verification in Progress
                              </span>
                            </AlertTitle>
                            <AlertDescription>
                              Your business details are being verified. Deals
                              are temporarily hidden from customers until
                              verification is complete. We&apos;ll notify you
                              once verified.
                            </AlertDescription>
                          </Alert>
                        )}
                        {business.status === BusinessStatus.DISABLED && (
                          <Alert variant='destructive' className='mb-6'>
                            <AlertTitle className='flex items-center gap-2'>
                              <span className='font-bold'>
                                ⚠️ Business Disabled
                              </span>
                            </AlertTitle>
                            <AlertDescription>
                              Your business is currently disabled. Please
                              contact us to reactivate your business.
                            </AlertDescription>
                          </Alert>
                        )}

                        <form
                          onSubmit={businessForm.handleSubmit(onBusinessSubmit)}
                          className='space-y-6'
                        >
                          {/* Business Name */}
                          <div className='space-y-2'>
                            <Label htmlFor='businessName'>Business Name</Label>
                            {isEditingBusiness ? (
                              <Input
                                id='businessName'
                                {...businessForm.register('name')}
                              />
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {business.name}
                              </p>
                            )}
                            {businessForm.formState.errors.name && (
                              <p className='text-sm text-red-600'>
                                {businessForm.formState.errors.name.message}
                              </p>
                            )}
                          </div>

                          {/* Business Email */}
                          <div className='space-y-2'>
                            <Label htmlFor='businessEmail'>
                              Business Email
                            </Label>
                            {isEditingBusiness ? (
                              <Input
                                id='businessEmail'
                                type='email'
                                {...businessForm.register('email')}
                              />
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {business.email}
                              </p>
                            )}
                            {businessForm.formState.errors.email && (
                              <p className='text-sm text-red-600'>
                                {businessForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>

                          {/* Description */}
                          <div className='space-y-2'>
                            <Label htmlFor='description'>Description</Label>
                            {isEditingBusiness ? (
                              <textarea
                                id='description'
                                {...businessForm.register('description')}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-shadow-lavender'
                                rows={3}
                                placeholder='Describe your business...'
                              />
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {business.description ??
                                  'No description provided'}
                              </p>
                            )}
                            {businessForm.formState.errors.description && (
                              <p className='text-sm text-red-600'>
                                {
                                  businessForm.formState.errors.description
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
                            {isEditingBusiness ? (
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='md:col-span-2'>
                                  <Input
                                    placeholder='Street Address'
                                    {...businessForm.register(
                                      'businessAddress.street'
                                    )}
                                  />
                                </div>
                                <Input
                                  placeholder='City'
                                  {...businessForm.register(
                                    'businessAddress.city'
                                  )}
                                />
                                <Input
                                  placeholder='State'
                                  {...businessForm.register(
                                    'businessAddress.state'
                                  )}
                                />
                                <Input
                                  placeholder='Postcode'
                                  {...businessForm.register(
                                    'businessAddress.postcode'
                                  )}
                                />
                                <Input
                                  placeholder='Country'
                                  {...businessForm.register(
                                    'businessAddress.country'
                                  )}
                                />
                              </div>
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {business.businessAddress
                                  ? `${business.businessAddress.street}, ${business.businessAddress.city}, ${business.businessAddress.state} ${business.businessAddress.postcode}, ${business.businessAddress.country}`
                                  : 'No address provided'}
                              </p>
                            )}
                          </div>

                          {/* ABN */}
                          <div className='space-y-2'>
                            <Label htmlFor='abn'>
                              ABN (Australian Business Number)
                            </Label>
                            {isEditingBusiness ? (
                              <Input
                                id='abn'
                                {...businessForm.register('abn')}
                                placeholder='11-digit ABN'
                              />
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {business.abn ?? 'No ABN provided'}
                              </p>
                            )}
                            {businessForm.formState.errors.abn && (
                              <p className='text-sm text-red-600'>
                                {businessForm.formState.errors.abn.message}
                              </p>
                            )}
                          </div>

                          {/* Website */}
                          <div className='space-y-2'>
                            <Label htmlFor='website'>Website</Label>
                            {isEditingBusiness ? (
                              <Input
                                id='website'
                                {...businessForm.register('website')}
                                placeholder='https://example.com'
                              />
                            ) : (
                              <p className='text-sm text-gray-900 py-2'>
                                {business.website ?? 'No website provided'}
                              </p>
                            )}
                            {businessForm.formState.errors.website && (
                              <p className='text-sm text-red-600'>
                                {businessForm.formState.errors.website.message}
                              </p>
                            )}
                          </div>

                          {/* Social Media Links */}
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                              <Label htmlFor='facebookUrl'>Facebook URL</Label>
                              {isEditingBusiness ? (
                                <Input
                                  id='facebookUrl'
                                  {...businessForm.register('facebookUrl')}
                                  placeholder='https://facebook.com/yourpage'
                                />
                              ) : (
                                <p className='text-sm text-gray-900 py-2'>
                                  {business.facebookUrl ?? 'No Facebook page'}
                                </p>
                              )}
                              {businessForm.formState.errors.facebookUrl && (
                                <p className='text-sm text-red-600'>
                                  {
                                    businessForm.formState.errors.facebookUrl
                                      .message
                                  }
                                </p>
                              )}
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor='twitterUrl'>Twitter URL</Label>
                              {isEditingBusiness ? (
                                <Input
                                  id='twitterUrl'
                                  {...businessForm.register('twitterUrl')}
                                  placeholder='https://twitter.com/yourhandle'
                                />
                              ) : (
                                <p className='text-sm text-gray-900 py-2'>
                                  {business.twitterUrl ?? 'No Twitter handle'}
                                </p>
                              )}
                              {businessForm.formState.errors.twitterUrl && (
                                <p className='text-sm text-red-600'>
                                  {
                                    businessForm.formState.errors.twitterUrl
                                      .message
                                  }
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Save Button */}
                          {isEditingBusiness && (
                            <Button
                              type='submit'
                              className='bg-shadow-lavender hover:bg-shadow-lavender/90'
                              disabled={isBusinessLoading}
                            >
                              {isBusinessLoading
                                ? 'Saving...'
                                : 'Save Business Information'}
                            </Button>
                          )}
                        </form>
                      </>
                    ) : (
                      <div className='text-center py-8'>
                        <Building className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                        <h3 className='font-semibold text-gray-600 mb-2'>
                          No business information available
                        </h3>
                        <p className='text-gray-500 text-sm'>
                          Business information could not be loaded.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
