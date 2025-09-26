import React, { useEffect, useState, useRef, useCallback } from "react";
import { MapPin, Users, Calendar, ChevronLeft, ChevronRight, Menu, X, Sun, Moon, User, ChevronDown } from "lucide-react";
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={
        `sticky top-0 z-50 text-gray-800 dark:text-white shadow-md ` +
        (!isDarkMode
          ? 'bg-[#7b1112]'
          : 'bg-black')
      }
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
                      className="bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 group"
                      onClick={() => setOpen(false)}
                      aria-label="Close history envelope"
                    >
                      <span className="text-white text-xl group-hover:rotate-90 transition-transform duration-200">&times;</span>
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

              <div className="lg:w-96 p-8 lg:p-12 flex items-center justify-center">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 animate-scale-in-up">
                  <h4 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
                    Campus Highlights
                  </h4>
                  <ul className="space-y-4">
                    {currentCampus.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-3 h-3 bg-gradient-to-r from-red-700 to-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
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
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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
  Footer 
};