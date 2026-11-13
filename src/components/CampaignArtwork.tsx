import React from 'react';
import { Campaign } from '../types';

interface CampaignArtworkProps {
  category: Campaign['category'];
  urgent?: boolean;
  className?: string;
}

export const CampaignArtwork: React.FC<CampaignArtworkProps> = ({
  category,
  urgent = false,
  className = '',
}) => {
  const paletteByCategory: Record<
    Campaign['category'],
    { bg: string; primary: string; secondary: string; accent: string }
  > = {
    'Crisis Relief': {
      bg: '#FFF1F2',
      primary: '#E11D48',
      secondary: '#0D9488',
      accent: '#2563EB',
    },
    'Clean Water': {
      bg: '#F0FDFA',
      primary: '#0D9488',
      secondary: '#2563EB',
      accent: '#0F172A',
    },
    Education: {
      bg: '#EFF6FF',
      primary: '#2563EB',
      secondary: '#0D9488',
      accent: '#0F172A',
    },
    'Local Food': {
      bg: '#F0FDFA',
      primary: '#0F766E',
      secondary: '#2563EB',
      accent: '#E11D48',
    },
    Climate: {
      bg: '#F1F5F9',
      primary: '#0D9488',
      secondary: '#1D4ED8',
      accent: '#0F172A',
    },
  };

  const p = paletteByCategory[category];

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{ backgroundColor: p.bg }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id={`grid-${category.replace(/\s/g, '')}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" stroke="#0F172A" strokeOpacity="0.05" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="180" fill={`url(#grid-${category.replace(/\s/g, '')})`} />

        {category === 'Crisis Relief' && (
          <g>
            <circle cx="315" cy="88" r="64" fill={p.primary} fillOpacity="0.1" />
            <circle cx="315" cy="88" r="42" stroke={p.primary} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="44" y="42" width="136" height="96" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M68 92 H156 M68 108 H132" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            <rect x="68" y="60" width="28" height="18" rx="4" fill={p.secondary} fillOpacity="0.2" stroke={p.secondary} strokeWidth="1.5" />
            <path d="M315 62 V114 M289 88 H341" stroke={p.primary} strokeWidth="6" strokeLinecap="round" />
            <path d="M210 130 C235 90, 260 110, 285 75" stroke={p.accent} strokeWidth="2" strokeDasharray="3 3" />
          </g>
        )}

        {category === 'Clean Water' && (
          <g>
            <path d="M0 132 Q100 105 200 128 T400 118 V180 H0 Z" fill={p.primary} fillOpacity="0.14" />
            <path d="M0 148 Q120 128 240 146 T400 138 V180 H0 Z" fill={p.secondary} fillOpacity="0.14" />
            <circle cx="290" cy="78" r="46" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <path
              d="M290 48 C290 48 268 74 268 88 C268 100.15 277.85 110 290 110 C302.15 110 312 100.15 312 88 C312 74 290 48 290 48 Z"
              fill={p.primary}
              fillOpacity="0.2"
              stroke={p.primary}
              strokeWidth="2.5"
            />
            <rect x="48" y="46" width="144" height="62" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <circle cx="72" cy="77" r="10" fill={p.secondary} fillOpacity="0.2" stroke={p.secondary} strokeWidth="2" />
            <path d="M94 71 H170 M94 85 H146" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {category === 'Education' && (
          <g>
            <rect x="236" y="34" width="122" height="112" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <rect x="256" y="54" width="82" height="44" rx="6" fill={p.primary} fillOpacity="0.12" stroke={p.primary} strokeWidth="1.5" />
            <path d="M272 76 L286 64 L300 82 L320 62" stroke={p.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="268" cy="118" r="8" fill={p.secondary} fillOpacity="0.25" />
            <circle cx="296" cy="118" r="8" fill={p.primary} fillOpacity="0.25" />
            <circle cx="324" cy="118" r="8" fill="#0F172A" fillOpacity="0.12" />
            <rect x="42" y="52" width="160" height="76" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M64 78 H174 M64 96 H148 M64 112 H122" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {category === 'Local Food' && (
          <g>
            <rect x="48" y="44" width="168" height="92" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <rect x="66" y="64" width="52" height="52" rx="8" fill={p.primary} fillOpacity="0.15" stroke={p.primary} strokeWidth="1.5" />
            <path d="M80 90 L90 100 L108 80" stroke={p.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M134 74 H192 M134 92 H182 M134 110 H164" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            <circle cx="305" cy="90" r="52" fill={p.secondary} fillOpacity="0.1" />
            <path d="M275 104 C275 78 298 62 325 66 C328 92 312 114 285 112" fill={p.primary} fillOpacity="0.22" stroke={p.primary} strokeWidth="2" />
            <path d="M282 110 L314 78" stroke={p.primary} strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {category === 'Climate' && (
          <g>
            <path d="M0 144 Q140 112 280 138 T400 126 V180 H0 Z" fill={p.primary} fillOpacity="0.15" />
            <circle cx="298" cy="86" r="48" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M298 118 V70" stroke={p.primary} strokeWidth="3" strokeLinecap="round" />
            <circle cx="298" cy="64" r="18" fill={p.primary} fillOpacity="0.22" stroke={p.primary} strokeWidth="2" />
            <circle cx="280" cy="80" r="13" fill={p.secondary} fillOpacity="0.16" stroke={p.secondary} strokeWidth="1.5" />
            <circle cx="316" cy="82" r="13" fill={p.primary} fillOpacity="0.18" stroke={p.primary} strokeWidth="1.5" />
            <rect x="44" y="48" width="160" height="70" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M66 74 H172 M66 94 H140" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {urgent && (
          <rect x="0" y="0" width="400" height="3" fill="#F43F5E" />
        )}
      </svg>
    </div>
  );
};
