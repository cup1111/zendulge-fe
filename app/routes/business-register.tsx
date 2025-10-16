import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building,
  Building2,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Hash,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { useToast } from '~/components/ui/use-toast';

// ========================================
// 1. 定义服务类别
// ========================================
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
] as const;

// ========================================
// 2. 定义表单验证 Schema
// ========================================
const businessSchema = z.object({
  // Basic Info
  name: z.string().min(1, 'Business name is required'),
  description: z.string(),

  // ABN Information
  abn: z
    .string()
    .min(11, 'ABN must be 11 digits')
    .max(14, 'ABN must be 11 digits (may include spaces)')
    .regex(/^[0-9\s]+$/, 'ABN must contain only numbers')
    .refine(
      val => val.replace(/\s/g, '').length === 11,
      'ABN must be exactly 11 digits'
    ),
  abnRegisteredName: z
    .string()
    .min(1, 'ABN registered business name is required'),

  // Business Group Admin Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),

  // Categories
  categories: z
    .array(z.string())
    .min(1, 'At least one service category is required'),
  primaryCategory: z.string().min(1, 'Primary category is required'),

  // Address
  streetNumber: z.string().min(1, 'Street number is required'),
  streetName: z.string().min(1, 'Street name is required'),
  suburb: z.string(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),

  // Contact
  phone: z.string().min(8, 'Phone number is required'),
  email: z.email('Please enter a valid email address'),

  // Contact Person Information
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  contactPersonEmail: z.email('Please enter a valid email address'),
  contactPersonPhone: z.string().min(8, 'Phone number is required'),

  // Branding (Optional - allow empty strings)
  logo: z.string().refine(val => !val || z.url().safeParse(val).success, {
    message: 'Please enter a valid URL',
  }),
  website: z.string().refine(val => !val || z.url().safeParse(val).success, {
    message: 'Please enter a valid URL',
  }),
  facebook: z.string().refine(val => !val || z.url().safeParse(val).success, {
    message: 'Please enter a valid Facebook URL',
  }),
  twitter: z.string().refine(val => !val || z.url().safeParse(val).success, {
    message: 'Please enter a valid Twitter URL',
  }),
});

type BusinessFormData = z.infer<typeof businessSchema>;

// ========================================
// 3. 主组件
// ========================================
export default function BusinessRegister() {
  const { toast } = useToast();

  // 3.1 表单初始化
  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      description: '',
      abn: '',
      abnRegisteredName: '',
      firstName: '',
      lastName: '',
      jobTitle: '',
      categories: [],
      primaryCategory: '',
      streetNumber: '',
      streetName: '',
      suburb: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Australia',
      phone: '',
      email: '',
      contactPersonName: '',
      contactPersonEmail: '',
      contactPersonPhone: '',
      logo: '',
      website: '',
      facebook: '',
      twitter: '',
    },
  });

  // 3.2 可折叠区块状态
  const [sectionsOpen, setSectionsOpen] = useState({
    basicInfo: true,
    abnInfo: false,
    adminInfo: false,
    categories: false,
    address: false,
    contact: false,
    contactPerson: false,
    branding: false,
  });

  // 3.3 切换区块
  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // 3.4 处理类别选择
  const handleCategoryToggle = (category: string) => {
    const currentCategories = form.getValues('categories');
    if (currentCategories.includes(category)) {
      form.setValue(
        'categories',
        currentCategories.filter(c => c !== category)
      );
    } else {
      form.setValue('categories', [...currentCategories, category]);
    }
  };

  // 3.5 检查区块完成状态
  const getFieldCompletion = (section: keyof typeof sectionsOpen): boolean => {
    const values = form.getValues();

    switch (section) {
      case 'basicInfo':
        return !!(values.name && values.description);
      case 'abnInfo':
        return !!(values.abn && values.abnRegisteredName);
      case 'adminInfo':
        return !!(values.firstName && values.lastName && values.jobTitle);
      case 'categories':
        return !!(values.categories?.length && values.primaryCategory);
      case 'address':
        return !!(
          values.streetNumber &&
          values.streetName &&
          values.city &&
          values.postalCode
        );
      case 'contact':
        return !!(values.phone && values.email);
      case 'contactPerson':
        return !!(
          values.contactPersonName &&
          values.contactPersonEmail &&
          values.contactPersonPhone
        );
      case 'branding':
        return true; // Optional section
      default:
        return false;
    }
  };

  // 3.6 提交表单（纯视觉，只显示成功消息）
  const onSubmit = (data: BusinessFormData) => {
    console.log('Form submitted (Demo mode):', data);

    toast({
      title: 'Welcome to Zendulge! 🎉',
      description:
        'Your business registration has been submitted (Demo mode - no data saved)',
    });

    // 重置表单
    form.reset();
  };

  // ========================================
  // 4. 渲染 UI
  // ========================================
  return (
    <div className='min-h-screen bg-gradient-to-br from-frosted-lilac to-white py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <div className='w-16 h-16 bg-shadow-lavender rounded-full flex items-center justify-center'>
              <Building2 className='w-8 h-8 text-white' />
            </div>
          </div>
          <h1 className='text-3xl font-bold text-shadow-lavender mb-2'>
            Register Your Business
          </h1>
          <p className='text-gray-600'>
            Join Zendulge and start offering your wellness services
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className='p-6'>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* ============================================ */}
              {/* Section 1: Basic Information */}
              {/* ============================================ */}
              <Collapsible
                open={sectionsOpen.basicInfo}
                onOpenChange={() => toggleSection('basicInfo')}
              >
                <Card>
                  <CollapsibleTrigger className='w-full'>
                    <CardHeader className='cursor-pointer hover:bg-gray-50 transition-colors'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <Building className='w-5 h-5 text-shadow-lavender' />
                          <CardTitle className='text-lg'>
                            Basic Information
                          </CardTitle>
                          {getFieldCompletion('basicInfo') && (
                            <CheckCircle className='w-5 h-5 text-green-500' />
                          )}
                        </div>
                        {sectionsOpen.basicInfo ? (
                          <ChevronDown className='w-5 h-5 text-gray-500' />
                        ) : (
                          <ChevronRight className='w-5 h-5 text-gray-500' />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className='pt-0 space-y-4'>
                      {/* Business Name */}
                      <div className='space-y-2'>
                        <Label htmlFor='name'>Business Name *</Label>
                        <Input
                          id='name'
                          placeholder='e.g., Serenity Spa & Wellness'
                          {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div className='space-y-2'>
                        <Label htmlFor='description'>
                          Business Description
                        </Label>
                        <Textarea
                          id='description'
                          placeholder='Tell us about your business and services...'
                          rows={4}
                          {...form.register('description')}
                        />
                        {form.formState.errors.description && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.description.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* ============================================ */}
              {/* Section 2: ABN Information */}
              {/* ============================================ */}
              <Collapsible
                open={sectionsOpen.abnInfo}
                onOpenChange={() => toggleSection('abnInfo')}
              >
                <Card>
                  <CollapsibleTrigger className='w-full'>
                    <CardHeader className='cursor-pointer hover:bg-gray-50 transition-colors'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <Hash className='w-5 h-5 text-shadow-lavender' />
                          <CardTitle className='text-lg'>
                            ABN Information
                          </CardTitle>
                          {getFieldCompletion('abnInfo') && (
                            <CheckCircle className='w-5 h-5 text-green-500' />
                          )}
                        </div>
                        {sectionsOpen.abnInfo ? (
                          <ChevronDown className='w-5 h-5 text-gray-500' />
                        ) : (
                          <ChevronRight className='w-5 h-5 text-gray-500' />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className='pt-0 space-y-4'>
                      {/* ABN Number */}
                      <div className='space-y-2'>
                        <Label htmlFor='abn'>
                          Australian Business Number (ABN) *
                        </Label>
                        <Input
                          id='abn'
                          placeholder='12 345 678 901'
                          {...form.register('abn')}
                          onChange={e => {
                            // Auto-format ABN with spaces
                            let value = e.target.value.replace(/\s/g, '');
                            if (value.length > 2) {
                              value = `${value.slice(0, 2)} ${value.slice(2)}`;
                            }
                            if (value.length > 6) {
                              value = `${value.slice(0, 6)} ${value.slice(6)}`;
                            }
                            if (value.length > 10) {
                              value = `${value.slice(0, 10)} ${value.slice(10, 14)}`;
                            }
                            form.setValue('abn', value);
                          }}
                        />
                        {form.formState.errors.abn && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.abn.message}
                          </p>
                        )}
                        <p className='text-xs text-gray-500'>
                          Enter your 11-digit ABN. You can look it up at{' '}
                          <a
                            href='https://abr.business.gov.au/'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-shadow-lavender underline'
                          >
                            ABN Lookup
                          </a>
                        </p>
                      </div>

                      {/* ABN Registered Name */}
                      <div className='space-y-2'>
                        <Label htmlFor='abnRegisteredName'>
                          ABN Registered Business Name *
                        </Label>
                        <Input
                          id='abnRegisteredName'
                          placeholder='Official registered business name'
                          {...form.register('abnRegisteredName')}
                        />
                        {form.formState.errors.abnRegisteredName && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.abnRegisteredName.message}
                          </p>
                        )}
                        <p className='text-xs text-gray-500'>
                          This must match the name registered with your ABN
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* ============================================ */}
              {/* Section 3: Admin Information */}
              {/* ============================================ */}
              <Collapsible
                open={sectionsOpen.adminInfo}
                onOpenChange={() => toggleSection('adminInfo')}
              >
                <Card>
                  <CollapsibleTrigger className='w-full'>
                    <CardHeader className='cursor-pointer hover:bg-gray-50 transition-colors'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <User className='w-5 h-5 text-shadow-lavender' />
                          <CardTitle className='text-lg'>
                            Administrator Information
                          </CardTitle>
                          {getFieldCompletion('adminInfo') && (
                            <CheckCircle className='w-5 h-5 text-green-500' />
                          )}
                        </div>
                        {sectionsOpen.adminInfo ? (
                          <ChevronDown className='w-5 h-5 text-gray-500' />
                        ) : (
                          <ChevronRight className='w-5 h-5 text-gray-500' />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className='pt-0 space-y-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* First Name */}
                        <div className='space-y-2'>
                          <Label htmlFor='firstName'>First Name *</Label>
                          <Input
                            id='firstName'
                            placeholder='John'
                            {...form.register('firstName')}
                          />
                          {form.formState.errors.firstName && (
                            <p className='text-sm text-red-500'>
                              {form.formState.errors.firstName.message}
                            </p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div className='space-y-2'>
                          <Label htmlFor='lastName'>Last Name *</Label>
                          <Input
                            id='lastName'
                            placeholder='Smith'
                            {...form.register('lastName')}
                          />
                          {form.formState.errors.lastName && (
                            <p className='text-sm text-red-500'>
                              {form.formState.errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Job Title */}
                      <div className='space-y-2'>
                        <Label htmlFor='jobTitle'>Job Title *</Label>
                        <Input
                          id='jobTitle'
                          placeholder='e.g., Owner, Manager, Director'
                          {...form.register('jobTitle')}
                        />
                        {form.formState.errors.jobTitle && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.jobTitle.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* ============================================ */}
              {/* Section 4: Service Categories */}
              {/* ============================================ */}
              <Collapsible
                open={sectionsOpen.categories}
                onOpenChange={() => toggleSection('categories')}
              >
                <Card>
                  <CollapsibleTrigger className='w-full'>
                    <CardHeader className='cursor-pointer hover:bg-gray-50 transition-colors'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <Building className='w-5 h-5 text-shadow-lavender' />
                          <CardTitle className='text-lg'>
                            Service Categories
                          </CardTitle>
                          {getFieldCompletion('categories') && (
                            <CheckCircle className='w-5 h-5 text-green-500' />
                          )}
                        </div>
                        {sectionsOpen.categories ? (
                          <ChevronDown className='w-5 h-5 text-gray-500' />
                        ) : (
                          <ChevronRight className='w-5 h-5 text-gray-500' />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className='pt-0 space-y-4'>
                      {/* Categories Selection */}
                      <div className='space-y-2'>
                        <Label>Select Service Categories *</Label>
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                          {WELLNESS_CATEGORIES.map(category => (
                            <div
                              key={category}
                              className='flex items-center space-x-2'
                            >
                              <Checkbox
                                id={category}
                                checked={form
                                  .watch('categories')
                                  .includes(category)}
                                onCheckedChange={() =>
                                  handleCategoryToggle(category)
                                }
                              />
                              <Label
                                htmlFor={category}
                                className='text-sm font-normal capitalize cursor-pointer'
                              >
                                {category}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {form.formState.errors.categories && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.categories.message}
                          </p>
                        )}
                      </div>

                      {/* Primary Category */}
                      <div className='space-y-2'>
                        <Label htmlFor='primaryCategory'>
                          Primary Category *
                        </Label>
                        <Select
                          value={form.watch('primaryCategory')}
                          onValueChange={value =>
                            form.setValue('primaryCategory', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select primary category' />
                          </SelectTrigger>
                          <SelectContent>
                            {form.watch('categories').map(category => (
                              <SelectItem
                                key={category}
                                value={category}
                                className='capitalize'
                              >
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.primaryCategory && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.primaryCategory.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* ============================================ */}
              {/* Section 5: Address */}
              {/* ============================================ */}
              <Collapsible
                open={sectionsOpen.address}
                onOpenChange={() => toggleSection('address')}
              >
                <Card>
                  <CollapsibleTrigger className='w-full'>
                    <CardHeader className='cursor-pointer hover:bg-gray-50 transition-colors'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <MapPin className='w-5 h-5 text-shadow-lavender' />
                          <CardTitle className='text-lg'>
                            Business Address
                          </CardTitle>
                          {getFieldCompletion('address') && (
                            <CheckCircle className='w-5 h-5 text-green-500' />
                          )}
                        </div>
                        {sectionsOpen.address ? (
                          <ChevronDown className='w-5 h-5 text-gray-500' />
                        ) : (
                          <ChevronRight className='w-5 h-5 text-gray-500' />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className='pt-0 space-y-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Street Number */}
                        <div className='space-y-2'>
                          <Label htmlFor='streetNumber'>Street Number *</Label>
                          <Input
                            id='streetNumber'
                            placeholder='123'
                            {...form.register('streetNumber')}
                          />
                          {form.formState.errors.streetNumber && (
                            <p className='text-sm text-red-500'>
                              {form.formState.errors.streetNumber.message}
                            </p>
                          )}
                        </div>

                        {/* Street Name */}
                        <div className='space-y-2'>
                          <Label htmlFor='streetName'>Street Name *</Label>
                          <Input
                            id='streetName'
                            placeholder='Main Street'
                            {...form.register('streetName')}
                          />
                          {form.formState.errors.streetName && (
                            <p className='text-sm text-red-500'>
                              {form.formState.errors.streetName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Suburb */}
                        <div className='space-y-2'>
                          <Label htmlFor='suburb'>Suburb</Label>
                          <Input
                            id='suburb'
                            placeholder='Suburb'
                            {...form.register('suburb')}
                          />
                        </div>

                        {/* City */}
                        <div className='space-y-2'>
                          <Label htmlFor='city'>City *</Label>
                          <Input
                            id='city'
                            placeholder='Sydney'
                            {...form.register('city')}
                          />
                          {form.formState.errors.city && (
                            <p className='text-sm text-red-500'>
                              {form.formState.errors.city.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {/* State */}
                        <div className='space-y-2'>
                          <Label htmlFor='state'>State *</Label>
                          <Select
                            value={form.watch('state')}
                            onValueChange={value =>
                              form.setValue('state', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Select state' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='NSW'>NSW</SelectItem>
                              <SelectItem value='VIC'>VIC</SelectItem>
                              <SelectItem value='QLD'>QLD</SelectItem>
                              <SelectItem value='SA'>SA</SelectItem>
                              <SelectItem value='WA'>WA</SelectItem>
                              <SelectItem value='TAS'>TAS</SelectItem>
                              <SelectItem value='NT'>NT</SelectItem>
                              <SelectItem value='ACT'>ACT</SelectItem>
                            </SelectContent>
                          </Select>
                          {form.formState.errors.state && (
                            <p className='text-sm text-red-500'>
                              {form.formState.errors.state.message}
                            </p>
                          )}
                        </div>

                        {/* Postal Code */}
                        <div className='space-y-2'>
                          <Label htmlFor='postalCode'>Postal Code *</Label>
                          <Input
                            id='postalCode'
                            placeholder='2000'
                            {...form.register('postalCode')}
                          />
                          {form.formState.errors.postalCode && (
                            <p className='text-sm text-red-500'>
                              {form.formState.errors.postalCode.message}
                            </p>
                          )}
                        </div>

                        {/* Country */}
                        <div className='space-y-2'>
                          <Label htmlFor='country'>Country</Label>
                          <Input
                            id='country'
                            value='Australia'
                            disabled
                            {...form.register('country')}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* ============================================ */}
              {/* Section 6: Contact Information */}
              {/* ============================================ */}
              <Collapsible
                open={sectionsOpen.contact}
                onOpenChange={() => toggleSection('contact')}
              >
                <Card>
                  <CollapsibleTrigger className='w-full'>
                    <CardHeader className='cursor-pointer hover:bg-gray-50 transition-colors'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <Phone className='w-5 h-5 text-shadow-lavender' />
                          <CardTitle className='text-lg'>
                            Business Contact
                          </CardTitle>
                          {getFieldCompletion('contact') && (
                            <CheckCircle className='w-5 h-5 text-green-500' />
                          )}
                        </div>
                        {sectionsOpen.contact ? (
                          <ChevronDown className='w-5 h-5 text-gray-500' />
                        ) : (
                          <ChevronRight className='w-5 h-5 text-gray-500' />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className='pt-0 space-y-4'>
                      {/* Phone */}
                      <div className='space-y-2'>
                        <Label htmlFor='phone'>Business Phone *</Label>
                        <Input
                          id='phone'
                          type='tel'
                          placeholder='+61 4XX XXX XXX'
                          {...form.register('phone')}
                        />
                        {form.formState.errors.phone && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.phone.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className='space-y-2'>
                        <Label htmlFor='email'>Business Email *</Label>
                        <Input
                          id='email'
                          type='email'
                          placeholder='contact@business.com'
                          {...form.register('email')}
                        />
                        {form.formState.errors.email && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* ============================================ */}
              {/* Section 7: Contact Person */}
              {/* ============================================ */}
              <Collapsible
                open={sectionsOpen.contactPerson}
                onOpenChange={() => toggleSection('contactPerson')}
              >
                <Card>
                  <CollapsibleTrigger className='w-full'>
                    <CardHeader className='cursor-pointer hover:bg-gray-50 transition-colors'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <User className='w-5 h-5 text-shadow-lavender' />
                          <CardTitle className='text-lg'>
                            Contact Person
                          </CardTitle>
                          {getFieldCompletion('contactPerson') && (
                            <CheckCircle className='w-5 h-5 text-green-500' />
                          )}
                        </div>
                        {sectionsOpen.contactPerson ? (
                          <ChevronDown className='w-5 h-5 text-gray-500' />
                        ) : (
                          <ChevronRight className='w-5 h-5 text-gray-500' />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className='pt-0 space-y-4'>
                      {/* Contact Person Name */}
                      <div className='space-y-2'>
                        <Label htmlFor='contactPersonName'>Full Name *</Label>
                        <Input
                          id='contactPersonName'
                          placeholder='Contact person name'
                          {...form.register('contactPersonName')}
                        />
                        {form.formState.errors.contactPersonName && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.contactPersonName.message}
                          </p>
                        )}
                      </div>

                      {/* Contact Person Email */}
                      <div className='space-y-2'>
                        <Label htmlFor='contactPersonEmail'>Email *</Label>
                        <Input
                          id='contactPersonEmail'
                          type='email'
                          placeholder='contact@business.com'
                          {...form.register('contactPersonEmail')}
                        />
                        {form.formState.errors.contactPersonEmail && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.contactPersonEmail.message}
                          </p>
                        )}
                      </div>

                      {/* Contact Person Phone */}
                      <div className='space-y-2'>
                        <Label htmlFor='contactPersonPhone'>Phone *</Label>
                        <Input
                          id='contactPersonPhone'
                          type='tel'
                          placeholder='+61 4XX XXX XXX'
                          {...form.register('contactPersonPhone')}
                        />
                        {form.formState.errors.contactPersonPhone && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.contactPersonPhone.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* ============================================ */}
              {/* Section 8: Branding (Optional) */}
              {/* ============================================ */}
              <Collapsible
                open={sectionsOpen.branding}
                onOpenChange={() => toggleSection('branding')}
              >
                <Card>
                  <CollapsibleTrigger className='w-full'>
                    <CardHeader className='cursor-pointer hover:bg-gray-50 transition-colors'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <Building className='w-5 h-5 text-shadow-lavender' />
                          <CardTitle className='text-lg'>
                            Branding (Optional)
                          </CardTitle>
                          <Badge variant='secondary'>Optional</Badge>
                        </div>
                        {sectionsOpen.branding ? (
                          <ChevronDown className='w-5 h-5 text-gray-500' />
                        ) : (
                          <ChevronRight className='w-5 h-5 text-gray-500' />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className='pt-0 space-y-4'>
                      {/* Logo URL */}
                      <div className='space-y-2'>
                        <Label htmlFor='logo'>Logo URL</Label>
                        <Input
                          id='logo'
                          placeholder='https://example.com/logo.png'
                          {...form.register('logo')}
                        />
                        {form.formState.errors.logo && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.logo.message}
                          </p>
                        )}
                      </div>

                      {/* Website */}
                      <div className='space-y-2'>
                        <Label htmlFor='website'>Website</Label>
                        <Input
                          id='website'
                          placeholder='https://www.yourwebsite.com'
                          {...form.register('website')}
                        />
                        {form.formState.errors.website && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.website.message}
                          </p>
                        )}
                      </div>

                      {/* Facebook */}
                      <div className='space-y-2'>
                        <Label htmlFor='facebook'>Facebook</Label>
                        <Input
                          id='facebook'
                          placeholder='https://facebook.com/yourpage'
                          {...form.register('facebook')}
                        />
                        {form.formState.errors.facebook && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.facebook.message}
                          </p>
                        )}
                      </div>

                      {/* Twitter */}
                      <div className='space-y-2'>
                        <Label htmlFor='twitter'>Twitter</Label>
                        <Input
                          id='twitter'
                          placeholder='https://twitter.com/yourhandle'
                          {...form.register('twitter')}
                        />
                        {form.formState.errors.twitter && (
                          <p className='text-sm text-red-500'>
                            {form.formState.errors.twitter.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* ============================================ */}
              {/* Submit Button */}
              {/* ============================================ */}
              <div className='flex justify-end gap-4 pt-6'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => form.reset()}
                >
                  Reset Form
                </Button>
                <Button
                  type='submit'
                  className='bg-shadow-lavender hover:bg-shadow-lavender/90'
                >
                  Submit Registration
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Note */}
        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md'>
          <p className='text-sm text-blue-800 text-center'>
            <strong>Demo Mode:</strong> This is a visual demonstration. No data
            will be saved.
          </p>
        </div>
      </div>
    </div>
  );
}
