import React, { useEffect, useState, useRef, useCallback } from "react";

interface Slide {
  img: string;
}

const Carousel: React.FC = () => {
  const slides: Slide[] = [
    { img: "/images/carousel-backgrounds/3.jpg" },
    { img: "/images/carousel-backgrounds/1.jpg" },
    { img: "/images/carousel-backgrounds/2.jpg" },
  ];

  const [current, setCurrent] = useState<number>(0);
  const [typewriterText, setTypewriterText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [typeIndex, setTypeIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [showDots, setShowDots] = useState<boolean>(true);

  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Hide dots when carousel is not in view (e.g., scrolled past navbar)
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setShowDots(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }
    return () => {
      if (carouselRef.current) observer.unobserve(carouselRef.current);
    };
  }, []);

  // Carousel slide effect
  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        if (!isDragging.current && !isTransitioning) {
          setCurrent((prev: number) => (prev + 1) % slides.length);
        }
      }, 5000);
    };

    startInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTransitioning]);

  // Typewriter effect for subtitle
  useEffect(() => {
    const text = "Global Success Through Academic Excellence";
    let timeout: NodeJS.Timeout;
    if (!isDeleting && typeIndex < text.length) {
      timeout = setTimeout(() => {
        setTypewriterText((prev: string) => prev + text.charAt(typeIndex));
        setTypeIndex(typeIndex + 1);
      }, 100);
    } else if (!isDeleting && typeIndex === text.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && typeIndex > 0) {
      timeout = setTimeout(() => {
        setTypewriterText(text.substring(0, typeIndex - 1));
        setTypeIndex(typeIndex - 1);
      }, 50);
    } else if (isDeleting && typeIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [typeIndex, isDeleting]);

  const handleSlideChange = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    if (direction === 'next') {
      setCurrent((prev: number) => (prev + 1) % slides.length);
    } else {
      setCurrent((prev: number) => (prev - 1 + slides.length) % slides.length);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;

    // Pause auto-slide during touch
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    // Prevent default scrolling behavior during horizontal swipes
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const deltaX = Math.abs(touchCurrentX - touchStartX.current);
    const deltaY = Math.abs(touchCurrentY - touchStartY.current);

    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = Math.abs(touchStartY.current - touchEndY);

    isDragging.current = false;

    // Only trigger slide change if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        handleSlideChange('next');
      } else {
        handleSlideChange('prev');
      }
    }

    // Resume auto-slide
    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (!isDragging.current && !isTransitioning) {
          setCurrent((prev: number) => (prev + 1) % slides.length);
        }
      }, 5000);
    }, 1000);
  }, [handleSlideChange, isTransitioning]);

  return (
    <>
      <div ref={carouselRef} className="w-full min-h-screen h-[100dvh] max-h-[100dvh] rounded-none overflow-hidden shadow-2xl bg-white dark:bg-gray-900 relative">
        <div className="relative w-full h-full flex items-center justify-center">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide.img}
              alt={`Slide ${index + 1}`}
              className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-500 ease-in-out select-none ${
                index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              draggable="false"
              style={{
                pointerEvents: 'none',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            />
          ))}

          {/* Responsive overlay backgrounds */}
          <div className="absolute inset-0 bg-black/70 pointer-events-none z-20" />

          <div className="absolute bottom-0 left-0 right-0 px-1 xs:px-2 sm:px-4 pb-4 xs:pb-6 sm:pb-12 flex flex-col items-center justify-center text-center w-full h-full z-30">
            <div className="flex flex-col items-center justify-center w-full animate-fade-in-up mt-2 xs:mt-4 sm:mt-8">
              <span className="text-xs xs:text-base sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg tracking-widest mb-1 sm:mb-2">WELCOME TO</span>
              <span className="text-lg xs:text-2xl sm:text-5xl md:text-6xl font-extrabold text-center w-full bg-gradient-to-r from-[#FFB302] via-[#BC1F27] to-[#781112] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] tracking-widest">PHILTECH GMA</span>
              <span className="mt-1 xs:mt-2 sm:mt-4 text-xs xs:text-base sm:text-2xl md:text-3xl font-bold italic text-[#FFB302] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] font-[cursive] whitespace-nowrap overflow-hidden" style={{paddingRight: '5px'}}>
                {typewriterText}
                <span className="inline-block w-[3px] h-[1.5em] bg-[#FFB302] align-middle animate-blink ml-1"></span>
              </span>
            </div>
          </div>

          {/* Touch/Swipe handler overlay */}
          <div
            className="absolute inset-0 z-40 touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              touchAction: 'pan-y',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          />

          {/* Slide indicators */}
          {showDots && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-50">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? 'bg-[#FFB302] w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  onClick={() => !isTransitioning && setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </>
  );
};

export default Carousel;
