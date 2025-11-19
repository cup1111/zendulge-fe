import * as TogglePrimitive from '@radix-ui/react-toggle';
import { type VariantProps } from 'class-variance-authority';
import React from 'react';

import { combineClasses } from '~/lib/utils';

import { toggleVariants } from './toggle-variants';

const Toggle = ({
  className,
  variant,
  size,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) => (
  <TogglePrimitive.Root
    ref={ref}
    className={combineClasses(toggleVariants({ variant, size, className }))}
    {...props}
  />
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
