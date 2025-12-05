import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';

export default function TermsOfService() {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
        <header className='mb-10 text-center'>
          <h1 className='text-4xl font-bold text-shadow-lavender mb-4'>
            Terms of Service
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
            These terms outline the rules and conditions for using the Zendulge
            platform as a customer or business.
          </p>
        </header>

        <Accordion type='multiple' className='space-y-4'>
          <AccordionItem
            value='acceptance'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Acceptance of These Terms
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>
                By accessing or using the Zendulge website, mobile experience,
                or related services (together, the{' '}
                <strong>&quot;Platform&quot;</strong>), you agree to be bound by
                these Terms of Service (<strong>&quot;Terms&quot;</strong>). If
                you do not agree, you must not use the Platform.
              </p>
              <p>
                You represent that you are at least 18 years old, or the age of
                majority in your jurisdiction, and have the legal capacity to
                enter into a binding agreement. If you use the Platform on
                behalf of a business, you confirm that you are authorised to
                agree to these Terms for that business.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='accounts'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Accounts and Responsibilities
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>When you create an account, you agree to:</p>
              <ul className='list-disc list-inside space-y-1'>
                <li>provide accurate and up-to-date information;</li>
                <li>keep your login details confidential; and</li>
                <li>
                  notify us promptly if you suspect unauthorised use of your
                  account.
                </li>
              </ul>
              <p>
                You are responsible for all activities that occur under your
                account. We may suspend or terminate access to the Platform if
                we reasonably believe there has been misuse, fraud, or a breach
                of these Terms.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='platform-role'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Our Role as a Marketplace
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>
                Zendulge provides a platform that enables customers to discover
                and book services offered by independent businesses. We do not
                own, manage, or control the businesses listed on the Platform,
                and we do not provide the services listed in deals.
              </p>
              <p>
                Any booking you make is a direct agreement between you and the
                relevant business. While we facilitate the booking and payment
                process, we are not a party to the underlying service contract
                between you and the business.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='bookings'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Bookings, Changes, and Cancellations
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>
                When you make a booking, you agree to the specific terms of the
                deal, including any cancellation or rescheduling conditions set
                by the business. Please review these terms carefully before
                confirming your booking.
              </p>
              <p>
                In general, bookings may be cancelled or changed only within the
                timeframes shown on the deal or in your confirmation email. Some
                bookings may be non-refundable or subject to fees if changed or
                cancelled late. Refunds, where applicable, will be processed to
                your original payment method.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='fees'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Fees and Payments
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>
                Prices displayed on Zendulge are set by participating
                businesses, sometimes with discounts applied for off-peak
                timeslots. Unless stated otherwise, prices are shown in
                Australian dollars (AUD) and may include applicable taxes and
                charges.
              </p>
              <p>
                Payments are processed through third-party payment providers. By
                making a payment, you authorise us and our payment partners to
                charge your chosen payment method for the total amount shown at
                checkout, including any applicable fees or adjustments.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='customer-conduct'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Customer Responsibilities
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>As a customer, you agree to:</p>
              <ul className='list-disc list-inside space-y-1'>
                <li>arrive on time for your appointments;</li>
                <li>treat staff and other customers with respect;</li>
                <li>
                  comply with any reasonable policies or instructions of the
                  business; and
                </li>
                <li>
                  only make bookings you intend to attend or cancel in time.
                </li>
              </ul>
              <p>
                We may restrict access to the Platform where we reasonably
                believe there has been abusive, unsafe, or inappropriate
                behaviour towards businesses, staff, or other users.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='business-responsibilities'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Business Responsibilities
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>
                Businesses using Zendulge are independent providers responsible
                for:
              </p>
              <ul className='list-disc list-inside space-y-1'>
                <li>ensuring their services comply with applicable laws;</li>
                <li>holding any licences or insurance required by law;</li>
                <li>providing services as described in the deal;</li>
                <li>setting and communicating their own policies; and</li>
                <li>managing staff, premises, and customer safety.</li>
              </ul>
              <p>
                Zendulge does not supervise or control how services are
                performed and is not responsible for the quality, timeliness, or
                outcome of services provided by businesses.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='liability'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Liability and Disclaimers
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>
                To the extent permitted by law, Zendulge excludes all
                warranties, representations, and conditions not expressly set
                out in these Terms. Nothing in these Terms excludes, restricts,
                or modifies any right or remedy you may have under the{' '}
                <strong>Australian Consumer Law</strong> or other law that
                cannot be excluded.
              </p>
              <p>
                To the fullest extent permitted by law, Zendulge is not liable
                for any loss, damage, claim, or expense arising from:
              </p>
              <ul className='list-disc list-inside space-y-1'>
                <li>services provided (or not provided) by a business;</li>
                <li>actions or omissions of other users of the Platform;</li>
                <li>
                  your reliance on information or content on the Platform; or
                </li>
                <li>events beyond our reasonable control.</li>
              </ul>
              <p>
                Where our liability cannot be excluded, and to the extent
                permitted by law, our total liability to you is limited to the
                amount you paid for the relevant booking or, if no booking was
                made, AUD $100.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='governing-law'
            className='border border-gray-200 rounded-2xl bg-white px-6'
          >
            <AccordionTrigger className='text-left text-xl font-semibold text-gray-900'>
              Governing Law and Contact
            </AccordionTrigger>
            <AccordionContent className='text-gray-700 leading-relaxed space-y-3'>
              <p>
                These Terms are governed by the laws of{' '}
                <strong>New South Wales, Australia</strong>, and you submit to
                the non-exclusive jurisdiction of the courts of that State and
                the Commonwealth of Australia.
              </p>
              <p>
                If you have any questions about these Terms or the Platform,
                please contact us using the details provided on the Help page.
              </p>
              <p className='text-sm text-gray-500'>
                This summary of terms is provided for general information only
                and is not legal advice. You should obtain your own legal advice
                if you are unsure how these Terms apply to you or your business.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
