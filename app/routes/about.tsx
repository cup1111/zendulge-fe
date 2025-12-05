import { HeartHandshake, MapPin, Users, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router';

import heroBackground from '~/assets/massage.jpeg';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero */}
      <section
        className='relative py-16 bg-gradient-to-br from-frosted-lilac to-pure-white'
        style={{
          backgroundImage: `linear-gradient(rgba(248, 245, 255, 0.9), rgba(255, 255, 255, 0.95)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto text-center'>
            <h1 className='text-4xl md:text-5xl font-bold text-shadow-lavender mb-4'>
              About Zendulge
            </h1>
            <p className='text-xl text-gray-800 mb-4'>
              Making wellness feel luxurious, not expensive.
            </p>
            <p className='text-lg text-gray-700 mb-8'>
              Zendulge connects you with last-minute wellness deals from trusted
              local businesses, so you can look after your body and mind —
              without blowing your budget.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                className='bg-gradient-to-r from-shadow-lavender to-purple-600 text-pure-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-shadow-lavender transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105'
                onClick={() => navigate('/')}
              >
                Browse Deals
              </Button>
              <Button
                variant='ghost'
                className='border-shadow-lavender text-shadow-lavender hover:bg-shadow-lavender hover:text-white px-8 py-3 rounded-xl transition-all duration-300 font-semibold border-2'
                onClick={() => navigate('/business-registration')}
              >
                Register Your Business
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-2 gap-10 items-center'>
            <div>
              <h2 className='text-3xl md:text-4xl font-bold text-shadow-lavender mb-4'>
                Our Story
              </h2>
              <p className='text-gray-700 mb-4 leading-relaxed'>
                Zendulge started with a simple question: why is taking care of
                yourself so expensive and hard to book?
              </p>
              <p className='text-gray-700 mb-4 leading-relaxed'>
                Spas, salons, and wellness studios were sitting on empty
                off-peak appointments, while people around them were stressed,
                burnt out, and priced out of regular self-care.
              </p>
              <p className='text-gray-700 mb-4 leading-relaxed'>
                We created Zendulge to bridge that gap. By helping businesses
                fill last-minute and off-peak time slots, we make premium
                wellness experiences more affordable and accessible — for
                everyone, not just on special occasions.
              </p>
              <p className='text-gray-700 leading-relaxed'>
                Today, Zendulge is a growing marketplace where you can discover
                hidden-gem businesses, support local operators, and treat
                yourself without the guilt.
              </p>
            </div>

            <div className='relative'>
              <div className='rounded-3xl bg-gradient-to-br from-frosted-lilac to-shadow-lavender/20 p-1 shadow-xl'>
                <div className='rounded-[22px] bg-white px-8 py-10'>
                  <p className='text-sm font-semibold text-shadow-lavender uppercase tracking-wide mb-3'>
                    Wellness, reimagined
                  </p>
                  <p className='text-gray-800 text-lg mb-4'>
                    Last-minute appointments become opportunities — not wasted
                    time.
                  </p>
                  <p className='text-gray-600 text-sm leading-relaxed'>
                    Zendulge gives modern wellness seekers and local businesses
                    a smarter way to meet in the middle: flexible, affordable,
                    and designed for real life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Zendulge Works */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl md:text-4xl font-bold text-shadow-lavender mb-3'>
              How Zendulge Works
            </h2>
            <p className='text-lg text-gray-700'>
              Booking wellness with Zendulge is simple:
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>Step 1 — Discover</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-700 leading-relaxed'>
                  Browse last-minute wellness deals near you by category,
                  location, or price.
                </p>
              </CardContent>
            </Card>

            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>
                  Step 2 — Book Instantly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-700 leading-relaxed'>
                  Choose a time that suits you and secure your spot with our
                  seamless online booking.
                </p>
              </CardContent>
            </Card>

            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>
                  Step 3 — Show Up &amp; Unwind
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-700 leading-relaxed'>
                  Head to your appointment, relax, and enjoy premium services at
                  off-peak prices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Built for Modern Wellness */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl md:text-4xl font-bold text-shadow-lavender mb-3'>
              Built for Modern Wellness
            </h2>
            <p className='text-lg text-gray-700'>
              Zendulge is designed for both customers and businesses.
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            <div className='bg-gray-50 rounded-2xl p-8 border border-gray-200'>
              <h3 className='text-xl font-semibold text-shadow-lavender mb-4'>
                For Customers
              </h3>
              <ul className='space-y-3 text-gray-700'>
                <li>
                  <strong>Affordable self-care</strong> – Access premium
                  services at discounted prices during off-peak hours.
                </li>
                <li>
                  <strong>Discover local gems</strong> – Find new spas, salons,
                  and wellness providers you might never see on traditional
                  booking sites.
                </li>
                <li>
                  <strong>Flexible and convenient</strong> – Grab last-minute
                  deals that fit your schedule, not the other way around.
                </li>
                <li>
                  <strong>Trusted reviews</strong> – Book with confidence thanks
                  to verified listings and community ratings.
                </li>
              </ul>
            </div>

            <div className='bg-gray-50 rounded-2xl p-8 border border-gray-200'>
              <h3 className='text-xl font-semibold text-shadow-lavender mb-4'>
                For Businesses
              </h3>
              <ul className='space-y-3 text-gray-700'>
                <li>
                  <strong>Fill quiet times</strong> – Turn empty time slots into
                  revenue with dynamic last-minute deals.
                </li>
                <li>
                  <strong>Reach new customers</strong> – Get discovered by
                  locals who are actively looking for wellness services.
                </li>
                <li>
                  <strong>Simple onboarding</strong> – Set up your profile,
                  upload deals, and start receiving bookings in minutes.
                </li>
                <li>
                  <strong>Data-driven insights</strong> – Understand demand
                  patterns and optimise your off-peak pricing and availability.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl md:text-4xl font-bold text-shadow-lavender mb-3'>
              Our Values
            </h2>
            <p className='text-lg text-gray-700'>
              These principles guide everything we build at Zendulge.
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <Card className='text-center border border-gray-200'>
              <CardHeader>
                <div className='w-14 h-14 bg-frosted-lilac rounded-full flex items-center justify-center mx-auto mb-2'>
                  <HeartHandshake className='w-7 h-7 text-shadow-lavender' />
                </div>
                <CardTitle className='text-lg'>Accessible Wellness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-700'>
                  Looking after your body and mind should feel normal — not like
                  a luxury reserved for a few.
                </p>
              </CardContent>
            </Card>

            <Card className='text-center border border-gray-200'>
              <CardHeader>
                <div className='w-14 h-14 bg-frosted-lilac rounded-full flex items-center justify-center mx-auto mb-2'>
                  <MapPin className='w-7 h-7 text-shadow-lavender' />
                </div>
                <CardTitle className='text-lg'>Local First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-700'>
                  We champion local businesses and independent operators who
                  keep our neighbourhoods vibrant.
                </p>
              </CardContent>
            </Card>

            <Card className='text-center border border-gray-200'>
              <CardHeader>
                <div className='w-14 h-14 bg-frosted-lilac rounded-full flex items-center justify-center mx-auto mb-2'>
                  <Users className='w-7 h-7 text-shadow-lavender' />
                </div>
                <CardTitle className='text-lg'>
                  Trust &amp; Transparency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-700'>
                  Clear pricing, real reviews, and verified partners — so you
                  always know what you’re booking.
                </p>
              </CardContent>
            </Card>

            <Card className='text-center border border-gray-200'>
              <CardHeader>
                <div className='w-14 h-14 bg-frosted-lilac rounded-full flex items-center justify-center mx-auto mb-2'>
                  <Wand2 className='w-7 h-7 text-shadow-lavender' />
                </div>
                <CardTitle className='text-lg'>Thoughtful Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-700'>
                  We use technology to make life easier, not more complicated —
                  from discovery to checkout.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl md:text-4xl font-bold text-shadow-lavender mb-3'>
              Meet the Team
            </h2>
            <p className='text-lg text-gray-700 max-w-3xl mx-auto'>
              We’re a small team of product builders, designers, and wellness
              lovers based in Australia. We’ve all felt the pain of trying to
              book last-minute appointments or afford regular self-care — so we
              decided to fix it.
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            <Card className='border border-gray-200'>
              <CardHeader>
                <CardTitle className='text-lg'>Craig Mooney</CardTitle>
                <p className='text-sm text-gray-500'>Founder &amp; CEO</p>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-700'>
                  Leading Zendulge with a focus on making wellness more
                  accessible and sustainable for everyone.
                </p>
              </CardContent>
            </Card>

            <Card className='border border-gray-200'>
              <CardHeader>
                <CardTitle className='text-lg'>Mia Patel</CardTitle>
                <p className='text-sm text-gray-500'>
                  Co-Founder &amp; Partnerships
                </p>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-700'>
                  Former spa manager, passionate about helping local businesses
                  thrive.
                </p>
              </CardContent>
            </Card>

            <Card className='border border-gray-200'>
              <CardHeader>
                <CardTitle className='text-lg'>Jordan Lee</CardTitle>
                <p className='text-sm text-gray-500'>Product &amp; Design</p>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-700'>
                  Designing calm, intuitive experiences for a not-so-calm world.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='py-16 bg-gradient-to-r from-shadow-lavender to-purple-600'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Ready to Zendulge?
          </h2>
          <p className='text-lg mb-8 max-w-2xl mx-auto'>
            Whether you’re looking for a last-minute massage or you’re a
            business wanting to fill your calendar, Zendulge is here to make
            wellness work better for everyone.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              className='bg-white text-shadow-lavender hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold'
              onClick={() => navigate('/')}
            >
              Browse Wellness Deals
            </Button>
            <Button
              variant='ghost'
              className='border-white text-white hover:bg-white hover:text-shadow-lavender px-8 py-3 rounded-xl font-semibold border-2'
              onClick={() => navigate('/business-registration')}
            >
              Register Your Business
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
