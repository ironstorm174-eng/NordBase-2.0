import React from 'react';

interface NordBaseLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showDotPt?: boolean;
  className?: string;
  onClick?: () => void;
  compactMobile?: boolean;
}

export function NordBaseCompassIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top Arc - White (Perfect 170-degree circular arc) */}
      <path 
        d="M 13.15 46.78 A 37 37 0 0 1 86.85 46.78" 
        stroke="#FFFFFF" 
        strokeWidth="10" 
        strokeLinecap="butt" 
      />
      {/* Bottom Arc - Electric Blue (Perfect 170-degree circular arc) */}
      <path 
        d="M 86.85 53.22 A 37 37 0 0 1 13.15 53.22" 
        stroke="#0066FF" 
        strokeWidth="10" 
        strokeLinecap="butt" 
      />
      {/* Needle pointing at ~2 o'clock (~28 deg) - UPPER PART BLUE, LOWER PART WHITE */}
      <g transform="rotate(28 50 50)">
        {/* Upper Needle Tip - Electric Blue */}
        <polygon points="50,16 61.5,50 50,50" fill="#0066FF" />
        <polygon points="50,16 38.5,50 50,50" fill="#1A75FF" />
        {/* Lower Needle Tip - White / Silver */}
        <polygon points="50,84 61.5,50 50,50" fill="#CBD5E1" />
        <polygon points="50,84 38.5,50 50,50" fill="#FFFFFF" />
        {/* Center pivot hole */}
        <circle cx="50" cy="50" r="4.5" fill="#030712" />
      </g>
    </svg>
  );
}

export default function NordBaseLogo({
  size = 'md',
  showText = true,
  showDotPt = true,
  className = '',
  onClick,
  compactMobile = true
}: NordBaseLogoProps) {
  const iconSizeMap = {
    sm: 'w-5 h-5 sm:w-6 sm:h-6',
    md: 'w-7 h-7 sm:w-8 sm:h-8',
    lg: 'w-8 h-8 sm:w-10 sm:h-10',
    xl: 'w-10 h-10 sm:w-14 sm:h-14'
  };

  const textSizeMap = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-2xl',
    lg: 'text-xl sm:text-3xl',
    xl: 'text-2xl sm:text-5xl'
  };

  return (
    <div 
      className={`flex items-center gap-1.5 sm:gap-2.5 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="shrink-0 transition-transform duration-300 group-hover:scale-105">
        <NordBaseCompassIcon className={iconSizeMap[size]} />
      </div>
      {showText && (
        <span className={`font-sans font-extrabold tracking-tight ${textSizeMap[size]} leading-none`}>
          {compactMobile ? (
            <>
              {/* Mobile & Tablet version: NB (N white, B blue) */}
              <span className="inline md:hidden font-extrabold tracking-tight">
                <span className="text-white">N</span>
                <span className="text-[#0066FF]">B</span>
              </span>
              {/* Desktop version: NordBase.pt */}
              <span className="hidden md:inline">
                <span className="text-white">Nord</span>
                <span className="text-[#0066FF]">Base</span>
                {showDotPt && <span className="text-slate-400 font-bold text-[0.65em] ml-0.5">.pt</span>}
              </span>
            </>
          ) : (
            <>
              <span className="text-white">Nord</span>
              <span className="text-[#0066FF]">Base</span>
              {showDotPt && <span className="text-slate-400 font-bold text-[0.65em] ml-0.5">.pt</span>}
            </>
          )}
        </span>
      )}
    </div>
  );
}
