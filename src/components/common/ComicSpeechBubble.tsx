import React from 'react';

interface ComicSpeechBubbleProps {
  children: React.ReactNode;
  tailDirection?: 'bottom-right' | 'bottom-left' | 'top-right' | 'left' | 'right' | 'none';
  className?: string;
  variant?: 'normal' | 'scream' | 'thought' | 'whisper';
}

export const ComicSpeechBubble: React.FC<ComicSpeechBubbleProps> = ({
  children,
  tailDirection = 'bottom-right',
  className = '',
  variant = 'normal',
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`bg-white text-[#0F0F0F] border-[2.5px] border-[#0F0F0F] p-3 md:p-4 font-bold text-sm md:text-base sketch-shadow-sm transition-all duration-150 ${
          variant === 'scream'
            ? 'sketch-border-2 border-[3px]'
            : variant === 'thought'
            ? 'sketch-border-circle'
            : 'sketch-border-1'
        }`}
      >
        {children}
      </div>

      {/* Speech Tail */}
      {tailDirection === 'bottom-right' && (
        <svg
          className="absolute -bottom-3 right-6 w-5 h-4 text-[#0F0F0F]"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0 L 12 14 L 18 0"
            stroke="#0F0F0F"
            strokeWidth="2.5"
            fill="#FFFFFF"
            strokeLinejoin="round"
          />
          {/* White cover to hide inner border */}
          <line x1="2" y1="0" x2="16" y2="0" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
      )}

      {tailDirection === 'bottom-left' && (
        <svg
          className="absolute -bottom-3 left-6 w-5 h-4 text-[#0F0F0F]"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 0 L 6 14 L 0 0"
            stroke="#0F0F0F"
            strokeWidth="2.5"
            fill="#FFFFFF"
            strokeLinejoin="round"
          />
          <line x1="2" y1="0" x2="16" y2="0" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
      )}

      {tailDirection === 'left' && (
        <svg
          className="absolute top-1/2 -left-3 -translate-y-1/2 w-4 h-5 text-[#0F0F0F]"
          viewBox="0 0 16 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 2 L 2 10 L 16 18"
            stroke="#0F0F0F"
            strokeWidth="2.5"
            fill="#FFFFFF"
            strokeLinejoin="round"
          />
          <line x1="16" y1="3" x2="16" y2="17" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
      )}

      {tailDirection === 'right' && (
        <svg
          className="absolute top-1/2 -right-3 -translate-y-1/2 w-4 h-5 text-[#0F0F0F]"
          viewBox="0 0 16 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 2 L 14 10 L 0 18"
            stroke="#0F0F0F"
            strokeWidth="2.5"
            fill="#FFFFFF"
            strokeLinejoin="round"
          />
          <line x1="0" y1="3" x2="0" y2="17" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
      )}
    </div>
  );
};
