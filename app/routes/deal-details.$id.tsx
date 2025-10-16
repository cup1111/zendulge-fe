import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  Star,
  Tag,
  Users,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { getDealById, type DealDetail } from '~/lib/mockData';

export default function DealDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const dealId = params.id ? parseInt(params.id, 10) : undefined;

  // 获取优惠详情
  const deal: DealDetail | undefined = dealId ? getDealById(dealId) : undefined;

  // 如果没找到优惠
  if (!dealId || !deal) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-4xl mx-auto px-4'>
          <Button
            variant='ghost'
            onClick={() => navigate('/')}
            className='mb-6'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Deals
          </Button>
          <div className='text-center py-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
              Deal Not Found
            </h2>
            <p className='text-gray-600'>
              The deal you're looking for doesn't exist or has expired.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 计算折扣百分比
  const { discountPercentage } = deal;

  // 获取紧急程度颜色
  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // 计算剩余时间
  const getTimeRemaining = () => {
    const now = new Date();
    const validUntil = new Date(deal.validUntil);
    const diffMs = validUntil.getTime() - now.getTime();

    if (diffMs <= 0) return 'Expired';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  // 生成未来7天的时间段
  const generateTimeSlots = () => {
    const slots = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      slots.push({
        date,
        time: i % 2 === 0 ? '3:00 PM - 4:00 PM' : '10:00 AM - 11:00 AM',
        available: true,
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-4xl mx-auto px-4 py-4'>
          <Button
            variant='ghost'
            onClick={() => navigate('/')}
            className='mb-2'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Deals
          </Button>
          <h1 className='text-2xl font-bold text-gray-900'>
            {deal.serviceName}
          </h1>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Images Gallery */}
            <Card className='overflow-hidden'>
              <div className='w-full'>
                {/* Main Image */}
                <div className='w-full h-64 relative bg-gradient-to-br from-frosted-lilac to-shadow-lavender/20'>
                  {deal.urgencyLevel && deal.urgencyLevel !== 'low' && (
                    <div className='absolute top-4 right-4 z-10'>
                      <Badge
                        className={`${getUrgencyColor(deal.urgencyLevel)} border`}
                      >
                        <Clock className='w-3 h-3 mr-1' />
                        {getTimeRemaining()}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Deal Description */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <span>Deal Details</span>
                  <Badge className='bg-green-100 text-green-700'>
                    {discountPercentage}% off
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-gray-700'>{deal.description}</p>

                <Separator />

                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Tag className='w-4 h-4 mr-2' />
                    <span>{deal.category}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Users className='w-4 h-4 mr-2' />
                    <span>
                      {deal.availableSlots - deal.usedSlots} slots available
                    </span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Calendar className='w-4 h-4 mr-2' />
                    <span>
                      Valid until{' '}
                      {new Date(deal.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <CheckCircle className='w-4 h-4 mr-2' />
                    <span>Instant booking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Calendar className='w-5 h-5 mr-2' />
                  Available Time Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {timeSlots.map(slot => (
                    <div
                      key={slot.date.toISOString()}
                      className='p-3 border border-gray-200 rounded-lg hover:border-shadow-lavender hover:bg-gray-50 cursor-pointer transition-colors'
                    >
                      <div className='font-medium text-gray-900'>
                        {slot.date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className='text-sm text-gray-600 mt-1'>
                        {slot.time}
                      </div>
                      <div className='text-xs text-green-600 mt-1'>
                        Available
                      </div>
                    </div>
                  ))}
                </div>
                <div className='mt-4 text-center'>
                  <Button className='bg-shadow-lavender text-pure-white hover:bg-shadow-lavender/90'>
                    Select Time & Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Building2 className='w-5 h-5 mr-2' />
                  About {deal.businessName}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-start'>
                  <MapPin className='w-4 h-4 mr-2 mt-1 text-gray-500' />
                  <span className='text-sm text-gray-700'>{deal.address}</span>
                </div>

                {deal.businessPhone && (
                  <div className='flex items-center'>
                    <Phone className='w-4 h-4 mr-2 text-gray-500' />
                    <span className='text-sm text-gray-700'>
                      {deal.businessPhone}
                    </span>
                  </div>
                )}

                {deal.businessEmail && (
                  <div className='flex items-center'>
                    <Mail className='w-4 h-4 mr-2 text-gray-500' />
                    <span className='text-sm text-gray-700'>
                      {deal.businessEmail}
                    </span>
                  </div>
                )}

                {deal.businessWebsite && (
                  <div className='flex items-center'>
                    <Globe className='w-4 h-4 mr-2 text-gray-500' />
                    <a
                      href={deal.businessWebsite}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-shadow-lavender hover:underline'
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            {deal.reviews && deal.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Star className='w-5 h-5 mr-2' />
                    Customer Reviews ({deal.reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {deal.reviews.map(review => (
                    <div
                      key={review.id}
                      className='border-b last:border-b-0 pb-4 last:pb-0'
                    >
                      <div className='flex items-start gap-3'>
                        <Avatar className='w-10 h-10'>
                          <AvatarFallback className='bg-shadow-lavender/10 text-shadow-lavender'>
                            {review.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                          <div className='flex items-center justify-between mb-1'>
                            <span className='font-medium text-gray-900'>
                              {review.userName}
                            </span>
                            <span className='text-xs text-gray-500'>
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className='text-sm text-gray-700'>
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Pricing Card */}
          <div className='space-y-6'>
            <Card className='sticky top-8'>
              <CardHeader>
                <CardTitle className='text-center'>Book This Deal</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='text-center'>
                  <div className='flex items-center justify-center gap-2 mb-2'>
                    <span className='text-3xl font-bold text-shadow-lavender'>
                      ${deal.discountedPrice}
                    </span>
                    <span className='text-lg text-gray-400 line-through'>
                      ${deal.originalPrice}
                    </span>
                  </div>
                  <Badge className='bg-green-100 text-green-700'>
                    Save ${deal.originalPrice - deal.discountedPrice}
                  </Badge>
                </div>

                <Separator />

                <div className='space-y-3'>
                  <Button
                    className='w-full bg-shadow-lavender text-pure-white hover:bg-shadow-lavender/90'
                    size='default'
                  >
                    Book Now
                  </Button>

                  <Button
                    variant='ghost'
                    size='default'
                    className='w-full gap-2'
                  >
                    <Heart className='w-4 h-4' />
                    Save for later
                  </Button>
                </div>

                <div className='text-xs text-gray-500 text-center space-y-1'>
                  <p>✓ Instant confirmation</p>
                  <p>✓ Secure payment</p>
                  <p>✓ 24/7 customer support</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
