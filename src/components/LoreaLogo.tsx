import React from 'react';

export interface LoreaLogoProps {
  variant?: 'light' | 'dark' | 'compact' | 'footer' | 'mark' | 'gold';
  className?: string;
  subtext?: boolean;
  subtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'responsive' | 'auto';
  isScrolled?: boolean;
  useImage?: boolean;
}

export const LoreaLogo: React.FC<LoreaLogoProps> = ({
  variant = 'light',
  className = '',
  subtext = false,
  subtitle = true,
  size = 'responsive',
  isScrolled = false,
  useImage = false
}) => {
  const isDark = variant === 'dark' || variant === 'footer';
  const isGold = variant === 'gold';
  const isMark = variant === 'mark';
  const isCompact = variant === 'compact';

  // Primary colors
  const textColor = isGold
    ? '#BA945A'
    : isDark
    ? '#FDFBF7'
    : '#0F0F0E';

  const goldColor = isDark ? '#D6B47D' : '#BA945A';
  const goldGradStart = isDark ? '#F2DCB3' : '#D6B47D';
  const goldGradEnd = isDark ? '#B8935C' : '#9E7739';

  const uniqueId = React.useId().replace(/:/g, '');
  const gradId = `loreaGold_${uniqueId}`;

  // Responsive width classes preserving 740:260 (2.846:1) aspect ratio strictly:
  // Large desktop (1440px+): 185-195px
  // Desktop (1200px): 165-175px
  // Laptop (1024px): 150-160px
  // Tablet (768px): 135-145px
  // Mobile (480px): 125-135px
  // Small mobile (320px): 108-115px
  const getResponsiveClass = () => {
    if (size === 'sm') return 'w-[110px] sm:w-[125px]';
    if (size === 'md') return 'w-[135px] sm:w-[150px]';
    if (size === 'lg') return 'w-[160px] sm:w-[180px]';
    if (size === 'xl') return 'w-[190px] sm:w-[220px]';

    if (isMark) return 'w-8 h-8 sm:w-9 sm:h-9';
    if (isCompact) return 'w-[115px] sm:w-[130px]';
    if (variant === 'footer') return 'w-[150px] sm:w-[170px] lg:w-[190px]';

    // Standard header responsive sizing with smooth scrolled state scaling
    if (isScrolled) {
      return 'w-[105px] min-[400px]:w-[118px] sm:w-[128px] md:w-[138px] lg:w-[150px] xl:w-[165px] 2xl:w-[178px]';
    }

    return 'w-[110px] min-[400px]:w-[125px] sm:w-[135px] md:w-[145px] lg:w-[160px] xl:w-[178px] 2xl:w-[192px]';
  };

  // Standalone Brand Mark (Iconic 'O' with Woman's Silhouette & Golden Leaf)
  if (isMark) {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <svg
          viewBox="0 0 200 200"
          className={`${getResponsiveClass()} h-auto object-contain transition-transform duration-300 hover:scale-105`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="LORÉA Brand Mark"
        >
          <title>LORÉA</title>
          <defs>
            <linearGradient id={`${gradId}_mark`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={goldGradEnd} />
              <stop offset="50%" stopColor={goldColor} />
              <stop offset="100%" stopColor={goldGradStart} />
            </linearGradient>
          </defs>

          <g transform="translate(-142, -9)">
            {/* O Outer Ring with Didone contrast */}
            <path
              fill={textColor}
              fillRule="evenodd"
              d="M 242,34 C 292,34 330,68 330,109 C 330,150 292,184 242,184 C 192,184 154,150 154,109 C 154,68 192,34 242,34 Z M 242,40 C 204,40 182,70 182,109 C 182,148 204,178 242,178 C 280,178 302,148 302,109 C 302,70 280,40 242,40 Z"
            />

            {/* Flowing Hair Locks in Rich Gold */}
            <path
              fill={`url(#${gradId}_mark)`}
              d="M 216,45 C 204,58 194,78 192,100 C 190,122 194,144 204,162 C 200,154 196,138 196,120 C 196,98 204,74 218,53 Z"
            />
            <path
              fill={`url(#${gradId}_mark)`}
              d="M 232,42 C 224,62 212,88 216,116 C 220,138 214,156 205,170 C 203,164 209,148 208,130 C 206,102 218,72 234,48 Z"
            />
            <path
              fill={`url(#${gradId}_mark)`}
              d="M 244,52 C 236,72 230,98 234,124 C 238,146 230,162 218,174 C 224,163 226,148 224,130 C 222,104 228,76 246,56 Z"
            />

            {/* Woman Face Profile in Gold Stroke */}
            <path
              d="M 244,52 C 248,63 252,73 253,83 C 252,86 250,88 250,90 C 252,94 261,98 263,102 C 263,105 258,107 255,110 C 256,112 260,114 259,117 C 257,119 254,120 254,121 C 256,123 258,125 257,127 C 254,129 252,130 252,132 C 254,135 258,138 257,141 C 254,147 248,152 246,156 C 246,163 252,170 255,175"
              fill="none"
              stroke={`url(#${gradId}_mark)`}
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Neck & Clavicle Curve in Gold */}
            <path
              d="M 236,172 C 242,168 250,170 256,174"
              fill="none"
              stroke={`url(#${gradId}_mark)`}
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Golden Leaf Accent */}
            <path
              fill={`url(#${gradId}_mark)`}
              d="M 238,22 C 242,12 256,4 272,3 C 268,14 254,21 238,22 Z"
            />
          </g>
        </svg>
      </div>
    );
  }

  // If useImage is true, use the static SVG asset
  if (useImage && !isDark && subtitle) {
    return (
      <img
        src="/assets/LOREA fashion.svg"
        alt="LORÉA Women's Fashion"
        className={`${getResponsiveClass()} h-auto max-w-full aspect-[740/260] object-contain transition-all duration-300 ${className}`}
        loading="eager"
      />
    );
  }

  // Full Wordmark with Silhouette and Subtitle "WOMEN'S FASHION"
  return (
    <div
      className={`inline-flex flex-col select-none ${
        className.includes('items-') ? className : `items-center justify-center ${className}`
      }`}
    >
      <div className="flex items-center justify-center w-full">
        <svg
          viewBox={subtitle ? '0 0 740 260' : '0 0 740 196'}
          className={`${getResponsiveClass()} h-auto max-w-full aspect-[740/260] object-contain transition-all duration-300`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="LORÉA"
        >
          <title>LORÉA</title>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={goldGradEnd} />
              <stop offset="50%" stopColor={goldColor} />
              <stop offset="100%" stopColor={goldGradStart} />
            </linearGradient>
          </defs>

          {/* ==================== L ==================== */}
          <g fill={textColor}>
            <path d="M 46,48 L 52,48 C 60,48 64,45 64,38 L 88,38 L 88,154 C 88,172 96,178 116,178 L 136,178 C 146,178 150,171 150,162 C 150,156 146,153 142,153 C 138,153 135,156 135,161 C 135,168 130,172 118,172 L 88,172 C 72,172 64,166 64,150 L 64,48 C 64,45 60,48 46,48 Z" />
          </g>

          {/* ==================== O with Silhouette & Hair ==================== */}
          <g>
            {/* O Outer Ring with Didone contrast */}
            <path
              fill={textColor}
              fillRule="evenodd"
              d="
                M 242,34
                C 292,34 330,68 330,109
                C 330,150 292,184 242,184
                C 192,184 154,150 154,109
                C 154,68 192,34 242,34 Z
                M 242,40
                C 204,40 182,70 182,109
                C 182,148 204,178 242,178
                C 280,178 302,148 302,109
                C 302,70 280,40 242,40 Z
              "
            />

            {/* Flowing Hair Locks in Gold */}
            <path
              fill={`url(#${gradId})`}
              d="
                M 216,45
                C 204,58 194,78 192,100
                C 190,122 194,144 204,162
                C 200,154 196,138 196,120
                C 196,98 204,74 218,53 Z
              "
            />
            <path
              fill={`url(#${gradId})`}
              d="
                M 232,42
                C 224,62 212,88 216,116
                C 220,138 214,156 205,170
                C 203,164 209,148 208,130
                C 206,102 218,72 234,48 Z
              "
            />
            <path
              fill={`url(#${gradId})`}
              d="
                M 244,52
                C 236,72 230,98 234,124
                C 238,146 230,162 218,174
                C 224,163 226,148 224,130
                C 222,104 228,76 246,56 Z
              "
            />

            {/* Woman Face Profile in Gold */}
            <path
              d="
                M 244,52
                C 248,63 252,73 253,83
                C 252,86 250,88 250,90
                C 252,94 261,98 263,102
                C 263,105 258,107 255,110
                C 256,112 260,114 259,117
                C 257,119 254,120 254,121
                C 256,123 258,125 257,127
                C 254,129 252,130 252,132
                C 254,135 258,138 257,141
                C 254,147 248,152 246,156
                C 246,163 252,170 255,175
              "
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Neck & Clavicle in Gold */}
            <path
              d="M 236,172 C 242,168 250,170 256,174"
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* ==================== R ==================== */}
          <g fill={textColor}>
            {/* Left stem & serifs */}
            <path d="M 344,48 L 350,48 C 356,48 358,45 358,38 L 382,38 L 382,172 C 382,176 384,178 392,178 L 398,178 L 398,180 L 344,180 L 344,178 L 350,178 C 356,178 358,175 358,172 L 358,48 C 358,45 356,48 344,48 Z" />
            {/* Upper bowl */}
            <path
              fillRule="evenodd"
              d="
                M 382,38 L 416,38 C 438,38 448,50 448,68 C 448,86 436,98 412,98 L 382,98 Z
                M 382,46 L 382,90 L 410,90 C 424,90 432,82 432,68 C 432,54 424,46 410,46 Z
              "
            />
            {/* Sweeping leg */}
            <path
              d="
                M 396,96
                C 410,98 424,116 434,142
                C 440,158 446,172 454,178
                C 458,180 464,180 470,180
                L 470,178
                C 464,177 460,172 456,164
                C 448,148 438,126 426,108
                C 418,98 408,95 396,96 Z
              "
            />
          </g>

          {/* ==================== É with Golden Leaf Accent ==================== */}
          <g>
            {/* Letter E */}
            <g fill={textColor}>
              <path d="M 474,48 L 480,48 C 486,48 488,45 488,38 L 512,38 L 512,172 C 512,176 514,178 522,178 L 526,178 L 526,180 L 474,180 L 474,178 L 480,178 C 486,178 488,175 488,172 L 488,48 C 488,45 486,48 474,48 Z" />
              <path d="M 512,38 L 564,38 L 564,52 L 558,52 C 556,46 550,44 540,44 L 512,44 Z" />
              <path d="M 512,104 L 544,104 C 548,104 550,102 550,96 L 552,96 L 552,118 L 550,118 C 550,112 548,110 544,110 L 512,110 Z" />
              <path d="M 512,174 L 544,174 C 554,174 560,172 562,164 L 568,164 L 568,180 L 512,180 Z" />
            </g>

            {/* Golden Leaf Accent (L'accent aigu) */}
            <path
              fill={`url(#${gradId})`}
              d="M 506,29 C 511,18 528,9 548,7 C 543,19 526,28 506,29 Z"
            />
          </g>

          {/* ==================== A ==================== */}
          <g fill={textColor}>
            <path
              fillRule="evenodd"
              d="
                M 650,38
                L 664,38
                L 714,172 C 718,174 722,176 728,176 L 728,180 L 684,180 L 684,176 C 690,176 694,174 694,170 L 686,142
                L 624,142
                L 614,170 C 614,174 618,176 624,176 L 624,180 L 588,180 L 588,176 C 594,176 598,174 602,170
                L 648,38 Z
                M 630,126
                L 680,126
                L 656,58 Z
              "
            />
          </g>

          {/* ==================== Subtitle: WOMEN'S FASHION ==================== */}
          {subtitle && (
            <text
              x="370"
              y="238"
              fill={textColor}
              fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="22"
              fontWeight="700"
              letterSpacing="0.38em"
              textAnchor="middle"
            >
              WOMEN&apos;S FASHION
            </text>
          )}
        </svg>
      </div>

      {subtext && (
        <span
          className="text-[9px] sm:text-[10px] uppercase font-sans tracking-[0.36em] mt-1 font-light opacity-80"
          style={{ color: isDark ? '#B7ADA2' : '#7C746B' }}
        >
          ATELIER · CAIRO
        </span>
      )}
    </div>
  );
};
