import { type VariantProps } from 'class-variance-authority';
import React from 'react';

import { combineClasses } from '~/lib/utils';

import { badgeVariants } from './badge-variants';

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <div
    className={combineClasses(badgeVariants({ variant }), className)}
    {...props}
  />
);

export { Badge };
