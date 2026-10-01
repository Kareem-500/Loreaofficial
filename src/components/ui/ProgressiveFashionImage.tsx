import React, { useState, useEffect, useRef } from 'react';

interface ProgressiveFashionImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
  priority?: boolean;
  hoverZoom?: boolean;
  onClick?: () => void;
}

export const ProgressiveFashionImage: React.FC<ProgressiveFashionImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatioClass = 'aspect-[3/4]',
  priority = false,
  hoverZoom = true,
  onClick
}) => {
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pre-load before viewport with generous rootMargin
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '450px 0px', // start loading well before viewport arrival
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative overflow-hidden bg-[#EFECE6] ${aspectRatioClass} ${className}`}
    >
      {/* Editorial shimmer placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#EFECE6] via-[#F7F4EF] to-[#EFECE6] animate-pulse pointer-events-none" />
      )}

      {/* Actual Image with Blur-to-Sharp Progressive Reveal */}
      {isIntersecting && !hasError && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out will-change-transform ${
            isLoaded
              ? 'opacity-100 blur-0 scale-100'
              : 'opacity-0 blur-md scale-104'
          } ${
            hoverZoom && isLoaded ? 'group-hover:scale-105' : ''
          }`}
        />
      )}

      {/* Fallback image if error */}
      {hasError && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#F7F4EF] p-4 text-center">
          <span className="font-serif text-xs text-[#7C746B] uppercase tracking-widest">
            LORÉA SILHOUETTE
          </span>
        </div>
      )}
    </div>
  );
};
