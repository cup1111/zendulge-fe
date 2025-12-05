import {
  Building,
  Clock,
  CreditCard,
  Mail,
  Phone,
  ShoppingCart,
  Users,
} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export default function Help() {
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      {/* Contact Section */}
      <div id='contact' className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-shadow-lavender mb-4'>
            Help & Support
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Find answers to common questions or get in touch with our support
            team
          </p>
        </div>

        <Card className='text-center'>
          <CardHeader>
            <Mail className='w-8 h-8 text-shadow-lavender mx-auto mb-2' />
            <CardTitle className='text-lg'>Email Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600 mb-4'>Response within 2 hours</p>
            <Button
              variant='ghost'
              className='border-shadow-lavender text-shadow-lavender hover:bg-shadow-lavender hover:text-white'
            >
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card className='text-center'>
          <CardHeader>
            <Phone className='w-8 h-8 text-shadow-lavender mx-auto mb-2' />
            <CardTitle className='text-lg'>Phone Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600 mb-4'>Mon-Fri 9AM-6PM</p>
            <Button
              variant='ghost'
              className='border-shadow-lavender text-shadow-lavender hover:bg-shadow-lavender hover:text-white'
            >
              Call Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Sections */}
      <div id='faqs' className='grid md:grid-cols-2 gap-8'>
        {/* Customer FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Users className='w-5 h-5 mr-2 text-shadow-lavender' />
              For Customers
            </CardTitle>
            <CardDescription>
              Everything you need to know about booking deals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type='single' collapsible className='w-full'>
              <AccordionItem value='booking'>
                <AccordionTrigger>How do I book a deal?</AccordionTrigger>
                <AccordionContent>
                  Simply browse available deals, select your preferred time
                  slot, and complete the payment process. You&apos;ll receive an
                  instant confirmation with booking details.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='payment'>
                <AccordionTrigger>
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent>
                  We accept all major credit cards, debit cards, and digital
                  wallets. All transactions are securely processed through
                  Stripe.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='cancellation'>
                <AccordionTrigger>
                  Can I cancel or reschedule my booking?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you can cancel or reschedule up to 2 hours before your
                  appointment time. Check the specific deal terms for any
                  restrictions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='refunds'>
                <AccordionTrigger>How do refunds work?</AccordionTrigger>
                <AccordionContent>
                  Refunds are processed according to each business&apos;s
                  cancellation policy. Most refunds are processed within 3-5
                  business days.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='deals'>
                <AccordionTrigger>
                  How often are new deals added?
                </AccordionTrigger>
                <AccordionContent>
                  New deals are added throughout the day as businesses update
                  their availability. Check back regularly or enable
                  notifications for the best deals.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Business FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Building className='w-5 h-5 mr-2 text-shadow-lavender' />
              For Businesses
            </CardTitle>
            <CardDescription>
              Get started with listing your services and managing deals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type='single' collapsible className='w-full'>
              <AccordionItem value='setup'>
                <AccordionTrigger>
                  How do I set up my business account?
                </AccordionTrigger>
                <AccordionContent>
                  Sign up for a business account, complete your business
                  profile, add your services, and start creating deals for your
                  off-peak hours.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='commission'>
                <AccordionTrigger>What are the platform fees?</AccordionTrigger>
                <AccordionContent>
                  We charge a small commission on successful bookings. The exact
                  rate depends on your subscription plan and booking volume.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='payments'>
                <AccordionTrigger>When do I receive payments?</AccordionTrigger>
                <AccordionContent>
                  Payments are transferred to your account within 2-3 business
                  days after the service is completed, minus our platform fee.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='deals-manage'>
                <AccordionTrigger>How do I manage my deals?</AccordionTrigger>
                <AccordionContent>
                  Use your business dashboard to create, edit, pause, or delete
                  deals. You can also set automatic scheduling for recurring
                  off-peak slots.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='customers'>
                <AccordionTrigger>
                  How do I communicate with customers?
                </AccordionTrigger>
                <AccordionContent>
                  The Zendulge platform provides built-in messaging for
                  appointment confirmations and updates. You can also contact
                  customers directly using the provided contact information.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Additional Resources */}
      <div className='mt-12'>
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
            <CardDescription>
              More ways to get help and stay informed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-3 gap-4'>
              <div className='text-center p-4 border rounded-lg'>
                <Clock className='w-6 h-6 text-shadow-lavender mx-auto mb-2' />
                <h4 className='font-semibold mb-2'>Getting Started Guide</h4>
                <p className='text-sm text-gray-600 mb-3'>
                  Step-by-step tutorials for new users
                </p>
                <Button variant='ghost' size='sm'>
                  View Guide
                </Button>
              </div>

              <div className='text-center p-4 border rounded-lg'>
                <ShoppingCart className='w-6 h-6 text-shadow-lavender mx-auto mb-2' />
                <h4 className='font-semibold mb-2'>Video Tutorials</h4>
                <p className='text-sm text-gray-600 mb-3'>
                  Watch how to use key features
                </p>
                <Button variant='ghost' size='sm'>
                  Watch Videos
                </Button>
              </div>

              <div className='text-center p-4 border rounded-lg'>
                <CreditCard className='w-6 h-6 text-shadow-lavender mx-auto mb-2' />
                <h4 className='font-semibold mb-2'>API Documentation</h4>
                <p className='text-sm text-gray-600 mb-3'>
                  For developers and integrations
                </p>
                <Button variant='ghost' size='sm'>
                  View Docs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Banner */}
      <div className='mt-12 bg-gradient-to-r from-shadow-lavender to-purple-600 rounded-lg p-8 text-center text-white'>
        <h3 className='text-2xl font-bold mb-4'>Still need help?</h3>
        <p className='mb-6'>
          Our support team is here to help you succeed on Zendulge
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button
            variant='ghost'
            className='bg-white text-shadow-lavender hover:bg-gray-100'
          >
            Contact Support
          </Button>
          <Button
            variant='ghost'
            className='border-white text-white hover:bg-white hover:text-shadow-lavender'
          >
            Schedule a Call
          </Button>
        </div>
      </div>
    </div>
  );
}
