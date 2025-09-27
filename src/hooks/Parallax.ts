import { useState, useEffect } from 'react';

export const useParallax = (speed: number = 0.5, direction: 'left' | 'right' = 'right') => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const translateX = direction === 'right' ? -scrollY * speed : scrollY * speed;

  return {
    transform: `translateX(${translateX}px)`,
  };
};
