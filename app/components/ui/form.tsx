import React from 'react';

import { combineClasses } from '~/lib/utils';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export const Form = ({
  children,
  onSubmit,
  className,
  ...props
}: FormProps) => (
  <form
    onSubmit={e => {
      e.preventDefault();
      onSubmit?.(e);
    }}
    className={combineClasses('space-y-4', className)}
    {...props}
  >
    {children}
  </form>
);

interface FormFieldProps {
  children: React.ReactNode;
}

export const FormField = ({ children }: FormFieldProps) => (
  <div className='space-y-2'>{children}</div>
);

interface FormItemProps {
  children: React.ReactNode;
  className?: string;
}

export const FormItem = ({ children, className }: FormItemProps) => (
  <div className={combineClasses('space-y-1', className)}>{children}</div>
);

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

export const FormLabel = ({
  children,
  className,
  htmlFor,
  ...props
}: FormLabelProps) => (
  <label
    className={combineClasses('text-sm font-medium', className)}
    htmlFor={htmlFor}
    {...props}
  >
    {children}
  </label>
);

interface FormControlProps {
  children: React.ReactNode;
}

export const FormControl = ({ children }: FormControlProps) => children;

interface FormDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const FormDescription = ({
  children,
  className,
}: FormDescriptionProps) => (
  <p className={combineClasses('text-sm text-muted-foreground', className)}>
    {children}
  </p>
);

interface FormMessageProps {
  children: React.ReactNode;
  className?: string;
}

export const FormMessage = ({ children, className }: FormMessageProps) =>
  children && (
    <p className={combineClasses('text-sm text-destructive', className)}>
      {children}
    </p>
  );
