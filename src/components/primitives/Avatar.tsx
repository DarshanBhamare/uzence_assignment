import React from 'react';

export interface AvatarProps {
  initials: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  name,
  size = 'md',
  className = '',
}) => {
  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-blue-500
        text-white
        font-semibold
        flex
        items-center
        justify-center
        flex-shrink-0
        ${className}
      `}
      title={name}
      aria-label={name ? `Avatar for ${name}` : 'Avatar'}
    >
      {initials}
    </div>
  );
};
