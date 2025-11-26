import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  MapPin,
  Tag,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { useAuth } from '~/hooks/useAuth';
import { useToast } from '~/hooks/useToast';
import PublicDealService, {
  type PublicDeal,
  type TimeSlot,
} from '~/services/publicDealService';

import SavedDealService from '../services/savedDealService';

export default function DealDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const dealId = params.id;
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [deal, setDeal] = useState<PublicDeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!dealId) {
        setError('Deal not found');
        setLoading(false);
        return;
      }
      try {
        const data = await PublicDealService.getById(dealId);
        if (mounted) setDeal(data);
      } catch {
        if (mounted) setError('Deal not found');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [dealId]);

  useEffect(() => {
    let mounted = true;
    const checkSaved = async () => {
      if (!dealId) {
        setIsSaved(false);
        return;
      }

      if (!isAuthenticated) {
        const guestSaved =
          SavedDealService.getGuestSavedDeals().includes(dealId);
        setIsSaved(guestSaved);
        return;
      }

      try {
        const saved = await SavedDealService.isSaved(dealId);
        if (mounted) setIsSaved(saved);
      } catch {
        if (mounted) setIsSaved(false);
      }
    };
    checkSaved();
    return () => {
      mounted = false;
    };
  }, [dealId, isAuthenticated]);

  if (loading) {
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
              Loading…
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // 如果没找到优惠
  if (!deal || error) {
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
              The deal you&apos;re looking for doesn&apos;t exist or has
              expired.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 计算折扣百分比
  const discountPercentage =
    deal.originalPrice && deal.price
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(
              ((deal.originalPrice - deal.price) / deal.originalPrice) * 100
            )
          )
        )
      : undefined;

  // Convert 24-hour time to 12-hour format
  const formatTimeTo12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Format time slot for display
  const formatTimeSlot = (slot: TimeSlot) => {
    const date = new Date(slot.dateTime || slot.date);
    const startTime12h = formatTimeTo12Hour(slot.startTime);
    const endTime12h = formatTimeTo12Hour(slot.endTime);
    return {
      date,
      dateStr: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
      time: `${startTime12h} - ${endTime12h}`,
      available: slot.available,
    };
  };

  const timeSlots = deal.availableTimeSlots?.map(formatTimeSlot) ?? [];

  const handleSaveForLater = async () => {
    if (!dealId) return;
    if (isSaved || isSaving) return;

    if (!isAuthenticated) {
      SavedDealService.saveGuestSavedDeal(dealId);
      setIsSaved(true);
      toast({
        title: 'Saved locally',
        description: 'We will sync this deal to your account after you log in.',
      });
      return;
    }

    try {
      setIsSaving(true);
      const resp = await SavedDealService.save(dealId);
      setIsSaved(true);
      const alreadySaved = resp?.message?.toLowerCase().includes('already');
      toast({
        title: alreadySaved ? 'Already saved' : 'Saved',
        description: alreadySaved
          ? 'This deal is already in your saved list.'
          : 'Deal has been saved for later.',
      });
    } catch (err: unknown) {
      toast({
        title: 'Save failed',
        description:
          err instanceof Error
            ? err.message
            : 'Failed to save deal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

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
            {deal.service?.name || deal.title}
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
                <div className='w-full h-64 relative bg-gradient-to-br from-frosted-lilac to-shadow-lavender/20' />
              </div>
            </Card>

            {/* Deal Description */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <span>Deal Details</span>
                  {discountPercentage !== undefined && (
                    <Badge className='bg-green-100 text-green-700'>
                      {discountPercentage}% off
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-gray-700'>{deal.description}</p>

                <Separator />

                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Tag className='w-4 h-4 mr-2' />
                    <span>
                      {deal.category ?? deal.service?.category ?? '—'}
                    </span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Users className='w-4 h-4 mr-2' />
                    <span>Slots info not available</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Calendar className='w-4 h-4 mr-2' />
                    <span>
                      {deal.recurrenceType === 'none'
                        ? `Valid on ${deal.startDate ? new Date(deal.startDate).toLocaleDateString() : '—'}`
                        : `Recurring: ${deal.recurrenceType}`}
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
                {timeSlots.length > 0 ? (
                  <>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {timeSlots.map(slot => (
                        <div
                          key={`${slot.date.toISOString()}-${slot.time}`}
                          className='p-3 border border-gray-200 rounded-lg hover:border-shadow-lavender hover:bg-gray-50 cursor-pointer transition-colors'
                        >
                          <div className='font-medium text-gray-900'>
                            {slot.dateStr}
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
                  </>
                ) : (
                  <div className='text-center py-8 text-gray-500'>
                    No available time slots within the next 2 weeks.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Building2 className='w-5 h-5 mr-2' />
                  About {deal.business?.name ?? 'Business'}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {deal.sites && deal.sites.length > 0 && (
                  <div className='flex items-start'>
                    <MapPin className='w-4 h-4 mr-2 mt-1 text-gray-500' />
                    <span className='text-sm text-gray-700'>
                      {deal.sites[0].address}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
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
                      {deal.price != null ? `$${deal.price}` : '—'}
                    </span>
                    <span className='text-lg text-gray-400 line-through'>
                      {deal.originalPrice != null
                        ? `$${deal.originalPrice}`
                        : ''}
                    </span>
                  </div>
                  {deal.originalPrice != null &&
                    deal.price != null &&
                    deal.originalPrice > deal.price && (
                      <Badge className='bg-green-100 text-green-700'>
                        Save ${deal.originalPrice - deal.price}
                      </Badge>
                    )}
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
                    disabled={isSaved || isSaving}
                    onClick={handleSaveForLater}
                  >
                    {isSaved ? 'Saved' : 'Save for later'}
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
