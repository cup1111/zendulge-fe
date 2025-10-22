import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building,
  Calendar,
  DollarSign,
  Edit,
  Heart,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  TrendingUp,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import {
  mockBusinesses,
  mockUser,
  WELLNESS_CATEGORIES,
  type UserProfile,
  type WellnessCategory,
} from '~/lib/mockData';

import { useToast } from '../hooks/use-toast';

// 表单验证 Schema
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is required'),
  address: z.object({
    country: z.string().min(1, 'Country is required'),
    streetNumber: z.string().min(1, 'Street number is required'),
    streetName: z.string().min(1, 'Street name is required'),
    suburb: z.string().min(1, 'Suburb is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    fullAddress: z.string().min(1, 'Full address is required'),
  }),
  interests: z.array(z.enum(WELLNESS_CATEGORIES)).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile>(mockUser);
  const businesses = mockBusinesses;

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
        streetName: '',
        suburb: '',
        city: '',
        state: '',
        postalCode: '',
        fullAddress: '',
      },
      interests: user.interests ?? [],
    },
  });

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
        streetName: '',
        suburb: '',
        city: '',
        state: '',
        postalCode: '',
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

      // 更新本地状态
      setUser({
        ...user,
        ...data,
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
                              {...form.register('address.streetName')}
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
                              {...form.register('address.postalCode')}
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

              {/* Business Tab */}
              <TabsContent value='business'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <Building className='w-5 h-5 mr-2' />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {businesses.length > 0 ? (
                      <div className='space-y-4'>
                        {businesses.map(business => (
                          <div
                            key={business.id}
                            className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'
                          >
                            <div className='flex items-center justify-between mb-2'>
                              <h3 className='font-semibold text-gray-900'>
                                {business.name}
                              </h3>
                              <Badge
                                variant={
                                  business.isActive ? 'default' : 'secondary'
                                }
                                className={
                                  business.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : ''
                                }
                              >
                                {business.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className='text-sm text-gray-600 mb-3'>
                              {business.description}
                            </p>
                            <div className='flex items-center gap-2 mb-2'>
                              <MapPin className='w-4 h-4 text-gray-500' />
                              <p className='text-sm text-gray-700'>
                                {business.address}
                              </p>
                            </div>
                            <div className='flex gap-6 mt-3 pt-3 border-t'>
                              <div className='flex items-center gap-2'>
                                <DollarSign className='w-4 h-4 text-green-600' />
                                <div>
                                  <div className='text-sm font-semibold'>
                                    ${business.totalRevenue.toLocaleString()}
                                  </div>
                                  <div className='text-xs text-gray-600'>
                                    Revenue
                                  </div>
                                </div>
                              </div>
                              <div className='flex items-center gap-2'>
                                <TrendingUp className='w-4 h-4 text-blue-600' />
                                <div>
                                  <div className='text-sm font-semibold'>
                                    {business.totalBookings}
                                  </div>
                                  <div className='text-xs text-gray-600'>
                                    Bookings
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-8'>
                        <Building className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                        <h3 className='font-semibold text-gray-600 mb-2'>
                          No businesses registered
                        </h3>
                        <p className='text-gray-500 text-sm mb-4'>
                          Register your business to start offering deals on the
                          platform.
                        </p>
                        <Button className='bg-shadow-lavender hover:bg-shadow-lavender/90'>
                          Register Business
                        </Button>
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
