import { ArrowLeft, Building2, Calendar, MapPin, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import PublicDealService, {
  type Location,
  type PublicDeal,
  type TimeSlot,
} from '~/services/publicDealService';
import type { Service } from '~/services/serviceService';
import * as ServiceServiceModule from '~/services/serviceService';

const ServiceService = ServiceServiceModule.default;

type Step = 'locations' | 'deals' | 'timeSlots';

export default function ServicePage() {
  const params = useParams();
  const navigate = useNavigate();
  const serviceId = params.id;

  const [service, setService] = useState<Service | null>(null);
  const [step, setStep] = useState<Step>('locations');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedDeal, setSelectedDeal] = useState<PublicDeal | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);
  const [deals, setDeals] = useState<PublicDeal[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deal, setDeal] = useState<PublicDeal | null>(null);
  const [timeSlots, setTimeSlots] = useState<
    Array<{
      date: Date;
      dateStr: string;
      time: string;
      available: boolean;
    }>
  >([]);

  const [loadingService, setLoadingService] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [loadingDeal, setLoadingDeal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load service details
  useEffect(() => {
    if (!serviceId) {
      setError('Service ID is required');
      setLoading(false);
      return undefined;
    }

    let mounted = true;
    const loadService = async () => {
      setLoadingService(true);
      try {
        const data = await ServiceService.getPublicServiceById(serviceId);
        if (mounted) setService(data);
      } catch (err) {
        if (mounted) setError('Failed to load service details');
      } finally {
        if (mounted) setLoadingService(false);
      }
    };

    loadService();
    return () => {
      mounted = false;
    };
  }, [serviceId]);

  // Load locations for service
  useEffect(() => {
    if (!serviceId) {
      return undefined;
    }

    let mounted = true;
    const loadLocations = async () => {
      setLoadingLocations(true);
      setError(null);
      try {
        const data = await PublicDealService.getLocationsForService(serviceId);
        if (mounted) {
          setLocations(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load locations');
          setLoading(false);
        }
      } finally {
        if (mounted) setLoadingLocations(false);
      }
    };

    loadLocations();
    return () => {
      mounted = false;
    };
  }, [serviceId]);

  // Load deals when location is selected
  useEffect(() => {
    if (!selectedLocation || step !== 'deals') return undefined;

    let mounted = true;
    const loadDeals = async () => {
      setLoadingDeals(true);
      try {
        const data = await PublicDealService.getDealsForLocation(
          selectedLocation.id
        );
        if (mounted) setDeals(data);
      } catch (err) {
        if (mounted) setError('Failed to load deals');
      } finally {
        if (mounted) setLoadingDeals(false);
      }
    };

    loadDeals();
    return () => {
      mounted = false;
    };
  }, [selectedLocation, step]);

  // Convert 24-hour time to 12-hour format
  const formatTimeTo12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Load deal details and time slots when deal is selected (even if still on deals step)
  useEffect(() => {
    if (!selectedDeal) {
      setDeal(null);
      setTimeSlots([]);
      return undefined;
    }

    let mounted = true;
    const loadDeal = async () => {
      setLoadingDeal(true);
      try {
        const data = await PublicDealService.getById(selectedDeal.id);
        if (mounted) {
          setDeal(data);
          // Format time slots for display
          const formattedSlots = (data.availableTimeSlots ?? []).map(
            (slot: TimeSlot) => {
              const date = new Date(slot.dateTime ?? slot.date);
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
            }
          );
          setTimeSlots(formattedSlots);
        }
      } catch (err) {
        if (mounted) setError('Failed to load deal details');
      } finally {
        if (mounted) setLoadingDeal(false);
      }
    };

    loadDeal();
    return () => {
      mounted = false;
    };
  }, [selectedDeal]);

  // discountPercentage is now calculated in renderDealsStep

  const renderLocationsStep = () => (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <MapPin className='w-5 h-5 mr-2' />
            Select a Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            if (loadingLocations) {
              return (
                <div className='text-center py-8 text-gray-500'>
                  Loading locations…
                </div>
              );
            }
            if (error) {
              return (
                <div className='text-center py-8 text-red-500'>{error}</div>
              );
            }
            if (locations.length > 0) {
              return (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {locations.map(loc => (
                    <div
                      key={loc.id}
                      className='p-4 border border-gray-200 rounded-lg hover:border-shadow-lavender hover:bg-gray-50 cursor-pointer transition-colors'
                      role='button'
                      tabIndex={0}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setStep('deals');
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedLocation(loc);
                          setStep('deals');
                        }
                      }}
                    >
                      <div className='flex items-start gap-3'>
                        <MapPin className='w-5 h-5 text-shadow-lavender mt-1' />
                        <div className='flex-1'>
                          <h3 className='font-semibold text-gray-900 mb-1'>
                            {loc.name}
                          </h3>
                          <p className='text-sm text-gray-600 mb-1'>
                            {loc.business.name}
                          </p>
                          <p className='text-xs text-gray-500'>{loc.address}</p>
                          {loc.distance !== undefined && (
                            <p className='text-xs text-shadow-lavender font-medium mt-1'>
                              {loc.distance.toFixed(1)} km away
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div className='text-center py-8 text-gray-500'>
                No locations available
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );

  const renderDealsStep = () => (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span className='flex items-center'>
              <Tag className='w-5 h-5 mr-2' />
              Select a Deal
            </span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                setStep('locations');
                setSelectedLocation(null);
                setSelectedDeal(null);
                setDeals([]);
                setDeal(null);
                setTimeSlots([]);
              }}
            >
              Change Location
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedLocation && (
            <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-600'>
                <MapPin className='w-4 h-4 inline mr-1' />
                {selectedLocation.name} - {selectedLocation.address}
              </p>
            </div>
          )}
          {(() => {
            if (loadingDeals) {
              return (
                <div className='text-center py-8 text-gray-500'>
                  Loading deals…
                </div>
              );
            }
            if (error) {
              return (
                <div className='text-center py-8 text-red-500'>{error}</div>
              );
            }
            if (deals.length > 0) {
              return (
                <div className='space-y-4'>
                  {deals.map(d => (
                    <div key={d.id} className='space-y-4'>
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedDeal?.id === d.id
                            ? 'border-shadow-lavender bg-shadow-lavender/5'
                            : 'border-gray-200 hover:border-shadow-lavender hover:bg-gray-50'
                        }`}
                        role='button'
                        tabIndex={0}
                        onClick={() => {
                          setSelectedDeal(d);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedDeal(d);
                          }
                        }}
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <h3 className='font-semibold text-gray-900 mb-1'>
                              {d.service?.name || d.title}
                            </h3>

                            <p className='text-sm text-gray-600 mb-2'>
                              {d.description}
                            </p>
                            <div className='flex items-center gap-4 text-xs text-gray-500'>
                              {d.duration && (
                                <span>Duration: {d.duration} min</span>
                              )}
                              {d.category && (
                                <span>Category: {d.category}</span>
                              )}
                            </div>
                          </div>
                          <div className='text-right ml-4'>
                            <div className='text-2xl font-bold text-shadow-lavender'>
                              {d.price != null ? `$${d.price}` : '—'}
                            </div>
                            {d.originalPrice != null && (
                              <div className='text-sm text-gray-400 line-through'>
                                ${d.originalPrice}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Show time slots inline when this deal is selected */}
                      {selectedDeal?.id === d.id && (
                        <Card className='ml-4 border-shadow-lavender/20'>
                          <CardHeader>
                            <CardTitle className='flex items-center justify-between text-lg'>
                              <span className='flex items-center'>
                                <Calendar className='w-5 h-5 mr-2' />
                                Available Time Slots
                              </span>
                              {loadingDeal && (
                                <span className='text-sm text-gray-500'>
                                  Loading…
                                </span>
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {(() => {
                              if (loadingDeal) {
                                return (
                                  <div className='text-center py-8 text-gray-500'>
                                    Loading time slots…
                                  </div>
                                );
                              }
                              if (timeSlots.length > 0) {
                                return (
                                  <>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-4'>
                                      {timeSlots.map(slot => (
                                        <div
                                          key={`${slot.date.getTime()}-${slot.time}`}
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
                                    <div className='flex items-center justify-between pt-4 border-t'>
                                      <div className='text-center flex-1'>
                                        <Button
                                          className='w-full bg-shadow-lavender text-pure-white hover:bg-shadow-lavender/90'
                                          size='default'
                                        >
                                          Book Now
                                        </Button>
                                      </div>
                                    </div>
                                  </>
                                );
                              }
                              return (
                                <div className='text-center py-8 text-gray-500'>
                                  No available time slots within the next 2
                                  weeks.
                                </div>
                              );
                            })()}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div className='text-center py-8 text-gray-500'>
                No deals available at this location
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );

  const businessInfo =
    typeof service?.business === 'object' ? service.business : null;
  const businessLogo = businessInfo?.logo;

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
            Back to Home
          </Button>
          {(() => {
            if (loadingService) {
              return (
                <h1 className='text-2xl font-bold text-gray-900'>Loading…</h1>
              );
            }
            if (service) {
              return (
                <h1 className='text-2xl font-bold text-gray-900'>
                  {service.name}
                </h1>
              );
            }
            return (
              <h1 className='text-2xl font-bold text-gray-900'>Service</h1>
            );
          })()}
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-8'>
        {/* Service Details Section */}
        {service && (
          <div className='mb-8 space-y-6'>
            {/* Service Image/Logo */}
            <Card className='overflow-hidden'>
              <div className='w-full h-64 relative bg-gradient-to-br from-frosted-lilac to-shadow-lavender/20 flex items-center justify-center'>
                {businessLogo ? (
                  <img
                    src={businessLogo}
                    alt={businessInfo?.name || 'Business logo'}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='text-shadow-lavender text-6xl font-bold'>
                    {service.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </Card>

            {/* Service Description */}
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {service.description && (
                  <p className='text-gray-700'>{service.description}</p>
                )}

                <Separator />

                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Tag className='w-4 h-4 mr-2' />
                    <span>{service.category}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Calendar className='w-4 h-4 mr-2' />
                    <span>Duration: {service.duration} min</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Building2 className='w-4 h-4 mr-2' />
                    <span>
                      {(() => {
                        if (businessInfo?.name) return businessInfo.name;
                        if (typeof service.business === 'string')
                          return 'Business';
                        return 'Unknown';
                      })()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Two-Step Flow (locations -> deals with inline time slots) */}
        {(() => {
          if (loading && step === 'locations') {
            return (
              <div className='text-center py-12'>
                <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                  Loading…
                </h2>
              </div>
            );
          }
          if (error && step === 'locations') {
            return (
              <div className='text-center py-12'>
                <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                  Error
                </h2>
                <p className='text-gray-600'>{error}</p>
              </div>
            );
          }
          if (step === 'locations') {
            return renderLocationsStep();
          }
          return renderDealsStep();
        })()}
      </div>
    </div>
  );
}
