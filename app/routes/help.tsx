import {
  Building,
  Code2,
  FileText,
  Mail,
  Phone,
  Users,
  Video,
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

// =========================
// FAQ DATA
// =========================

const customerFaq = [
  {
    value: 'booking',
    question: 'How do I book a deal?',
    answer:
      "Simply browse available deals, select your preferred time slot, and complete the payment process. You'll receive an instant confirmation with booking details.",
  },
  {
    value: 'payment',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, debit cards, and digital wallets. All transactions are securely processed through Stripe.',
  },
  {
    value: 'cancellation',
    question: 'Can I cancel or reschedule my booking?',
    answer:
      'Yes, you can cancel or reschedule up to 2 hours before your appointment time. Check the specific deal terms for any restrictions.',
  },
  {
    value: 'refunds',
    question: 'How do refunds work?',
    answer:
      "Refunds are processed according to each business's cancellation policy. Most refunds are processed within 3–5 business days.",
  },
  {
    value: 'deals',
    question: 'How often are new deals added?',
    answer:
      'New deals are added throughout the day as businesses update their availability. Check back regularly or enable notifications for the best deals.',
  },
];

const businessFaq = [
  {
    value: 'setup',
    question: 'How do I set up my business account?',
    answer:
      'Sign up for a business account, complete your business profile, add your services, and start creating deals for your off-peak hours.',
  },
  {
    value: 'commission',
    question: 'What are the platform fees?',
    answer:
      'We charge a small commission on successful bookings. The exact rate depends on your subscription plan and booking volume.',
  },
  {
    value: 'payments',
    question: 'When do I receive payments?',
    answer:
      'Payments are transferred to your account within 2–3 business days after the service is completed, minus our platform fee.',
  },
  {
    value: 'deals-manage',
    question: 'How do I manage my deals?',
    answer:
      'Use your business dashboard to create, edit, pause, or delete deals. You can also set automatic scheduling for recurring off-peak slots.',
  },
  {
    value: 'customers',
    question: 'How do I communicate with customers?',
    answer:
      'The Zendulge platform provides built-in messaging for appointment confirmations and updates. You can also contact customers directly using the provided contact information.',
  },
];

// =========================
// PAGE COMPONENT
// =========================

export default function Help() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
        <div>
          <h1 className='text-4xl sm:text-5xl font-bold text-slate-900 mb-4 text-center'>
            Help & Support
          </h1>
          <p
            className='text-lg text-slate-600 max-w-2xl mx-auto'
            id='contact-section'
          >
            Find answers to common questions or reach out to our team. We are
            here to help you succeed on Zendulge.
          </p>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12'>
        {/* Contact Cards */}
        <div className='grid md:grid-cols-2 gap-6 mb-12'>
          <Card className='hover:shadow-lg transition-shadow'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='p-2 bg-secondary rounded-lg'>
                  <Mail className='w-6 h-6 text-primary' />
                </div>
                <CardTitle className='text-lg'>Email Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className='text-slate-600 mb-4'>Response within 2 hours</p>
              <div className='flex flex-col gap-3'>
                <a
                  href='mailto:cmooney@zendulge.com.au'
                  className='text-primary font-medium hover:text-primary/80'
                >
                  cmooney@zendulge.com.au
                </a>
                <Button
                  asChild
                  className='w-full bg-primary hover:bg-primary/90 text-white'
                >
                  <a href='mailto:cmooney@zendulge.com.au'>Send Email</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-shadow'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='p-2 bg-secondary rounded-lg'>
                  <Phone className='w-6 h-6 text-primary' />
                </div>
                <CardTitle className='text-lg'>Phone Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className='text-slate-600 mb-4'>Mon–Fri, 9AM–6PM</p>
              <div className='flex flex-col gap-3'>
                <a
                  href='tel:+61478015538'
                  className='text-primary font-medium hover:text-primary/80 block text-lg'
                >
                  0478 015 538
                </a>
                <Button
                  asChild
                  className='w-full bg-primary hover:bg-primary/90 text-white'
                >
                  <a href='tel:+61478015538'>Call Now</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Sections */}
        <div className='grid md:grid-cols-2 gap-8 mb-12'>
          {/* Customer FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Users className='w-5 h-5 text-primary' />
                For Customers
              </CardTitle>
              <CardDescription>
                Everything you need to know about booking deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type='single' collapsible className='w-full'>
                {customerFaq.map(item => (
                  <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger className='text-left items-start'>
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Business FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Building className='w-5 h-5 text-primary' />
                For Businesses
              </CardTitle>
              <CardDescription>
                Get started with listing your services and managing deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type='single' collapsible className='w-full'>
                {businessFaq.map(item => (
                  <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger className='text-left items-start'>
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <Card className='mb-12'>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
            <CardDescription>
              More ways to get help and stay informed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-3 gap-6'>
              <div className='p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-md transition-all'>
                <div className='p-3 bg-secondary rounded-lg w-fit mb-3'>
                  <FileText className='w-6 h-6 text-primary' />
                </div>
                <h4 className='font-semibold text-slate-900 mb-2'>
                  Getting Started Guide
                </h4>
                <p className='text-sm text-slate-600 mb-4'>
                  Step-by-step tutorials for new users
                </p>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-primary border-secondary hover:bg-secondary bg-transparent'
                  asChild
                >
                  <a href='/assets/app-icon.png' download>
                    Download PDF
                  </a>
                </Button>
              </div>

              <div className='p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-md transition-all'>
                <div className='p-3 bg-secondary rounded-lg w-fit mb-3'>
                  <Video className='w-6 h-6 text-primary' />
                </div>
                <h4 className='font-semibold text-slate-900 mb-2'>
                  Video Tutorials
                </h4>
                <p className='text-sm text-slate-600 mb-4'>
                  Watch setup steps and how to create deals
                </p>
                <div className='flex items-center gap-2'>
                  <span className='inline-block px-2 py-1 bg-secondary text-primary text-xs font-medium rounded'>
                    Coming soon
                  </span>
                </div>
              </div>

              <div className='p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-md transition-all'>
                <div className='p-3 bg-secondary rounded-lg w-fit mb-3'>
                  <Code2 className='w-6 h-6 text-primary' />
                </div>
                <h4 className='font-semibold text-slate-900 mb-2'>
                  API Documentation
                </h4>
                <p className='text-sm text-slate-600 mb-4'>
                  For developers and integrations
                </p>
                <div className='flex items-center gap-2'>
                  <span className='inline-block px-2 py-1 bg-secondary text-primary text-xs font-medium rounded'>
                    Coming soon
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Banner */}
        <Card className='bg-primary border-0'>
          <CardContent className='pt-8 pb-8 text-center text-white'>
            <h3 className='text-2xl font-bold mb-3'>Still need help?</h3>
            <p className='mb-6 text-white/80 max-w-xl mx-auto'>
              Our support team is here to help you succeed on Zendulge. Do not
              hesitate to reach out.
            </p>
            <Button
              onClick={() => {
                const el = document.getElementById('contact-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className='bg-white text-primary hover:bg-slate-100'
            >
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
