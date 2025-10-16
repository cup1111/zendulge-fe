import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import React from 'react';

import { combineClasses } from '~/lib/utils';

const Accordion = AccordionPrimitive.Root;

type ItemProps = React.ComponentPropsWithRef<typeof AccordionPrimitive.Item>;

const AccordionItem = ({ ref, className, ...props }: ItemProps) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={combineClasses('border-b', className)}
    {...props}
  />
);

AccordionItem.displayName = 'AccordionItem';

type TriggerProps = React.ComponentPropsWithRef<
  typeof AccordionPrimitive.Trigger
>;

const AccordionTrigger = ({
  ref,
  className,
  children,
  ...props
}: TriggerProps) => (
  <AccordionPrimitive.Header className='flex'>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={combineClasses(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className='h-4 w-4 shrink-0 transition-transform duration-200' />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

type ContentProps = React.ComponentPropsWithRef<
  typeof AccordionPrimitive.Content
>;

const AccordionContent = ({
  ref,
  className,
  children,
  ...props
}: ContentProps) => (
  <AccordionPrimitive.Content
    ref={ref}
    className='overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
    {...props}
  >
    <div className={combineClasses('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
);

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
