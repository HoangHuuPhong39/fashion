'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string | undefined | null;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = '/images/placeholder-fashion.svg',
  alt = 'TADA! Fashion',
  className = '',
  containerClassName = '',
  fill,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  loading = 'lazy',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      setIsLoaded(true);
    }
  };

  return (
    <>
      {!isLoaded && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-[#F4F1EA] animate-pulse pointer-events-none -z-0 ${containerClassName}`}
        />
      )}
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        fill={fill}
        sizes={sizes}
        loading={props.priority ? undefined : loading}
        onError={handleError}
        onLoad={() => setIsLoaded(true)}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-85'}`}
      />
    </>
  );
};
