import React from 'react';
import mascotPng from '../../assets/sketch-mascot.png';

export type StickmanPose =
  | 'mascot'
  | 'pointing'
  | 'stressed'
  | 'celebrating'
  | 'juggling'
  | 'relaxing'
  | 'drawing'
  | 'delivering';

interface StickmanProps {
  pose?: StickmanPose;
  className?: string;
  size?: number;
  animated?: boolean;
}

export const StickmanDoodle: React.FC<StickmanProps> = ({
  className = '',
  size = 140,
  animated = true,
}) => {
  const animClass = animated ? 'animate-wobble-slow' : '';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${animClass} ${className}`}
      style={{ width: `${size}px`, height: `${size * 1.25}px` }}
    >
      <img
        src={mascotPng}
        alt="سكتش مان - تميمة براند سكتش أوردر الرسمية"
        className="w-full h-full object-contain filter drop-shadow-md transition-transform"
      />
    </div>
  );
};
