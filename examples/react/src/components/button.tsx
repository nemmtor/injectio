import { ReactNode } from 'react';

import { cn } from '../utils';

type Props = {
  className?: string;
  onClick?: VoidFunction;
  children: ReactNode;
};

export const Button = ({ children, onClick, className }: Props) => {
  return (
    <button
      className={cn(
        'py-1 px-2 ring-purple-400 ring-2 rounded-sm cursor-pointer',
        className
      )}
      onClick={onClick}>
      {children}
    </button>
  );
};
