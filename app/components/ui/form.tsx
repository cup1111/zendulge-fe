// 简化的表单组件
import React from 'react';

import { combineClasses } from '~/lib/utils';

export const Form = ({ children, onSubmit, className, ...props }: any) => (
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

export const FormField = ({ children }: any) => (
  <div className='space-y-2'>{children}</div>
);
export const FormItem = ({ children, className }: any) => (
  <div className={combineClasses('space-y-1', className)}>{children}</div>
);
export const FormLabel = ({ children, className, htmlFor, ...props }: any) => (
  <label
    className={combineClasses('text-sm font-medium', className)}
    htmlFor={htmlFor}
    {...props}
  >
    {children}
  </label>
);
export const FormControl = ({ children }: any) => children;
export const FormDescription = ({ children, className }: any) => (
  <p className={combineClasses('text-sm text-muted-foreground', className)}>
    {children}
  </p>
);
export const FormMessage = ({ children, className }: any) =>
  children && (
    <p className={combineClasses('text-sm text-destructive', className)}>
      {children}
    </p>
  );

export const useFormField = () => ({
  id: 'field',
  name: 'field',
  formItemId: 'field-item',
  formDescriptionId: 'field-desc',
  formMessageId: 'field-message',
  error: null,
});
