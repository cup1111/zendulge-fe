import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { combineClasses } from '~/lib/utils';

interface AnimatedFormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  type?: 'error' | 'success' | 'warning' | 'loading';
  animate?: boolean;
}

const AnimatedFormMessage = ({
  className,
  children,
  type = 'error',
  animate = true,
  ref,
  ...props
}: AnimatedFormMessageProps & { ref?: React.Ref<HTMLParagraphElement> }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (children) {
      // Use requestAnimationFrame to defer state updates
      requestAnimationFrame(() => {
        setShouldRender(true);
        // Small delay to trigger enter animation
        setTimeout(() => setIsVisible(true), 10);
      });
      return undefined; // Return cleanup function or undefined
    }

    // Handle no children case with timeout
    const hideTimer = setTimeout(() => setIsVisible(false), 0);
    const unmountTimer = setTimeout(() => setShouldRender(false), 200);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, [children]);

  if (!shouldRender) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case 'warning':
        return <AlertTriangle className='w-4 h-4 text-yellow-500' />;
      case 'loading':
        return <Loader2 className='w-4 h-4 text-blue-500 animate-spin' />;
      case 'error':
      default:
        return <XCircle className='w-4 h-4 text-red-500' />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'loading':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error':
      default:
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  return (
    <div
      className={combineClasses(
        'overflow-hidden transition-all duration-300 ease-out',
        animate && isVisible
          ? 'max-h-20 opacity-100 transform translate-y-0'
          : 'max-h-0 opacity-0 transform -translate-y-2'
      )}
    >
      <p
        ref={ref}
        className={combineClasses(
          'text-sm font-medium flex items-center gap-2 p-2 rounded-md border transition-all duration-200',
          getTypeStyles(),
          className
        )}
        {...props}
      >
        {getIcon()}
        <span>{children}</span>
      </p>
    </div>
  );
};

AnimatedFormMessage.displayName = 'AnimatedFormMessage';

export { AnimatedFormMessage };
