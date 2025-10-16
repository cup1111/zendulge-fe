'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import React from 'react';

import { combineClasses } from '~/lib/utils';

const Progress = ({
  className,
  value,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof ProgressPrimitive.Root>) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={combineClasses(
      'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className='h-full w-full flex-1 bg-primary transition-all'
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
