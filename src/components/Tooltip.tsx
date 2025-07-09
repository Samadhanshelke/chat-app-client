import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  position = 'top',
  className = '',
}) => {
  const [show, setShow] = useState(false);

  const getPositionClass = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <div
        className={`absolute z-10 whitespace-nowrap bg-black text-white text-sm px-4 py-2 rounded-lg transform transition-all duration-300 ease-out origin-left
          ${getPositionClass()} ${show ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}
          ${className}`}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
