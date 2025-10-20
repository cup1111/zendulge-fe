import React from 'react';

import { combineClasses } from '~/lib/utils';

const Card = ({ ref, className, ...props }: React.ComponentProps<'div'>) => (
  <div
    ref={ref}
    className={combineClasses(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
);

Card.displayName = 'Card';

const CardHeader = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'div'>) => (
  <div
    ref={ref}
    className={combineClasses('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
);

CardHeader.displayName = 'CardHeader';

const CardTitle = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'h3'>) => (
  <h3
    ref={ref}
    className={combineClasses(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
);

CardTitle.displayName = 'CardTitle';

const CardDescription = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'p'>) => (
  <p
    ref={ref}
    className={combineClasses('text-sm text-muted-foreground', className)}
    {...props}
  />
);
CardDescription.displayName = 'CardDescription';

const CardContent = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'div'>) => (
  <div ref={ref} className={combineClasses('p-6 pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'div'>) => (
  <div
    ref={ref}
    className={combineClasses('flex items-center p-6 pt-0', className)}
    {...props}
  />
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
