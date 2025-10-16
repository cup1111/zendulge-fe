import React from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { AnimatedFormMessage } from '~/components/ui/animated-form-message';
import { AnimatedInput } from '~/components/ui/animated-input';
import { FormItem, FormLabel, FormControl } from '~/components/ui/form';
import { useAnimatedValidation } from '~/hooks/use-animated-validation';
import { combineClasses } from '~/lib/utils';

interface AnimatedFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  customValidation?: (
    value: any
  ) => Promise<{ isValid: boolean; message?: string; type?: 'warning' }>;
  showValidationIcon?: boolean;
  animateOnChange?: boolean;
  required?: boolean;
}

export function AnimatedFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  customValidation,
  showValidationIcon = true,
  animateOnChange = true,
  required = false,
  className,
  ...inputProps
}: AnimatedFormFieldProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const validationState = useAnimatedValidation({
    error,
    value: field.value,
    customValidation,
    debounceMs: 300,
  });

  const getMessageType = () => {
    if (error) return 'error';
    if (validationState.status === 'warning') return 'warning';
    if (validationState.status === 'valid') return 'success';
    if (validationState.status === 'loading') return 'loading';
    return 'error';
  };

  const getMessage = () => {
    if (error) return error.message;
    return validationState.message;
  };

  return (
    <FormItem className='space-y-3'>
      {label && (
        <FormLabel
          className={combineClasses(
            'transition-colors duration-200',
            error && 'text-destructive',
            validationState.status === 'valid' && 'text-green-600',
            validationState.status === 'warning' && 'text-yellow-600'
          )}
        >
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </FormLabel>
      )}

      <FormControl>
        <AnimatedInput
          {...inputProps}
          {...field}
          validationState={(() => {
            if (error) return 'invalid';
            if (validationState.status === 'loading') return 'idle';
            return validationState.status;
          })()}
          showValidationIcon={showValidationIcon}
          animateOnChange={animateOnChange}
          className={combineClasses(
            'transition-all duration-200',
            validationState.isAnimating && 'animate-pulse',
            className
          )}
        />
      </FormControl>

      {description && !error && !validationState.message && (
        <p className='text-sm text-muted-foreground'>{description}</p>
      )}

      <AnimatedFormMessage type={getMessageType()} animate>
        {getMessage()}
      </AnimatedFormMessage>
    </FormItem>
  );
}
