import { Calendar, Heart, MapPin, Percent, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import appIcon from '~/assets/app-icon.png';
import heroBackground from '~/assets/massage.jpeg';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  categories,
  mockDeals,
  recentBookings,
  type Deal,
} from '~/lib/mockData';

// Deal Card Component
interface DealCardProps {
  deal: Deal;
}

const DealCard = ({ deal }: DealCardProps) => (
  <Link to={`/deal-details/${deal.id}`} className='block'>
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow'>
      {/* Deal Image */}
      <div className='relative h-48 bg-gradient-to-br from-frosted-lilac to-shadow-lavender/20'>
        <div className='absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold'>
          -{deal.discountPercentage}%
        </div>
        <button
          type='button'
          className='absolute top-3 left-3 bg-white/90 hover:bg-white p-2 rounded-full transition-colors'
        >
          <Heart className='w-5 h-5 text-gray-600' />
        </button>
      </div>

      {/* Deal Content */}
      <div className='p-4'>
        <div className='flex items-start justify-between mb-2'>
          <div className='flex-1'>
            <h3 className='font-semibold text-gray-900 text-lg mb-1 line-clamp-1'>
              {deal.serviceName}
            </h3>
            <p className='text-sm text-gray-600 mb-1'>{deal.businessName}</p>
            <p className='text-xs text-gray-500 flex items-center'>
              <MapPin className='w-3 h-3 mr-1' />
              {deal.address.split(',')[1] || deal.address}
            </p>
          </div>
        </div>

        <p className='text-sm text-gray-700 line-clamp-2 mb-3'>
          {deal.description}
        </p>

        {/* Rating */}
        {deal.rating && (
          <div className='flex items-center mb-3'>
            <span className='text-yellow-500 mr-1'>★</span>
            <span className='text-sm font-medium text-gray-900'>
              {deal.rating}
            </span>
            <span className='text-sm text-gray-500 ml-1'>
              ({deal.reviewCount} reviews)
            </span>
          </div>
        )}

        {/* Time & Slots */}
        <div className='flex items-center text-xs text-gray-600 mb-3'>
          <span className='bg-gray-100 px-2 py-1 rounded mr-2'>
            {deal.startTime} - {deal.endTime}
          </span>
          <span className='text-green-600 font-medium'>
            {deal.availableSlots} slots left
          </span>
        </div>

        {/* Pricing */}
        <div className='flex items-end justify-between pt-3 border-t border-gray-100'>
          <div>
            <div className='flex items-baseline gap-2'>
              <span className='text-2xl font-bold text-shadow-lavender'>
                ${deal.discountedPrice}
              </span>
              <span className='text-sm text-gray-500 line-through'>
                ${deal.originalPrice}
              </span>
            </div>
          </div>
          <Button
            size='sm'
            className='bg-shadow-lavender hover:bg-shadow-lavender/90'
            onClick={e => {
              e.preventDefault(); // 防止双重导航
              e.stopPropagation();
            }}
          >
            View Deal
          </Button>
        </div>
      </div>
    </div>
  </Link>
);

export default function Landing() {
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchRadius, setSearchRadius] = useState(5);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // 使用 mock 数据
  const displayedDeals = (() => {
    if (!showSearchResults) {
      return mockDeals.slice(0, 3); // 默认只显示前 3 个
    }
    if (selectedCategory) {
      return mockDeals.filter(
        deal => deal.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    return mockDeals;
  })();

  const handleFindDeals = () => {
    setShowSearchResults(true);
    // 滚动到搜索结果
    setTimeout(() => {
      document
        .getElementById('search-results-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAllDeals = () => {
    setSelectedCategory('');
    setShowSearchResults(true);
    setTimeout(() => {
      document
        .getElementById('search-results-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section
        className='relative py-8 bg-gradient-to-br from-frosted-lilac to-pure-white'
        style={{
          backgroundImage: `linear-gradient(rgba(248, 245, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-8'>
            {/* App Icon */}
            <div className='flex justify-center mb-3'>
              <img
                src={appIcon}
                alt='Zendulge App Icon'
                className='w-20 h-20 rounded-2xl shadow-lg'
              />
            </div>

            {/* Tagline */}
            <p
              className='text-4xl text-gray-900 max-w-3xl mx-auto mb-6 font-semibold'
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Discover last minute wellness deals, without the price tag!
            </p>

            {/* Recommended Section */}
            <div className='max-w-7xl mx-auto mb-10'>
              <div className='text-left mb-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                  Recommended
                </h2>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {mockDeals.slice(0, 3).map(deal => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>

            {/* Find Deals Section */}
            <div className='max-w-5xl mx-auto'>
              {/* Section Header */}
              <div className='text-center mb-6'>
                <div className='flex items-center justify-center mb-3'>
                  <div className='bg-shadow-lavender/10 p-3 rounded-full'>
                    <Search className='w-8 h-8 text-shadow-lavender' />
                  </div>
                </div>
                <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                  Find Wellness Deals
                </h2>
                <p className='text-lg text-gray-600'>
                  Discover discounted wellness services in your area
                </p>
              </div>

              <div className='bg-pure-white rounded-2xl shadow-xl border-2 border-shadow-lavender overflow-hidden relative'>
                {/* Subtle background pattern */}
                <div className='absolute inset-0 bg-gradient-to-br from-shadow-lavender/5 to-transparent pointer-events-none' />

                {/* Browse by Category */}
                <div className='relative px-6 py-5 border-b border-shadow-lavender/10 bg-gradient-to-r from-frosted-lilac/30 to-pure-white'>
                  <div className='flex items-center mb-2'>
                    <div className='bg-shadow-lavender/10 p-1.5 rounded-lg mr-3'>
                      <Search className='w-4 h-4 text-shadow-lavender' />
                    </div>
                    <h3 className='text-sm font-semibold text-gray-800'>
                      Browse by Category
                    </h3>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {categories.map(cat => (
                      <button
                        type='button'
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setShowSearchResults(true);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-shadow-lavender text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-shadow-lavender'
                        }`}
                      >
                        <span className='mr-2'>{cat.icon}</span>
                        {cat.name}
                        <span className='ml-2 text-xs opacity-75'>
                          ({cat.count})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Search Row */}
                <div className='relative p-6 pb-4 bg-gradient-to-r from-pure-white to-frosted-lilac/20'>
                  <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-8 gap-4 items-end'>
                    {/* Location Search */}
                    <div className='xl:col-span-5'>
                      <div className='flex items-center mb-3'>
                        <div className='bg-shadow-lavender/10 p-1.5 rounded-lg mr-3'>
                          <MapPin className='w-4 h-4 text-shadow-lavender' />
                        </div>
                        <h3 className='text-sm font-semibold text-gray-800'>
                          Search by Location
                        </h3>
                      </div>
                      <input
                        type='text'
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder='City, suburb, postcode, or address'
                        className='w-full h-12 px-4 border border-gray-200 focus:ring-2 focus:ring-shadow-lavender focus:border-shadow-lavender rounded-xl text-sm hover:border-gray-300 transition-colors'
                      />
                    </div>

                    {/* Radius */}
                    <div className='xl:col-span-3'>
                      <div className='flex items-center mb-3'>
                        <h3 className='text-sm font-semibold text-gray-800'>
                          Within
                        </h3>
                      </div>
                      <div className='flex gap-2'>
                        <div className='flex-1 relative'>
                          <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10' />
                          <Select
                            value={searchRadius.toString()}
                            onValueChange={value =>
                              setSearchRadius(parseInt(value, 10))
                            }
                          >
                            <SelectTrigger className='pl-9 h-12 border-gray-200 focus:ring-2 focus:ring-shadow-lavender focus:border-shadow-lavender rounded-xl text-sm text-gray-900 hover:border-gray-300 transition-colors'>
                              <SelectValue>{searchRadius}km</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='1'>1km</SelectItem>
                              <SelectItem value='2'>2km</SelectItem>
                              <SelectItem value='5'>5km</SelectItem>
                              <SelectItem value='10'>10km</SelectItem>
                              <SelectItem value='25'>25km</SelectItem>
                              <SelectItem value='50'>50km</SelectItem>
                              <SelectItem value='100'>100km</SelectItem>
                              <SelectItem value='200'>200km</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Buttons */}
                <div className='px-6 pb-6'>
                  <div className='flex flex-col sm:flex-row gap-4 items-center'>
                    <div className='flex gap-3'>
                      <Button
                        className='bg-gradient-to-r from-shadow-lavender to-purple-600 text-pure-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-shadow-lavender transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105'
                        onClick={handleFindDeals}
                      >
                        <Search className='w-5 h-5 mr-2' />
                        Find Deals
                      </Button>

                      <Button
                        variant='ghost'
                        className='border-shadow-lavender text-shadow-lavender hover:bg-shadow-lavender hover:text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold border-2'
                        onClick={handleAllDeals}
                      >
                        All Deals
                      </Button>
                    </div>

                    {/* Clear Search Button */}
                    {showSearchResults && (
                      <Button
                        variant='ghost'
                        onClick={() => {
                          setShowSearchResults(false);
                          setSelectedCategory('');
                          setLocation('');
                        }}
                        className='text-shadow-lavender border-shadow-lavender hover:bg-shadow-lavender hover:text-white'
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Login/Signup Buttons */}
            <div className='flex items-center justify-center gap-4 mt-8'>
              <Button variant='ghost'>Sign In</Button>
              <Button className='bg-shadow-lavender hover:bg-shadow-lavender/90'>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {showSearchResults && (
        <section id='search-results-section' className='py-16 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                {selectedCategory
                  ? `${categories.find(c => c.id === selectedCategory)?.name} Deals`
                  : 'All Deals'}
              </h2>
              <p className='text-gray-600'>
                {displayedDeals.length} deals available
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {displayedDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Booked Section */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Recently Booked
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {recentBookings.map(booking => (
              <div
                key={booking.id}
                className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
              >
                <div className='flex items-start gap-3'>
                  <div className='w-10 h-10 rounded-full bg-shadow-lavender/10 flex items-center justify-center text-shadow-lavender font-semibold flex-shrink-0'>
                    {booking.avatar}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate'>
                      {booking.userName}
                    </p>
                    <p className='text-sm text-gray-600 truncate'>
                      booked {booking.serviceName}
                    </p>
                    <p className='text-xs text-gray-500 mt-1'>
                      {booking.bookedAt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className='py-16 bg-pure-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-shadow-lavender mb-4'>
              Why Choose Zendulge?
            </h2>
            <p className='text-xl text-gray-900 max-w-3xl mx-auto'>
              Get premium wellness services at unbeatable prices during off-peak
              hours
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-frosted-lilac rounded-full flex items-center justify-center mx-auto mb-4'>
                <Percent className='w-8 h-8 text-shadow-lavender' />
              </div>
              <h3 className='text-xl font-semibold text-shadow-lavender mb-2'>
                Luxury for Less
              </h3>
              <p className='text-gray-900'>
                Save significantly on premium wellness services during off-peak
                hours
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-frosted-lilac rounded-full flex items-center justify-center mx-auto mb-4'>
                <MapPin className='w-8 h-8 text-shadow-lavender' />
              </div>
              <h3 className='text-xl font-semibold text-shadow-lavender mb-2'>
                Local & Verified
              </h3>
              <p className='text-gray-900'>
                All businesses are locally verified and rated by our community
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-frosted-lilac rounded-full flex items-center justify-center mx-auto mb-4'>
                <Calendar className='w-8 h-8 text-shadow-lavender' />
              </div>
              <h3 className='text-xl font-semibold text-shadow-lavender mb-2'>
                Instant Booking
              </h3>
              <p className='text-gray-900'>
                Book your wellness appointment instantly with secure payment
                processing
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
