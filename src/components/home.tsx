import React, { useEffect, useState, useRef, useCallback } from "react";
import { MapPin, Users, Calendar, ChevronLeft, ChevronRight, Menu, X, Sun, Moon, User, ChevronDown, Clock, Mail } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

const Logo: React.FC = () => {
  return (
    <a href="/" className="flex items-center space-x-2 group">
      <img
        src="/images/logo/logo.png"
        alt="Logo"
        className="h-10 w-10 transition-transform duration-700 group-hover:animate-spin-vertical"
      />
      <span className="text-xl font-bold text-white">PHILTECH</span>
    </a>
  );
};

const NavLinks: React.FC = () => {
  const [showPrograms, setShowPrograms] = useState<boolean>(false);
  const [showCollege, setShowCollege] = useState<boolean>(false);

  const handleProgramsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPrograms((prev) => !prev);
    setShowCollege(false);
  };

  const handleCollegeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowCollege((prev) => !prev);
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center w-full">
      {[
        { href: "/", title: "Home" },
        { href: "/about", title: "About" },
        { href: "/faculties", title: "Faculties" },
        { href: "/events", title: "Events" },
        { href: "/enrollment-process", title: "Enrollment Process" },
        { href: "/contacts", title: "Contacts" },
        { href: "/developer", title: "Developer" },
      ].map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="relative px-2 py-2 md:px-0 md:py-0 w-full md:w-auto transition-colors text-white dark:text-gray-300 hover:text-[goldenrod] group"
        >
          {link.title}
          <span
            className="pointer-events-none absolute left-0 -bottom-0.5 w-full h-0.5 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-200"
            style={{
              background: 'goldenrod',
              borderRadius: '1px',
              display: 'block',
            }}
          />
        </a>
      ))}
      <div className="relative w-full md:w-auto">
        <button
          onClick={handleProgramsClick}
          className="text-white dark:text-gray-300 hover:text-[goldenrod] focus:outline-none flex items-center gap-1 px-2 py-2 md:px-0 md:py-0 w-full md:w-auto transition-colors"
        >
          Programs
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {showPrograms && (
          <div className="md:absolute left-0 md:left-1/2 md:-translate-x-1/2 mt-2 w-full md:w-48 bg-white dark:bg-black shadow-lg rounded z-20 text-gray-900 dark:text-white">
            <button
              onClick={handleCollegeClick}
              className="flex items-center justify-between w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span>College</span>
              <svg className={`w-4 h-4 ml-2 transition-transform ${showCollege ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showCollege && (
              <div className="ml-0 md:ml-6 mt-1 bg-gray-50 dark:bg-gray-900 rounded shadow-inner">
                <a
                  href="/programs/college/regular"
                  className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  Regular
                </a>
                <a
                  href="/programs/college/sunday"
                  className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  Sunday
                </a>
              </div>
            )}
            <a
              href="/programs/senior"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
            >
              Senior High
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        // Show navbar when scrolling up or at the top
        if (currentScrollY < lastScrollY || currentScrollY < 100) {
          setIsVisible(true);
        } 
        // Hide navbar when scrolling down
        else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        }

        setLastScrollY(currentScrollY);
      }
    };

    // Throttle the scroll event for better performance
    let ticking = false;
    const throttledControlNavbar = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          controlNavbar();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledControlNavbar, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledControlNavbar);
    };
  }, [lastScrollY]);

  return (
    <header
      ref={navbarRef}
      className={`
        fixed top-0 left-0 right-0 z-50 text-gray-800 dark:text-white shadow-md transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        ${!isDarkMode ? 'bg-[#7b1112]' : 'bg-black'}
      `}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />

        <div className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="transition-colors group"
            aria-label="Toggle dark mode"
          >
            {isDarkMode
              ? <Sun size={20} className="text-white group-hover:text-[goldenrod]" />
              : <Moon size={20} className="text-white group-hover:text-[goldenrod]" />}
          </button>
          <a
            href="/login"
            className="transition-colors group"
            aria-label="Login"
          >
            <User size={20} className="text-white group-hover:text-[goldenrod]" />
          </a>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="transition-colors group"
              aria-label="Toggle menu"
            >
              {isMenuOpen
                ? <X size={24} className="text-white group-hover:text-[goldenrod]" />
                : <Menu size={24} className="text-white group-hover:text-[goldenrod]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={
          `md:hidden ` +
          (!isDarkMode
            ? 'bg-[#7b1112]'
            : 'bg-[#BC1F27]')
        }>
          <div className="px-4 pt-2 pb-4 space-y-2">
            <NavLinks />
          </div>
        </div>
      )}
    </header>
  );
};

interface DropdownItem {
  title: string;
  href?: string;
  submenu?: DropdownItem[];
}

interface DropdownProps {
  title: string;
  items: DropdownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ title, items }) => {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 focus:outline-none">
        <span>{title}</span>
        <ChevronDown size={16} />
      </button>
      <div className="absolute left-0 mt-2 w-48 bg-gray-700 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {items.map((item: DropdownItem, index: number) => (
          <div key={index}>
            {item.submenu ? (
              <div className="relative group">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-600 flex justify-between items-center">
                  <span>{item.title}</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute left-full top-0 mt-0 w-48 bg-gray-600 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.submenu.map((subItem: DropdownItem, subIndex: number) => (
                    <a
                      key={subIndex}
                      href={subItem.href}
                      className="block px-4 py-2 hover:bg-gray-500"
                    >
                      {subItem.title}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                href={item.href}
                className="block px-4 py-2 hover:bg-gray-600"
              >
                {item.title}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Carousel: React.FC = () => {
  const slides = [
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

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

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

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        handleSlideChange('next');
      } else {
        handleSlideChange('prev');
      }
    }

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
                  onClick={(_e) => { if (!isTransitioning) setCurrent(index); }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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

const HistorySection: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-red-950/20 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-gradient-to-r from-red-400 to-yellow-400 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-red-400 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#7b1112] via-[#BC1F27] to-[#FFB302] bg-clip-text text-transparent animate-fade-in-up">
            Philtech History
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#7b1112] to-[#FFB302] mx-auto rounded-full shadow-lg"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
            Discover the inspiring journey of Philippine Technological Institute of Science Arts and Trade Inc.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="relative max-w-2xl w-full">
            {!open && (
              <div className="relative">
                <button
                  className="envelope-container group w-full h-64 sm:h-72 md:h-80 bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 dark:from-gray-800 dark:via-red-900/30 dark:to-gray-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-700 hover:scale-105 hover:shadow-3xl border-4 border-gradient-to-r from-[#FFB302] to-[#BC1F27] relative overflow-hidden"
                  onClick={() => setOpen(true)}
                  aria-label="Open history envelope"
                >
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-8 h-8 border-2 border-[#FFB302] rounded rotate-45 animate-spin-slow"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-[#BC1F27] rounded-full animate-bounce"></div>
                    <div className="absolute top-1/2 right-8 w-4 h-4 bg-[#FFB302] rounded-full animate-pulse"></div>
                  </div>

                  <div className="relative z-10 text-center">
                    <div className="mb-6 relative">
                      <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-700 rounded-full shadow-xl flex items-center justify-center mb-4 group-hover:animate-bounce">
                        <img
                          src="/images/logo/logo.png"
                          alt="Philtech Logo"
                          className="w-16 h-16 transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#FFB302] to-[#BC1F27] rounded-full animate-ping"></div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-[#BC1F27] dark:text-[#FFB302] mb-2 group-hover:text-[#7b1112] dark:group-hover:text-yellow-400 transition-colors">
                      Discover Our Story
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-300 mb-4 px-4">
                      Click to unfold the remarkable journey of Philtech
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="animate-pulse">📜</span>
                      <span>History & Heritage</span>
                      <span className="animate-pulse">📜</span>
                    </div>
                  </div>

                  <div
                    className="envelope-flap absolute -top-1 left-1/2 -translate-x-1/2 w-40 h-20 bg-gradient-to-b from-[#FFB302] to-[#BC1F27] shadow-lg transition-all duration-500 group-hover:shadow-xl"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/30 rounded-full"></div>
                  </div>
                </button>
              </div>
            )}

            {open && (
              <div className="envelope-open bg-white dark:bg-gray-800 rounded-3xl shadow-3xl transition-all duration-1000 animate-scale-in-up relative border-4 border-gradient-to-r from-[#FFB302] to-[#BC1F27] overflow-hidden max-h-[80vh]">
                <div className="sticky top-0 bg-gradient-to-r from-[#7b1112] to-[#BC1F27] text-white p-6 z-20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <img src="/images/logo/logo.png" alt="Philtech Logo" className="w-8 h-8" />
                        Philippine Technological Institute
                      </h3>
                      <p className="text-amber-200 text-sm mt-1">Est. 2010 - Science, Arts & Trade</p>
                    </div>
                    <button
                      className="text-white text-xl cursor-pointer transition-colors hover:text-amber-200"
                      onClick={() => setOpen(false)}
                      aria-label="Close history envelope"
                    >
                      &times;
                    </button>
                  </div>
                </div>

                <div className="p-8 overflow-y-auto max-h-96">
                  <div className="absolute left-8 top-20 bottom-8 w-1 bg-gradient-to-b from-[#FFB302] to-[#BC1F27] opacity-20 hidden lg:block"></div>

                  <div className="relative">
                    <div className="space-y-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 bg-gradient-to-r from-[#FFB302] to-[#BC1F27] rounded-full flex-shrink-0 shadow-lg"></div>
                        <div>
                          <h4 className="font-bold text-[#BC1F27] dark:text-[#FFB302]">2010 - Foundation</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Established by 11 visionary founders</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 bg-gradient-to-r from-[#FFB302] to-[#BC1F27] rounded-full flex-shrink-0 shadow-lg"></div>
                        <div>
                          <h4 className="font-bold text-[#BC1F27] dark:text-[#FFB302]">2011 - First Programs</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">IT, Hotel Services & Business Management</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 bg-gradient-to-r from-[#FFB302] to-[#BC1F27] rounded-full flex-shrink-0 shadow-lg"></div>
                        <div>
                          <h4 className="font-bold text-[#BC1F27] dark:text-[#FFB302]">2013 - Expansion</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Santa Rosa & GMA branches opened</p>
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-justify mb-6 indent-8">
                        Philippine Technological Institute of Science Arts and Trade Inc., founded in 2010 as a non-stock non-profit non-sectarian private Educational Institution to blaze the trail in the field of technical education. Its eleven founders were a mixture of engineers, a scientist/inventor and practitioner in the IT industry, school administrators, managers and academic professionals in both public and private institutions.
                      </p>

                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-justify mb-6 indent-8">
                        The first school was established in November of 2010 and is presently located at F.T. Catapusan St. in Tanay, Rizal. In June 2011, Philippine Technological Institute opened and offered two-year programs in Information Technology, Hotel and Restaurant Services, and Business Outsourcing Management.
                      </p>

                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-justify mb-6 indent-8">
                        By November of 2012, negotiations for additional branches went underway. The Board of Trustees resolved that two new PHILTECH branches should be established in Sta. Rosa, Laguna and General Mariano Alvarez, Cavite, both opening in the first semester of school year 2013-2014.
                      </p>

                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-justify mb-6 indent-8">
                        By 2021, the GMA branch offered its first bachelor's program: Bachelor in Technical Vocational Teacher Education Major in Food and Beverage Management. The institution continued to grow, adding Bachelor of Science in Computer Science and Bachelor of Science in Office Administration by school year 2022-2023.
                      </p>

                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-red-900/20 p-6 rounded-2xl mt-8 border-l-4 border-[#FFB302]">
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-center italic font-medium">
                          "To date, the institution has been giving its best in proving its objective to provide <span className="text-[#BC1F27] dark:text-[#FFB302] font-bold">global success through academic excellence</span> with admiration for knowledge and appreciation for skills."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in-up {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animate-scale-in-up {
          animation: scale-in-up 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
        .prose {
          max-width: none;
        }
      `}</style>
    </section>
  );
};

const CampusSection: React.FC = () => {
  const campuses = [
    {
      id: 1,
      name: "PHILTECH GMA",
      location: "General Mariano Alvarez, Cavite",
      image: "/images/campuses/gma-campus.jpg",
      established: "2013",
      students: "250+",
      programs: ["BTVTED-FBM", "BSCS", "BSOA", "Senior High"],
      description: "Our flagship GMA campus offers comprehensive bachelor's programs and technical education in a modern facility.",
      highlights: ["First to offer bachelor's programs", "Modern computer laboratories", "Industry partnerships"],
      coordinates: { lat: 14.2978, lng: 120.9958 }
    },
    {
      id: 2,
      name: "PHILTECH SANTA ROSA",
      location: "Santa Rosa, Laguna",
      image: "/images/campuses/santa-rosa-campus.jpg",
      established: "2013",
      students: "350+",
      programs: ["Information Technology", "Hotel & Restaurant Services", "Business Management"],
      description: "Located in the heart of Laguna's business district, providing quality technical education and skills training.",
      highlights: ["Strategic business location", "Industry connections", "Modern facilities"],
      coordinates: { lat: 14.3124, lng: 121.1114 }
    },
    {
      id: 3,
      name: "PHILTECH TANAY",
      location: "Tanay, Rizal",
      image: "/images/campuses/tanay-campus.jpg",
      established: "2010",
      students: "560+",
      programs: ["Technical Vocational Training", "Information Technology", "Business Programs"],
      description: "Our founding campus in Tanay, Rizal, where the Philtech legacy began. The largest campus serving the local community.",
      highlights: ["Original founding campus", "Largest student population", "Community-focused programs"],
      coordinates: { lat: 14.5979, lng: 121.3547 }
    }
  ];

  const [current, setCurrent] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        if (!isTransitioning) {
          setCurrent((prev) => (prev + 1) % campuses.length);
        }
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, isTransitioning, campuses.length]);

  const handleSlideChange = useCallback((direction: string) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    if (direction === 'next') {
      setCurrent((prev) => (prev + 1) % campuses.length);
    } else {
      setCurrent((prev) => (prev - 1 + campuses.length) % campuses.length);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, campuses.length]);

  const goToSlide = (index: number) => {
    if (index !== current && !isTransitioning) {
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };

  const currentCampus = campuses[current];

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-red-950/20 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-32 h-32 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-red-700 via-red-800 to-yellow-600 bg-clip-text text-transparent animate-fade-in-up">
            Our Campuses
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-red-700 to-yellow-500 mx-auto rounded-full shadow-lg"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
            Discover our three strategic locations across Luzon, each serving their communities with excellence
          </p>
        </div>

        <div
          className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-3xl overflow-hidden border border-gray-200 dark:border-gray-700"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative h-[600px] lg:h-[500px]">
            <div className="absolute inset-0">
              {campuses.map((campus, index) => (
                <div
                  key={campus.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === current ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={campus.image}
                    alt={campus.name}
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/800/600?random=${campus.id}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50"></div>
                </div>
              ))}
            </div>

            <div className="absolute inset-0 flex flex-col lg:flex-row">
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center text-white">
                <div className="max-w-2xl">
                  <h3 className="text-3xl lg:text-5xl font-bold mb-4 animate-fade-in-up">
                    {currentCampus.name}
                  </h3>

                  <div className="flex items-center mb-6 text-yellow-200 animate-fade-in-up delay-100">
                    <MapPin size={20} className="mr-2" />
                    <span className="text-lg">{currentCampus.location}</span>
                  </div>

                  <p className="text-lg leading-relaxed mb-8 text-amber-100 animate-fade-in-up delay-200">
                    {currentCampus.description}
                  </p>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="animate-fade-in-up delay-300">
                      <div className="flex items-center mb-2">
                        <Calendar size={18} className="mr-2 text-yellow-300" />
                        <span className="text-sm text-yellow-200">Established</span>
                      </div>
                      <div className="text-2xl font-bold">{currentCampus.established}</div>
                    </div>
                    <div className="animate-fade-in-up delay-400">
                      <div className="flex items-center mb-2">
                        <Users size={18} className="mr-2 text-yellow-300" />
                        <span className="text-sm text-yellow-200">Students</span>
                      </div>
                      <div className="text-2xl font-bold">{currentCampus.students}</div>
                    </div>
                  </div>

                  <div className="animate-fade-in-up delay-500">
                    <h4 className="text-lg font-semibold mb-3 text-yellow-200">Programs Offered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentCampus.programs.map((program, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm border border-white/30"
                        >
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 z-20"
              onClick={() => handleSlideChange('prev')}
              aria-label="Previous campus"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 z-20"
              onClick={() => handleSlideChange('next')}
              aria-label="Next campus"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-6">
            <div className="flex justify-center items-center space-x-4">
              {campuses.map((campus, index) => (
                <button
                  key={campus.id}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? 'bg-gradient-to-r from-red-700 to-yellow-500 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-500 hover:text-red-700'
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to ${campus.name}`}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    index === current ? 'bg-white' : 'bg-current'
                  }`} />
                  <span className="font-medium hidden sm:block">{campus.name.split(' ')[1]}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-red-700 to-yellow-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((current + 1) / campuses.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-[#7b1112] to-[#FFB302] hover:from-[#BC1F27] hover:to-[#FFD700] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Explore All Campuses
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in-up {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animate-scale-in-up {
          animation: scale-in-up 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </section>
  );
};

const OngoingEventsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const events = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      category: "academic",
      date: "2024-03-15",
      time: "9:00 AM - 4:00 PM",
      location: "PHILTECH GMA Auditorium",
      image: "/images/events/3.jpg",
      description: "Annual technology conference featuring industry experts, workshops, and innovation showcases.",
      status: "ongoing",
      attendees: 150,
      maxAttendees: 200,
      tags: ["Technology", "Workshop", "Networking"],
      organizer: "Computer Science Department",
      requirements: ["Student ID", "Registration"],
      contact: "techsummit@philtech.edu"
    },
    {
      id: 2,
      title: "Cultural Festival Week",
      category: "cultural",
      date: "2024-03-10",
      time: "10:00 AM - 8:00 PM",
      location: "PHILTECH GMA Grounds",
      image: "/images/events/1.jpg",
      description: "Celebrate diversity with cultural performances, food fairs, and traditional arts exhibition.",
      status: "ongoing",
      attendees: 300,
      maxAttendees: 500,
      tags: ["Culture", "Food", "Performance"],
      organizer: "Student Affairs Office",
      requirements: ["Open to all"],
      contact: "culture@philtech.edu"
    },
    {
      id: 3,
      title: "Career Fair 2024",
      category: "career",
      date: "2024-03-20",
      time: "8:00 AM - 5:00 PM",
      location: "PHILTECH GMA Gymnasium",
      image: "/images/events/2.jpg",
      description: "Connect with top employers and explore internship and job opportunities.",
      status: "upcoming",
      attendees: 0,
      maxAttendees: 400,
      tags: ["Employment", "Networking", "Career"],
      organizer: "Career Development Center",
      requirements: ["Resume", "Business Attire"],
      contact: "career@philtech.edu"
    }
  ];

  const categories = [
    { id: 'all', name: ' ' },
  ];

  const filteredEvents = events.filter(event => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'ongoing') return event.status === 'ongoing';
    if (activeCategory === 'upcoming') return event.status === 'upcoming';
    return event.category === activeCategory;
  });

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      academic: 'from-purple-500 to-blue-500',
      cultural: 'from-orange-500 to-red-500',
      sports: 'from-green-500 to-teal-500',
      career: 'from-indigo-500 to-purple-500',
      social: 'from-pink-500 to-rose-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-red-50 via-amber-50 to-red-50 dark:from-gray-900 dark:via-red-950/20 dark:to-amber-950/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#7b1112] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FFB302] rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#BC1F27] rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-red-700 via-red-800 to-yellow-600 bg-clip-text text-transparent animate-fade-in-up">
            Ongoing Events
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#7b1112] to-[#FFB302] mx-auto rounded-full shadow-lg"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest events, activities, and opportunities at PHILTECH GMA
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={` ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-[#7b1112] to-[#FFB302] text-white shadow-lg'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 shadow-md'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/400/300?random=${event.id}`;
                  }}
                />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(event.status)}
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getCategoryColor(event.category)}`}>
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar size={16} className="mr-2 text-blue-500" />
                    <span className="text-sm">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock size={16} className="mr-2 text-green-500" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin size={16} className="mr-2 text-red-500" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {event.attendees}/{event.maxAttendees}
                    </span>
                  </div>
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                  {event.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                      +{event.tags.length - 2}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleEventClick(event)}
                  className="w-full bg-gradient-to-r from-[#7b1112] to-[#FFB302] hover:from-[#BC1F27] hover:to-[#FFD700] text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Calendar size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No events found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no events matching your selected category.
            </p>
          </div>
        )}

        <div className="text-center">
          <button className="bg-gradient-to-r from-[#7b1112] to-[#FFB302] hover:from-[#BC1F27] hover:to-[#FFD700] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            View All Events Calendar
          </button>
        </div>
      </div>

      {/* Event Detail Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in-up">
            <div className="relative">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/800/400?random=${selectedEvent.id}`;
                }}
              />
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200"
                aria-label="Close event details"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {selectedEvent.title}
                </h3>
                {getStatusBadge(selectedEvent.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-semibold">{selectedEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-red-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold">{selectedEvent.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Attendees</p>
                      <p className="font-semibold">{selectedEvent.attendees}/{selectedEvent.maxAttendees}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Organizer</p>
                      <p className="font-semibold">{selectedEvent.organizer}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-semibold">{selectedEvent.contact}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Description</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Requirements</h4>
                <ul className="space-y-2">
                  {selectedEvent.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedEvent.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300">
                  Register Now
                </button>
                <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in-up {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in-up {
          animation: scale-in-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </section>
  );
};

const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const testimonials = [
    {
      id: 1,
      name: "Maria Santos",
      role: "BSCS Graduate, Class of 2023",
      image: "/images/testimonials/student1.jpg",
      text: "PHILTECH GMA provided me with the perfect balance of theoretical knowledge and practical skills. The supportive faculty and modern facilities helped me secure a job even before graduation!",
      rating: 5,
      program: "Computer Science",
      campus: "GMA Campus"
    },
    {
      id: 2,
      name: "John Michael Reyes",
      role: "BTVTED-FBM Student",
      image: "/images/testimonials/student2.jpg",
      text: "The hands-on approach to learning at PHILTECH is exceptional. The industry partnerships and real-world projects have prepared me well for my future career in food and beverage management.",
      rating: 5,
      program: "Technical Vocational Education",
      campus: "GMA Campus"
    },
    {
      id: 3,
      name: "Dr. Roberto Dela Cruz",
      role: "Faculty Member, IT Department",
      image: "/images/testimonials/faculty1.jpg",
      text: "Teaching at PHILTECH has been incredibly rewarding. The institution's commitment to academic excellence and student success creates an environment where both students and faculty can thrive.",
      rating: 5,
      program: "Information Technology",
      campus: "All Campuses"
    },
    {
      id: 4,
      name: "Andrea Lopez",
      role: "Alumni, Business Management",
      image: "/images/testimonials/alumni1.jpg",
      text: "My PHILTECH education was the foundation of my successful career. The practical skills and industry connections I gained have been invaluable in my professional journey.",
      rating: 5,
      program: "Business Management",
      campus: "Santa Rosa Campus"
    },
    {
      id: 5,
      name: "Mark Johnson Tan",
      role: "Senior High School Student",
      image: "/images/testimonials/student3.jpg",
      text: "The Senior High program at PHILTECH has amazing facilities and teachers who genuinely care about our future. I feel well-prepared for college and beyond.",
      rating: 5,
      program: "Senior High School",
      campus: "GMA Campus"
    }
  ];

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToTestimonial = (index: number) => {
    if (isTransitioning || index === currentTestimonial) return;
    setIsTransitioning(true);
    setCurrentTestimonial(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const currentTestimony = testimonials[currentTestimonial];

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-amber-50 via-red-50 to-amber-50 dark:from-gray-900 dark:via-red-950/20 dark:to-amber-950/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#BC1F27] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FFB302] rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#7b1112] rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#7b1112] via-[#BC1F27] to-[#FFB302] bg-clip-text text-transparent animate-fade-in-up">
            What They Say
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#7b1112] to-[#FFB302] mx-auto rounded-full shadow-lg"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
            Hear from our students, alumni, and faculty about their PHILTECH experience
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden border border-amber-200 dark:border-amber-800">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFB302]/10 to-[#BC1F27]/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#7b1112]/10 to-[#FFB302]/10 rounded-full translate-y-20 -translate-x-20"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-r from-[#FFB302] to-[#BC1F27] rounded-full p-1 animate-scale-in-up">
                    <img
                      src={currentTestimony.image}
                      alt={currentTestimony.name}
                      className="w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format&q=60`;
                      }}
                    />
                  </div>
                </div>
              </div> 

              {/* Testimonial Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                  {/* Stars Rating */}
                  <div className="flex justify-center lg:justify-start mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < currentTestimony.rating ? 'text-[#FFB302]' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-xl md:text-2xl font-medium text-gray-800 dark:text-white mb-6 leading-relaxed italic">
                    "{currentTestimony.text}"
                  </blockquote>

                  {/* Person Info */}
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-[#7b1112] to-[#BC1F27] bg-clip-text text-transparent">
                      {currentTestimony.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">{currentTestimony.role}</p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <MapPin size={14} className="mr-1 text-[#BC1F27]" />
                        {currentTestimony.campus}
                      </span>
                      <span className="flex items-center">
                        <Users size={14} className="mr-1 text-[#FFB302]" />
                        {currentTestimony.program}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center lg:justify-start space-x-4 mt-8">
                  <button
                    onClick={handlePrev}
                    className="w-12 h-12 bg-gradient-to-r from-[#7b1112] to-[#BC1F27] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-xl"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTestimonial
                            ? 'bg-gradient-to-r from-[#FFB302] to-[#BC1F27] w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-12 h-12 bg-gradient-to-r from-[#FFB302] to-[#BC1F27] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-xl"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in-up {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animate-scale-in-up {
          animation: scale-in-up 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

const EnrollmentCTASection: React.FC = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-[#7b1112] via-[#BC1F27] to-[#FFB302] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-red-300 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content - Enrollment Message */}
          <div className="flex-1 text-white animate-fade-in-up">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
                Your Future Starts{" "}
                <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Here
                </span>
              </h2>
              
              <div className="w-24 h-1 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full mb-8"></div>

              <p className="text-xl mb-8 leading-relaxed text-white/90">
                Join the PHILTECH family and embark on an educational journey that transforms 
                dreams into reality. Our dedicated registrar team is ready to guide you every step of the way.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-300">Expert Faculty</h4>
                    <p className="text-sm text-white/80">Industry professionals</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Calendar className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-300">Flexible Schedule</h4>
                    <p className="text-sm text-white/80">Multiple program options</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <MapPin className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-300">Modern Facilities</h4>
                    <p className="text-sm text-white/80">State-of-the-art labs</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-300">Career Support</h4>
                    <p className="text-sm text-white/80">Job placement assistance</p>
                  </div>
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  className="group bg-white text-[#7b1112] px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-amber-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span>Start Your Enrollment Now</span>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  Schedule a Consultation
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-amber-300">2,000+</div>
                  <div className="text-sm text-white/80">Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-300">50+</div>
                  <div className="text-sm text-white/80">Programs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-300">95%</div>
                  <div className="text-sm text-white/80">Graduation Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Registrar Image */}
          <div className="flex-1 animate-scale-in-up">
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="relative z-10">
                  <img
                    src="/images/registrar/registrar-teacher.jpg"
                    alt="Friendly PHILTECH Registrar Officer"
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl border-4 border-white"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=600&h=600&fit=crop&crop=face&auto=format&q=60`;
                    }}
                  />
                  
                  {/* Floating Info Cards */}
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl border-2 border-amber-300 animate-float">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#FFB302] to-[#BC1F27] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">Ms. Rodriguez</div>
                        <div className="text-sm text-gray-600">Registrar Officer</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-6 -right-6 bg-amber-100 rounded-2xl p-4 shadow-2xl border-2 border-amber-400 animate-float-delayed">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#7b1112]">"</div>
                      <div className="text-sm font-medium text-gray-700">Ready to assist you!</div>
                      <div className="text-xs text-gray-600 mt-1">10+ years experience</div>
                    </div>
                  </div>
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-amber-300/30 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-red-400/30 rounded-full blur-xl"></div>
              </div>

              {/* Contact Information Box */}
              <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
                <h4 className="text-xl font-bold text-[#7b1112] mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-[#BC1F27]" />
                  Quick Contact
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email:</span>
                    <a href="mailto:registrar@philtech.edu" className="text-[#BC1F27] font-medium hover:text-[#7b1112]">
                      registrar@philtech.edu
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <a href="tel:+6321234567" className="text-[#BC1F27] font-medium hover:text-[#7b1112]">
                      (02) 123-4567
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hours:</span>
                    <span className="text-gray-800 font-medium">8:00 AM - 5:00 PM</span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-gradient-to-r from-[#7b1112] to-[#BC1F27] text-white py-3 rounded-lg font-semibold hover:from-[#BC1F27] hover:to-[#FFB302] transition-all duration-300">
                  Request Callback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in-up {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animate-scale-in-up {
          animation: scale-in-up 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-[#4b0d0e] to-[#3a0a0b] relative mt-16 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"></div>

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-red-400 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-yellow-400 blur-xl"></div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <div className="lg:col-span-1">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Philtech GMA</h2>
          </div>
          <p className="text-gray-300 mb-6 max-w-xs">
            Innovating technology solutions for a better tomorrow. We provide cutting-edge services to help your business grow.
          </p>

          <div className="flex gap-4">
            {[
              {
                href: "https://facebook.com",
                label: "Facebook",
                svg: (
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                ),
                color: "hover:bg-blue-600",
              },
              {
                href: "https://twitter.com",
                label: "Twitter (X)",
                svg: (
                  <path d="M17.53 2.477h3.934l-8.59 9.81 10.13 13.236h-7.97l-6.24-8.19-7.14 8.19H0l9.18-10.48L0 2.477h8.09l5.7 7.49zm-1.36 17.04h2.18L6.62 4.41H4.3l11.87 15.107z" />
                ),
                color: "hover:bg-black",
              },
              {
                href: "https://instagram.com",
                label: "Instagram",
                svg: (
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                ),
                color: "hover:bg-gradient-to-r from-purple-500 to-pink-500",
              },
              {
                href: "https://linkedin.com",
                label: "LinkedIn",
                svg: (
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                ),
                color: "hover:bg-blue-700",
              },
            ].map((icon, i) => (
              <a
                key={i}
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-200 hover:text-white transition-all duration-300 transform hover:scale-110 bg-white/10 rounded-full p-2 ${icon.color}`}
                aria-label={icon.label}
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  {icon.svg}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            {[
              { href: "/about", label: "About Us" },
              { href: "/services", label: "Our Services" },
              { href: "/projects", label: "Projects" },
              { href: "/team", label: "Our Team" },
              { href: "/careers", label: "Careers" },
            ].map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:bg-yellow-500 transition-colors"></span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Our Services</h3>
          <ul className="space-y-3">
            {[
              { href: "/web-development", label: "Web Development" },
              { href: "/mobile-apps", label: "Mobile Applications" },
              { href: "/cloud-solutions", label: "Cloud Solutions" },
              { href: "/it-consulting", label: "IT Consulting" },
              { href: "/digital-transformation", label: "Digital Transformation" },
            ].map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 group-hover:bg-red-500 transition-colors"></span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <div>
                <p className="text-gray-300">Email us at</p>
                <a href="mailto:info@philtechgma.com" className="text-white hover:text-yellow-400 transition-colors">info@philtechgma.com</a>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <div>
                <p className="text-gray-300">Call us</p>
                <a href="tel:+1234567890" className="text-white hover:text-yellow-400 transition-colors">+1 (234) 567-890</a>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div>
                <p className="text-gray-300">Visit us</p>
                <p className="text-white">123 Tech Street, Manila, Philippines</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-2">Stay Updated</h4>
            <p className="text-gray-300 text-sm mb-3">Subscribe to our newsletter for the latest updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-3 py-2 bg-white/10 border border-white/20 rounded-l text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
              <button className="bg-gradient-to-r from-red-500 to-yellow-500 text-white px-4 py-2 rounded-r font-medium hover:opacity-90 transition-opacity">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-8 pt-6 pb-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-200">Philtech GMA</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export {
  Logo,
  NavLinks,
  Navbar,
  Dropdown,
  Carousel,
  HistorySection,
  CampusSection,
  OngoingEventsSection,
  TestimonialsSection,
  EnrollmentCTASection,
  Footer
};
