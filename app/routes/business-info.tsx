import {
  Bath,
  Dumbbell,
  Heart,
  Play,
  Scissors,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

import heroBackground from '~/assets/massage.jpeg';
import { Button } from '~/components/ui/button';

export default function BusinessInfo() {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section
        className='relative py-6 bg-gradient-to-br from-frosted-lilac to-pure-white'
        style={{
          backgroundImage: `linear-gradient(rgba(248, 245, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center py-12'>
            {/* Revenue Question */}
            <p
              className='text-4xl text-gray-900 max-w-3xl mx-auto mb-12 font-semibold leading-relaxed'
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Want to boost revenue, fill last-minute gaps, and attract new
              clients?
            </p>
            {/* How It Works Section */}
            <div className='mb-12'>
              <div className='text-center mb-10'>
                <h2 className='text-2xl md:text-3xl font-bold text-shadow-lavender mb-4'>
                  How It Works
                </h2>
                <p className='text-lg text-gray-900 mb-8'>
                  Get started in just 3 simple steps
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
                <div className='text-center'>
                  <div className='w-12 h-12 bg-shadow-lavender text-pure-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold'>
                    1
                  </div>
                  <h3 className='text-lg font-semibold text-shadow-lavender mb-3'>
                    Register Your Business
                  </h3>
                  <p className='text-gray-900 text-base leading-relaxed'>
                    Create your business profile and add your services in
                    minutes
                  </p>
                </div>

                <div className='text-center'>
                  <div className='w-12 h-12 bg-shadow-lavender text-pure-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold'>
                    2
                  </div>
                  <h3 className='text-lg font-semibold text-shadow-lavender mb-3'>
                    Create Deals
                  </h3>
                  <p className='text-gray-900 text-base leading-relaxed'>
                    Set your off-peak hours and discount deals to attract
                    customers
                  </p>
                </div>

                <div className='text-center'>
                  <div className='w-12 h-12 bg-shadow-lavender text-pure-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold'>
                    3
                  </div>
                  <h3 className='text-lg font-semibold text-shadow-lavender mb-3'>
                    Start Earning
                  </h3>
                  <p className='text-gray-900 text-base leading-relaxed'>
                    Receive bookings and watch your revenue grow with filled
                    time slots
                  </p>
                </div>
              </div>
            </div>

            {/* Video Button */}
            <div className='mb-6 flex justify-center'>
              <Button
                variant='ghost'
                className='border-shadow-lavender text-shadow-lavender px-10 py-4 rounded-xl hover:bg-shadow-lavender hover:text-pure-white text-lg font-medium border-2 flex items-center gap-3'
                onClick={() => {
                  window.open(
                    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    '_blank'
                  );
                }}
              >
                <Play className='w-5 h-5' />
                See How It Works
              </Button>
            </div>

            <h1 className='text-3xl md:text-5xl font-bold text-shadow-lavender mb-6 leading-tight'>
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-shadow-lavender to-purple-600'>
                Fill Your Off-Peak Hours
              </span>
            </h1>

            <div className='flex flex-col sm:flex-row gap-6 justify-center mb-12'>
              <Button className='bg-shadow-lavender text-pure-white px-10 py-5 rounded-xl hover:bg-shadow-lavender/90 text-xl font-semibold'>
                Register Your Business
              </Button>
              <Button className='bg-shadow-lavender text-pure-white px-10 py-5 rounded-xl hover:bg-shadow-lavender/90 text-xl font-semibold'>
                Book a Consultation
              </Button>
            </div>

            {/* Business Categories */}
            <div className='text-center'>
              <p className='text-lg text-gray-900 mb-6 font-medium leading-relaxed'>
                Do you have a business providing wellness-related services?
                Start attracting more customers today!
              </p>

              <div className='grid grid-cols-8 gap-x-3 gap-y-6 max-w-5xl mx-auto'>
                {[
                  { icon: Bath, label: 'Massage' },
                  { icon: Scissors, label: 'Hair' },
                  { icon: Sparkles, label: 'Beauty' },
                  { icon: Dumbbell, label: 'Fitness' },
                  { icon: Heart, label: 'Spa' },
                  { icon: Bath, label: 'Sauna' },
                  { icon: Dumbbell, label: 'Yoga' },
                  { icon: Sparkles, label: 'Nails' },
                ].map(category => (
                  <div key={category.label} className='text-center group'>
                    <div className='w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 bg-shadow-lavender/10 border-2 border-shadow-lavender hover:bg-shadow-lavender/20 transition-colors'>
                      <category.icon className='w-5 h-5 text-shadow-lavender' />
                    </div>
                    <span className='text-sm font-medium text-gray-700 leading-tight'>
                      {category.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-6 bg-pure-white'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-6'>
            <h2 className='text-2xl md:text-3xl font-bold text-shadow-lavender mb-2'>
              Why Choose Zendulge?
            </h2>
            <p className='text-base text-gray-900'>
              Join the growing list of wellness businesses already maximising
              their off-peak hours
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-6'>
            <div className='text-center p-3'>
              <div className='w-10 h-10 bg-shadow-lavender rounded-lg flex items-center justify-center mx-auto mb-2'>
                <TrendingUp className='text-pure-white w-5 h-5' />
              </div>
              <h3 className='text-base font-semibold text-shadow-lavender mb-1'>
                Increase Revenue
              </h3>
              <p className='text-gray-900 text-sm'>
                Fill empty slots with last-minute bookings and boost your daily
                earnings
              </p>
            </div>

            <div className='text-center p-3'>
              <div className='w-10 h-10 bg-shadow-lavender rounded-lg flex items-center justify-center mx-auto mb-2'>
                <Users className='text-pure-white w-5 h-5' />
              </div>
              <h3 className='text-base font-semibold text-shadow-lavender mb-1'>
                New Customers
              </h3>
              <p className='text-gray-900 text-sm'>
                Reach customers you've never reached before and build lasting
                relationships
              </p>
            </div>

            <div className='text-center p-3'>
              <div className='w-10 h-10 bg-shadow-lavender rounded-lg flex items-center justify-center mx-auto mb-2'>
                <Settings className='text-pure-white w-5 h-5' />
              </div>
              <h3 className='text-base font-semibold text-shadow-lavender mb-1'>
                Easy Management
              </h3>
              <p className='text-gray-900 text-sm'>
                Simple dashboard to control pricing, availability, and track
                your performance
              </p>
            </div>
          </div>

          <div className='text-center'>
            <Button className='bg-shadow-lavender text-pure-white px-8 py-4 rounded-xl font-semibold hover:bg-shadow-lavender/90 transition-colors text-lg'>
              Register Your Business
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-8 bg-pure-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl md:text-3xl font-bold text-shadow-lavender mb-3'>
              Frequently Asked Questions
            </h2>
          </div>

          <div className='space-y-4'>
            <div className='border border-gray-200 rounded-lg p-4'>
              <h3 className='text-base font-semibold text-shadow-lavender mb-2'>
                How much does it cost?
              </h3>
              <p className='text-gray-900 text-sm'>
                No upfront fees, we only charge a commission on completed
                bookings. You only pay when you earn.
              </p>
            </div>

            <div className='border border-gray-200 rounded-lg p-4'>
              <h3 className='text-base font-semibold text-shadow-lavender mb-2'>
                What types of businesses can join?
              </h3>
              <p className='text-gray-900 text-sm'>
                Any wellness business with appointment-based services: spas,
                salons, massage therapy, fitness studios, yoga studios, and
                more.
              </p>
            </div>

            <div className='border border-gray-200 rounded-lg p-4'>
              <h3 className='text-base font-semibold text-shadow-lavender mb-2'>
                How do I set my pricing?
              </h3>
              <p className='text-gray-900 text-sm'>
                You have full control over your discount rates and can adjust
                them anytime. Most businesses offer 20-70% off their regular
                prices for off-peak hours.
              </p>
            </div>

            <div className='border border-gray-200 rounded-lg p-4'>
              <h3 className='text-base font-semibold text-shadow-lavender mb-2'>
                Can I manage my availability?
              </h3>
              <p className='text-gray-900 text-sm'>
                Absolutely! You control when deals are available, set blackout
                dates, and manage your calendar through our easy-to-use
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
