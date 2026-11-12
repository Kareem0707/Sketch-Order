import React from 'react';

interface DividerProps {
  variant?: 'squiggly' | 'pencil' | 'zigzag' | 'torn' | 'dotted';
  className?: string;
  height?: number;
}

export const HandDrawnDivider: React.FC<DividerProps> = ({
  variant = 'squiggly',
  className = '',
  height = 16,
}) => {
  if (variant === 'squiggly') {
    return (
      <div className={`w-full overflow-hidden my-4 ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 1200 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full text-[#0F0F0F]"
          style={{ height: `${height}px` }}
          preserveAspectRatio="none"
        >
          <path
            d="M0 12 Q 30 2, 60 12 T 120 12 T 180 12 T 240 12 T 300 12 T 360 12 T 420 12 T 480 12 T 540 12 T 600 12 T 660 12 T 720 12 T 780 12 T 840 12 T 900 12 T 960 12 T 1020 12 T 1080 12 T 1140 12 T 1200 12"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'pencil') {
    return (
      <div className={`w-full overflow-hidden my-4 ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 1000 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full text-[#0F0F0F]"
          style={{ height: `${height}px` }}
          preserveAspectRatio="none"
        >
          <path
            d="M2 6 C 150 4.5, 300 7.5, 500 5.5 C 700 7, 850 4.8, 998 6.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M10 7 C 220 5.8, 480 7, 720 5.8 C 880 6.8, 950 6, 990 6.2"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'zigzag') {
    return (
      <div className={`w-full overflow-hidden my-4 ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 1200 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full text-[#0F0F0F]"
          style={{ height: `${height}px` }}
          preserveAspectRatio="none"
        >
          <path
            d="M0 15 L 20 5 L 40 15 L 60 5 L 80 15 L 100 5 L 120 15 L 140 5 L 160 15 L 180 5 L 200 15 L 220 5 L 240 15 L 260 5 L 280 15 L 300 5 L 320 15 L 340 5 L 360 15 L 380 5 L 400 15 L 420 5 L 440 15 L 460 5 L 480 15 L 500 5 L 520 15 L 540 5 L 560 15 L 580 5 L 600 15 L 620 5 L 640 15 L 660 5 L 680 15 L 700 5 L 720 15 L 740 5 L 760 15 L 780 5 L 800 15 L 820 5 L 840 15 L 860 5 L 880 15 L 900 5 L 920 15 L 940 5 L 960 15 L 980 5 L 1000 15 L 1020 5 L 1040 15 L 1060 5 L 1080 15 L 1100 5 L 1120 15 L 1140 5 L 1160 15 L 1180 5 L 1200 15"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'torn') {
    return (
      <div className={`w-full overflow-hidden my-4 ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 1000 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full text-[#0F0F0F]"
          style={{ height: `${height}px` }}
          preserveAspectRatio="none"
        >
          <path
            d="M0 12 L 25 18 L 50 8 L 75 16 L 100 10 L 130 19 L 160 9 L 195 17 L 225 11 L 260 18 L 290 9 L 325 16 L 355 11 L 390 19 L 425 9 L 455 17 L 490 10 L 525 19 L 560 9 L 595 17 L 630 11 L 665 19 L 700 9 L 735 17 L 770 10 L 805 18 L 840 9 L 875 18 L 910 10 L 945 19 L 980 9 L 1000 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  // Dotted
  return (
    <div className={`w-full overflow-hidden my-4 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1000 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full text-[#0F0F0F]"
        style={{ height: `${height}px` }}
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="5"
          x2="1000"
          y2="5"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="4 12"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
