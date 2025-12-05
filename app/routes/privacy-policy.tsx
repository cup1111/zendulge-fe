import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';

export default function PrivacyPolicy() {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
        <header className='mb-10 text-center'>
          <h1 className='text-4xl font-bold text-shadow-lavender mb-4'>
            Privacy Policy
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
            This page explains how Zendulge collects, uses, and protects your
            personal information when you use our services.
          </p>
        </header>

        <Accordion type='multiple' className='space-y-4'>
          <AccordionItem
            value='overview'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Overview
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>
                Zendulge Pty Ltd (referred to as{' '}
                <strong>&quot;Zendulge&quot;</strong>,
                <strong>&quot;we&quot;</strong>, <strong>&quot;us&quot;</strong>{' '}
                or <strong>&quot;our&quot;</strong>) operates a marketplace that
                connects customers with wellness, beauty, and self-care
                businesses. We are committed to handling personal information in
                a way that is consistent with the{' '}
                <strong>Privacy Act 1988 (Cth)</strong> and the{' '}
                <strong>Australian Privacy Principles (APPs)</strong>, to the
                extent they apply to us.
              </p>
              <p>
                This Privacy Policy describes the types of personal information
                we collect, how we use and disclose it, and the choices you have
                in relation to your information when you use the Zendulge
                platform, website, and related services (together, the{' '}
                <strong>&quot;Services&quot;</strong>).
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='information-we-collect'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Information We Collect
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>We may collect the following types of personal information:</p>
              <ul className='list-disc list-inside space-y-1'>
                <li>
                  <strong>Account and contact details</strong>, such as your
                  name, email address, phone number, and password.
                </li>
                <li>
                  <strong>Booking and transaction details</strong>, including
                  services booked, appointment times, locations, prices, and
                  payment status.
                </li>
                <li>
                  <strong>Business information</strong> (for business users),
                  such as business name, ABN, contact person details, service
                  descriptions, pricing, and location.
                </li>
                <li>
                  <strong>Usage and device information</strong>, such as pages
                  viewed, links clicked, IP address, browser type, and device
                  identifiers.
                </li>
                <li>
                  <strong>Location information</strong>, where you choose to
                  enable location services or provide an address to find or
                  offer services.
                </li>
                <li>
                  <strong>Support communications</strong>, including messages,
                  enquiries, feedback, and any information you choose to provide
                  when you contact us.
                </li>
              </ul>
              <p>
                Where it is lawful and reasonable to do so, you may choose to
                interact with us anonymously or using a pseudonym, but this may
                limit our ability to provide some Services.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='how-we-collect'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              How We Collect Your Information
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>
                We collect personal information in a number of ways, including:
              </p>
              <ul className='list-disc list-inside space-y-1'>
                <li>when you create an account or update your profile;</li>
                <li>when you browse, search for, or book deals on Zendulge;</li>
                <li>when you list your business or services on Zendulge;</li>
                <li>
                  when you communicate with us or with other users via the
                  platform;
                </li>
                <li>
                  through cookies and similar technologies when you use our
                  website;
                </li>
                <li>
                  from third-party providers where you have authorised them to
                  share information with us.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='how-we-use'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              How We Use Your Information
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>We may use your personal information to:</p>
              <ul className='list-disc list-inside space-y-1'>
                <li>operate, maintain, and improve the Zendulge platform;</li>
                <li>
                  facilitate bookings, payments, cancellations, and refunds;
                </li>
                <li>verify your identity and help keep the platform secure;</li>
                <li>
                  communicate with you about bookings, account activity, and
                  support enquiries;
                </li>
                <li>
                  send you service updates, important notices, and (where
                  permitted) marketing communications;
                </li>
                <li>analyse usage trends and improve the user experience;</li>
                <li>
                  comply with our legal, regulatory, and risk management
                  obligations.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='sharing-and-overseas'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Sharing Your Information
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>
                We may disclose your personal information to third parties where
                reasonably necessary for the purposes described in this Privacy
                Policy, including to:
              </p>
              <ul className='list-disc list-inside space-y-1'>
                <li>
                  participating businesses so they can manage your booking and
                  provide the services you have requested;
                </li>
                <li>
                  payment providers and financial institutions to process
                  payments and prevent fraud;
                </li>
                <li>
                  service providers who help us operate the platform (for
                  example, hosting, analytics, communications, and customer
                  support tools);
                </li>
                <li>
                  professional advisers (such as lawyers, accountants, or
                  auditors) where necessary; and
                </li>
                <li>
                  regulators, law enforcement, or government authorities where
                  required or authorised by law.
                </li>
              </ul>
              <p>
                Some of these parties may be located outside Australia. Where we
                disclose personal information overseas, we take reasonable steps
                to ensure that the recipient will handle it in a way that is
                consistent with this Privacy Policy and the APPs.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='security-and-retention'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Security and Retention
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>
                We take reasonable steps to protect personal information from
                misuse, interference, loss, unauthorised access, modification,
                or disclosure. However, no method of transmission or storage is
                completely secure, and we cannot guarantee absolute security.
              </p>
              <p>
                We retain personal information for as long as it is reasonably
                necessary for the purposes described in this policy or as
                required by law. When information is no longer needed, we will
                take reasonable steps to de-identify or destroy it.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='your-rights'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Your Rights and Choices
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>You may have rights to:</p>
              <ul className='list-disc list-inside space-y-1'>
                <li>
                  request access to the personal information we hold about you;
                </li>
                <li>
                  request corrections if your information is inaccurate, out of
                  date, or incomplete;
                </li>
                <li>
                  opt out of receiving marketing communications at any time; and
                </li>
                <li>
                  make a privacy complaint if you believe we have mishandled
                  your personal information.
                </li>
              </ul>
              <p>
                To exercise these rights, please contact us using the details
                provided below. We will respond to requests within a reasonable
                period and in accordance with applicable law.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='contact-and-changes'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Contact Us and Changes to This Policy
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>
                If you have any questions, concerns, or complaints about this
                Privacy Policy or how we handle your personal information,
                please contact our team using the contact details on the Help
                page.
              </p>
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes to our practices, the law, or the Services. The updated
                version will be posted on this page with a revised &quot;last
                updated&quot; date, and will take effect from the time it is
                published.
              </p>
              <p className='text-sm text-gray-500'>
                This Privacy Policy is a general information summary only and is
                not legal advice. You may wish to seek your own legal advice to
                understand how privacy laws apply to your specific
                circumstances.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
