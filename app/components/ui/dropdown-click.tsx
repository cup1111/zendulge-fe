import React, { useEffect, useRef } from 'react';

import { combineClasses } from '~/lib/utils';

export const DropdownClick = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMouseClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className='relative inline-block'>
      <button
        type='button'
        className='relative inline-block'
        onClick={handleMouseClick}
      >
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child, { isOpen, setIsOpen } as Partial<
                typeof child.props
              >)
            : child
        )}
      </button>
    </div>
  );
};

interface DropdownClickContentProps {
  children: React.ReactNode;
  align?: 'center' | 'start' | 'end';
  className?: string;
  isOpen?: boolean;
}

export const DropdownClickContent = ({
  children,
  align = 'center',
  className,
  isOpen,
}: DropdownClickContentProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={combineClasses(
        'absolute z-50 min-w-[200px] rounded-md border bg-white p-1 shadow-md',
        align === 'center' && 'left-1/2 -translate-x-1/2',
        align === 'end' && 'right-0',
        align === 'start' && 'left-0',
        className
      )}
    >
      {children}
    </div>
  );
};

interface DropdownClickItemProps {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

export const DropdownClickItem = ({
  children,
  asChild: _asChild,
  onClick,
  className,
}: DropdownClickItemProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      role='button'
      tabIndex={0}
      className={combineClasses(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'hover:bg-gray-100 transition-colors focus:bg-gray-100',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};
