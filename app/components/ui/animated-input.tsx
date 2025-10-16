import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import React from 'react';

import { combineClasses } from '~/lib/utils';

export interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  validationState?: 'idle' | 'valid' | 'invalid' | 'warning';
  showValidationIcon?: boolean;
  animateOnChange?: boolean;
}

const AnimatedInput = ({
  className,
  type,
  validationState = 'idle',
  showValidationIcon = true,
  animateOnChange = true,
  ref,
  ...props
}: AnimatedInputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const getValidationStyles = () => {
    switch (validationState) {
      case 'valid':
        return 'border-green-500 focus:border-green-600 bg-green-50/30';
      case 'invalid':
        return 'border-red-500 focus:border-red-600 bg-red-50/30';
      case 'warning':
        return 'border-yellow-500 focus:border-yellow-600 bg-yellow-50/30';
      default:
        return 'border-input focus:border-shadow-lavender';
    }
  };

  const getValidationIcon = () => {
    if (!showValidationIcon || validationState === 'idle' || !hasInteracted)
      return null;

    switch (validationState) {
      case 'valid':
        return (
          <CheckCircle className='w-4 h-4 text-green-500 animate-in fade-in-0 zoom-in-95 duration-200' />
        );
      case 'invalid':
        return (
          <XCircle className='w-4 h-4 text-red-500 animate-in fade-in-0 zoom-in-95 duration-200' />
        );
      case 'warning':
        return (
          <AlertTriangle className='w-4 h-4 text-yellow-500 animate-in fade-in-0 zoom-in-95 duration-200' />
        );
      default:
        return null;
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setHasInteracted(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <div className='relative'>
      <input
        type={type}
        className={combineClasses(
          'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          'transition-all duration-200 ease-out',
          getValidationStyles(),
          isFocused && 'scale-[1.01] shadow-md',
          animateOnChange &&
            validationState !== 'idle' &&
            hasInteracted &&
            'animate-pulse',
          showValidationIcon &&
            hasInteracted &&
            validationState !== 'idle' &&
            'pr-10',
          className
        )}
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />

      {showValidationIcon && hasInteracted && (
        <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
          {getValidationIcon()}
        </div>
      )}
    </div>
  );
};

AnimatedInput.displayName = 'AnimatedInput';

export { AnimatedInput };
