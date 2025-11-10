import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { combineClasses } from '~/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = ({
  className,
  variant,
  ref,
  ...props
}: React.ComponentPropsWithRef<'div'> & VariantProps<typeof alertVariants>) => (
  <div
    ref={ref}
    role='alert'
    className={combineClasses(alertVariants({ variant }), className)}
    {...props}
  />
);
Alert.displayName = 'Alert';

const AlertTitle = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<'h5'>) => (
  <h5
    ref={ref}
    className={combineClasses(
      'mb-1 font-medium leading-none tracking-tight',
      className
    )}
    {...props}
  />
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<'div'>) => (
  <div
    ref={ref}
    className={combineClasses('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription, AlertTitle };
