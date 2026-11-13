import React from 'react';
import mascotPng from '../../assets/sketch-mascot.png';
import mascotDarkPng from '../../assets/sketch-mascot-dark.png';

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
      {/* Light Mode Mascot */}
      <img
        src={mascotPng}
        alt="سكتش مان - تميمة سكتش أوردر"
        className="w-full h-full object-contain filter drop-shadow-md dark:hidden transition-transform"
      />
      {/* Dark Mode Mascot (White ink lines + glowing warm scarf) */}
      <img
        src={mascotDarkPng}
        alt="سكتش مان - تميمة سكتش أوردر"
        className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(249,115,22,0.35)] hidden dark:block transition-transform"
      />
    </div>
  );
};
