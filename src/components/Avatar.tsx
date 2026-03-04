import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarProps {
  config: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  allowOverflow?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ config, size = 'md', className = '', allowOverflow = false }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  const { 
    skinColor, 
    hairColor, 
    clothingColor, 
    backgroundColor, 
    hairStyle, 
    flipHair, 
    headwear, 
    headwearColor, 
    eyeType, 
    mouthType,
    pantsColor 
  } = config;

  return (
    <div
      className={`relative ${!allowOverflow ? 'rounded-2xl overflow-hidden' : ''} ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: !allowOverflow ? backgroundColor : 'transparent' }}
    >
      <svg viewBox="0 -20 200 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* --- BACK HAIR LAYER (Behind Head) --- */}
        <g transform={flipHair ? "scale(-1, 1) translate(-200, 0)" : ""}>
          {hairStyle === 'bun' && <circle cx="100" cy="40" r="25" fill={hairColor} />}
          {hairStyle === 'ponytail' && <path d="M140 90 Q 190 110 170 160" stroke={hairColor} strokeWidth="24" fill="none" strokeLinecap="round"/>}
          {hairStyle === 'afro' && <circle cx="100" cy="100" r="75" fill={hairColor} />}
          {hairStyle === 'wavy' && <path d="M40 90 Q 20 120 40 150 M 160 90 Q 180 120 160 150" stroke={hairColor} strokeWidth="25" strokeLinecap="round" />}
          {hairStyle === 'braids' && (
            <>
              <path d="M45 100 Q 30 130 35 160" stroke={hairColor} strokeWidth="15" strokeLinecap="round"/>
              <path d="M155 100 Q 170 130 165 160" stroke={hairColor} strokeWidth="15" strokeLinecap="round"/>
            </>
          )}
        </g>

        {/* --- BANDANA TAILS (Behind) --- */}
        {headwear === 'bandana' && (
           <g transform="rotate(10, 100, 100)">
             <path d="M140 80 Q 170 80 180 110" stroke={headwearColor} strokeWidth="12" fill="none" strokeLinecap="round" />
             <path d="M140 80 Q 160 90 165 120" stroke={headwearColor} strokeWidth="12" fill="none" strokeLinecap="round" />
           </g>
        )}

        {/* --- ARMS --- */}
        <path d="M45 165 Q 25 210 35 240" stroke={clothingColor} strokeWidth="20" strokeLinecap="round" />
        <path d="M155 165 Q 175 210 165 240" stroke={clothingColor} strokeWidth="20" strokeLinecap="round" />

        {/* --- LEGS / PANTS --- */}
        <path d="M55 210 H 145 V 230 C 145 235 55 235 55 230 Z" fill={pantsColor || "#374151"} />
        <path d="M55 215 L 45 285 L 95 285 L 95 215 Z" fill={pantsColor || "#374151"} />
        <path d="M105 215 L 105 285 L 155 285 L 145 215 Z" fill={pantsColor || "#374151"} />

        {/* --- SHOES --- */}
        <path d="M40 285 H 95 V 290 C 95 300 40 300 40 290 Z" fill="#111827" />
        <path d="M105 285 H 160 V 290 C 160 300 105 300 105 290 Z" fill="#111827" />

        {/* --- BODY --- */}
        <path d="M45 210V185C45 155 65 145 100 145C135 145 155 155 155 185V210H45Z" fill={clothingColor} />
        <path d="M85 145 L 100 170 L 115 145" fill="rgba(0,0,0,0.1)" />

        {/* --- NECK --- */}
        <rect x="82" y="120" width="36" height="30" fill={skinColor} />

        {/* --- HEAD BASE --- */}
        <rect x="55" y="55" width="90" height="85" rx="22" fill={skinColor} />

        {/* Ears */}
        <circle cx="50" cy="100" r="9" fill={skinColor} />
        <circle cx="150" cy="100" r="9" fill={skinColor} />

        {/* --- FACE --- */}
        <g transform="translate(0, 10)">
            {/* Eyes */}
            {eyeType === 'normal' && (
                <>
                    <ellipse cx="80" cy="80" rx="10" ry="13" fill="white" />
                    <circle cx="80" cy="80" r="5" fill="#1F2937" />
                    <ellipse cx="120" cy="80" rx="10" ry="13" fill="white" />
                    <circle cx="120" cy="80" r="5" fill="#1F2937" />
                </>
            )}
            {eyeType === 'happy' && (
                <>
                    <path d="M70 85 Q 80 78 90 85" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M110 85 Q 120 78 130 85" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
                </>
            )}
            {eyeType === 'glasses' && (
                 <>
                    <ellipse cx="80" cy="80" rx="10" ry="13" fill="white" />
                    <circle cx="80" cy="80" r="5" fill="#1F2937" />
                    <ellipse cx="120" cy="80" rx="10" ry="13" fill="white" />
                    <circle cx="120" cy="80" r="5" fill="#1F2937" />
                    
                    <rect x="64" y="68" width="32" height="24" rx="6" stroke="#374151" strokeWidth="3" fill="rgba(255,255,255,0.2)" />
                    <rect x="104" y="68" width="32" height="24" rx="6" stroke="#374151" strokeWidth="3" fill="rgba(255,255,255,0.2)" />
                    <line x1="96" y1="80" x2="104" y2="80" stroke="#374151" strokeWidth="3" />
                 </>
            )}
            {eyeType === 'sunglasses' && (
                 <>
                    <path d="M60 72H96V88C96 92 90 92 90 92H66C66 92 60 92 60 88V72Z" fill="#111827" />
                    <path d="M104 72H140V88C140 92 134 92 134 92H110C110 92 104 92 104 88V72Z" fill="#111827" />
                    <line x1="96" y1="76" x2="104" y2="76" stroke="#111827" strokeWidth="3" />
                 </>
            )}

            {/* Nose */}
            <path d="M100 95 Q 104 102 98 106" stroke="rgba(0,0,0,0.15)" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* Mouth */}
            {mouthType === 'smile' && <path d="M92 118 Q 100 122 108 118" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />}
            {mouthType === 'grin' && <path d="M88 115 Q 100 128 112 115" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />}
            {mouthType === 'neutral' && <line x1="92" y1="120" x2="108" y2="120" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />}
            {mouthType === 'open' && <circle cx="100" cy="120" r="6" fill="#1F2937" />}
        </g>

        {/* --- FRONT HAIR LAYER (On top of head, but below headwear) --- */}
        <g transform={flipHair ? "scale(-1, 1) translate(-200, 0)" : ""}>
            {hairStyle === 'short' && <path d="M55 75C55 45 75 35 100 35C125 35 145 45 145 75V55H55V75Z" fill={hairColor} />}
            {hairStyle === 'buzz' && <path d="M55 65C55 50 75 45 100 45C125 45 145 50 145 65V55H55V65Z" fill={hairColor} opacity="0.8" />}
            {hairStyle === 'spiky' && <path d="M55 60L65 20L80 40L100 10L120 40L135 20L145 60V55H55V60Z" fill={hairColor} />}
            {hairStyle === 'bun' && <path d="M55 75C55 55 75 45 100 45C125 45 145 55 145 75V60H55V75Z" fill={hairColor} />}
            {hairStyle === 'ponytail' && <path d="M55 75C55 55 75 45 100 45C125 45 145 55 145 75V60H55V75Z" fill={hairColor} />}
            {hairStyle === 'sidepart' && <path d="M50 70C50 30 90 25 120 35C150 45 150 80 150 90L135 50L50 70Z" fill={hairColor} transform="translate(0, 5)" />}
            {hairStyle === 'curly' && <path d="M50 70 C 60 30, 100 20, 150 70" stroke={hairColor} strokeWidth="25" strokeLinecap="round" fill="none" />}
            {hairStyle === 'afro' && <path d="M50 80 C 50 40 70 30 100 30 C 130 30 150 40 150 80" fill={hairColor} />}
            {hairStyle === 'wavy' && <path d="M55 70 Q 75 30 100 50 Q 125 30 145 70 V 55 H 55" fill={hairColor} />}
            {hairStyle === 'braids' && <path d="M55 70 Q 100 40 145 70 V 60 H 55" fill={hairColor} />}
        </g>

        {/* --- HEADWEAR --- */}
        <g>
            {headwear === 'cap' && (
                <>
                  <path d="M50 75C50 45 70 35 100 35C130 35 150 45 150 75" fill={headwearColor} />
                  <rect x="45" y="70" width="110" height="12" rx="4" fill={headwearColor} stroke="rgba(0,0,0,0.1)" />
                  <path d="M140 75L170 75" stroke={headwearColor} strokeWidth="8" strokeLinecap="round" />
                </>
            )}
            {headwear === 'beanie' && (
                 <path d="M50 80C50 40 65 30 100 30C135 30 150 40 150 80H50Z" fill={headwearColor} />
            )}
            {headwear === 'bandana' && (
                 <>
                   <path d="M50 55 C 80 50, 120 50, 150 55 L 150 75 C 120 70, 80 70, 50 75 Z" fill={headwearColor} />
                   <path d="M140 60 L 150 55 L 160 70 L 150 75 Z" fill={headwearColor} />
                 </>
            )}
        </g>
      </svg>
    </div>
  );
};

export default Avatar;
