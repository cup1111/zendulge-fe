import React, { useEffect, useState } from 'react';

import { combineClasses } from '~/lib/utils';

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 150); // 150ms 延迟，给用户时间移动鼠标到子元素
    setTimeoutId(id);
  };
  useEffect(
    () => () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    },
    [timeoutId]
  );
  return (
    <div
      className='relative inline-block'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, { isOpen, setIsOpen } as Partial<
              typeof child.props
            >)
          : child
      )}
    </div>
  );
};

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: 'center' | 'start' | 'end';
  className?: string;
  isOpen?: boolean;
}

export const DropdownMenuContent = ({
  children,
  align = 'center',
  className,
  isOpen,
}: DropdownMenuContentProps) => {
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

interface DropdownMenuItemProps {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

export const DropdownMenuItem = ({
  children,
  asChild: _asChild,
  onClick,
  className,
}: DropdownMenuItemProps) => {
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
