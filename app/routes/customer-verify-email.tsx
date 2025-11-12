import { BadgeCheck } from 'lucide-react';
import { useLocation } from 'react-router';

import { Card, CardContent } from '~/components/ui/card';

export default function CustomerRegistrationValidate() {
  const location = useLocation().state as { email: string };
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gray-50'>
      <Card className='w-full max-w-md mx-4'>
        <CardContent className='pt-6'>
          <div className='flex mb-4 gap-2'>
            <BadgeCheck className='h-8 w-8 text-green-500' />
            <h1 className='text-2xl font-bold text-gray-900'>
              Success, your registration link has been sent.
            </h1>
          </div>

          <p className='mt-4 text-sm text-gray-600 mb-6'>
            We&apos;ve sent a link to {location.email}. Click the link to
            complete registration and redeeming your exclusive offer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
