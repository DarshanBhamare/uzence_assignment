import React from 'react';

export interface AvatarProps {
  initials: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
};

// Generate a gradient color based on initials for consistency
const getGradientColor = (initials: string): string => {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
    'from-indigo-500 to-blue-500',
    'from-pink-500 to-rose-500',
    'from-teal-500 to-cyan-500',
    'from-amber-500 to-orange-500',
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index] || colors[0];
};

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  name,
  size = 'md',
  className = '',
}) => {
  const gradient = getGradientColor(initials);

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-gradient-to-br
        ${gradient}
        text-white
        font-semibold
        font-sans
        flex
        items-center
        justify-center
        flex-shrink-0
        shadow-card
        ring-1 ring-white
        hover:scale-105
        transition-all
        duration-150
        ${className}
      `}
      title={name}
      aria-label={name ? `Avatar for ${name}` : 'Avatar'}
    >
      {initials}
    </div>
  );
};
