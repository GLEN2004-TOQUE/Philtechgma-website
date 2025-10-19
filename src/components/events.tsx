import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { X, Sun, Moon, User, ChevronDown} from "lucide-react";
import { useAOS } from "../hooks/useAOS";

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
        { to: "/", title: "Home" },
        { to: "/about", title: "About" },
        { to: "/faculties", title: "Faculties" },
        { to: "/events", title: "Events" },
        { to: "/enrollment-process", title: "Enrollment Process" },
        { to: "/contacts", title: "Contacts" },
        { to: "/developer", title: "Developer" },
      ].map((link) => (
        <Link
          key={link.to}
          to={link.to}
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
        </Link>
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
            <Link
              to="/regular"
              className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
            >
              Regular
            </Link>
            <Link
              to="/sunday"
              className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
            >
              Sunday
            </Link>
              </div>
            )}
            <Link
              to="/seniorhigh"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
            >
              Senior High
            </Link>
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
          <Link
            to="/dblogin/login"
            className="transition-colors group"
            aria-label="Login"
          >
            <User size={20} className="text-white group-hover:text-[goldenrod]" />
          </Link>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="transition-colors group"
              aria-label="Toggle menu"
            >
              {isMenuOpen
                ? <X size={20} className="text-white group-hover:text-[goldenrod]" />
                : <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu text-white group-hover:text-[goldenrod]" aria-hidden="true"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>}
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
import { ChevronLeft, ChevronRight } from "lucide-react";

// Dark Mode Hook
export function useDarkMode(): [boolean, () => void] {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedMode = window.localStorage.getItem("darkMode");
      return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        window.localStorage.setItem("darkMode", JSON.stringify(true));
      } else {
        document.documentElement.classList.remove("dark");
        window.localStorage.setItem("darkMode", JSON.stringify(false));
      }
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode: boolean) => !prevMode);
  };

  return [isDarkMode, toggleDarkMode];
}

// Main Carousel Component
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
  const [isDarkMode] = useDarkMode(); // Kunin ang dark mode state

  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Intersection Observer for dots visibility
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

  // Auto-slide interval
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
  }, [isTransitioning, slides.length]);

  // Typewriter effect
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleSlideChange('prev');
      } else if (e.key === 'ArrowRight') {
        handleSlideChange('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning]);

  // Slide change handler
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
  }, [isTransitioning, slides.length]);

  // Touch handlers
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
  }, [handleSlideChange, isTransitioning, slides.length]);

  // Go to specific slide
  const goToSlide = (index: number) => {
    if (!isTransitioning && index !== current) {
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <>
      <div 
        ref={carouselRef} 
        className="w-full carousel-container relative overflow-hidden bg-gray-900 group"
      >
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background Image Container */}
              <div className="absolute inset-0">
                <img
                  src={slide.img}
                  alt={`Slide ${index + 1}`}
                  className="carousel-image w-full h-full object-cover object-center"
                  draggable="false"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/1920/1080?random=${index}`;
                  }}
                />
              </div>

              {/* Background Overlay - nagbabago base sa dark mode */}
              <div 
                className={`absolute inset-0 pointer-events-none z-20 ${
                  isDarkMode ? 'bg-black/70' : 'bg-[#7b1112]/70'
                }`}
              />

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="text-center px-4 max-w-4xl mx-auto">
                  <div className="flex flex-col items-center justify-center w-full animate-fade-in-up">
                    <span className="text-xs xs:text-base sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg tracking-widest mb-1 sm:mb-2">
                      WELCOME TO
                    </span>
                    <span className="text-lg xs:text-2xl sm:text-5xl md:text-6xl font-extrabold text-center w-full bg-gradient-to-r from-[#FFB302] via-[#BC1F27] to-[#781112] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] tracking-widest">
                      PHILTECH GMA
                    </span>
                    <span className="mt-1 xs:mt-2 sm:mt-4 text-xs xs:text-base sm:text-2xl md:text-3xl font-bold italic text-[#FFB302] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] font-[cursive] whitespace-nowrap overflow-hidden" 
                          style={{paddingRight: '5px'}}>
                      {typewriterText}
                      <span className="inline-block w-[3px] h-[1.5em] bg-[#FFB302] align-middle animate-blink ml-1"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Touch Area for Mobile Swiping */}
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

          {/* Navigation Dots */}
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
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Navigation Arrows */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
            onClick={() => handleSlideChange('prev')}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
            onClick={() => handleSlideChange('next')}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <style>{`
        .carousel-container {
          /* Para sa desktop - full viewport height */
          height: 100vh;
          min-height: 500px;
        }

        @media (max-width: 768px) {
          .carousel-container {
            height: 70vh;
            min-height: 400px;
            max-height: 600px;
          }
        }

        @media (max-width: 480px) {
          .carousel-container {
            height: 60vh;
            min-height: 350px;
            max-height: 500px;
          }
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

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

interface Event {
  title: string;
  date: string;
  time?: string;
  location?: string;
  capacity?: string;
  description: string;
  image: string;
}

const Events: React.FC = () => {
  const [isAnimated] = useAOS();

  // Enhanced event data structure
  const ongoingEvents: Event[] = [
    {
      title: "Tech Conference 2023",
      date: "Ongoing",
      time: "9:00 AM - 6:00 PM",
      location: "Main Auditorium",
      capacity: "150/200",
      description: "Join us for the latest in technology and innovation with industry leaders and hands-on workshops.",
      image: "/images/events/1.jpg"
    },
    {
      title: "AI Workshop",
      date: "Ongoing",
      time: "2:00 PM - 5:00 PM",
      location: "Computer Lab 3",
      capacity: "45/50",
      description: "Hands-on workshop on artificial intelligence and machine learning applications.",
      image: "/images/events/2.jpg"
    },
    {
      title: "Coding Bootcamp",
      date: "Ongoing",
      time: "10:00 AM - 4:00 PM",
      location: "Innovation Center",
      capacity: "75/100",
      description: "Intensive coding sessions for beginners and advanced developers across multiple stacks.",
      image: "/images/events/3.jpg"
    }
  ];

  const upcomingEvents: Event[] = [
    {
      title: "Cultural Diversity Festival",
      date: "March 10, 2024",
      time: "10:00 AM - 8:00 PM",
      location: "PHILTECH GMA Grounds",
      capacity: "300/500",
      description: "Celebrate diversity with cultural performances, food fairs, and traditional arts exhibition.",
      image: "/images/events/1.jpg"
    },
    {
      title: "Future of Web Development",
      date: "March 15, 2024",
      time: "1:00 PM - 5:00 PM",
      location: "Tech Hub Building",
      capacity: "80/120",
      description: "Explore the latest trends in web development including React, Vue, and modern frameworks.",
      image: "/images/events/1.jpg"
    },
    {
      title: "Data Science Summit",
      date: "April 20, 2024",
      time: "9:30 AM - 5:30 PM",
      location: "Conference Hall A",
      capacity: "200/250",
      description: "Insights into data science, analytics, and big data technologies from industry experts.",
      image: "/images/events/2.jpg"
    },
    {
      title: "Cybersecurity Conference",
      date: "May 10, 2024",
      time: "8:00 AM - 6:00 PM",
      location: "Security Pavilion",
      capacity: "150/180",
      description: "Learn about protecting digital assets and latest cybersecurity threats and solutions.",
      image: "/images/events/3.jpg"
    }
  ];

  const pastEvents: Event[] = [
    {
      title: "Blockchain Seminar",
      date: "January 10, 2024",
      time: "3:00 PM - 6:00 PM",
      location: "Digital Hall",
      capacity: "95/120",
      description: "Introduction to blockchain technology and cryptocurrency fundamentals.",
      image: "/images/events/1.jpg"
    },
    {
      title: "Mobile App Development",
      date: "December 5, 2023",
      time: "10:00 AM - 4:00 PM",
      location: "Mobile Lab",
      capacity: "60/80",
      description: "Building modern apps for iOS and Android using cross-platform technologies.",
      image: "/images/events/2.jpg"
    },
    {
      title: "Cloud Computing Workshop",
      date: "November 15, 2023",
      time: "1:00 PM - 5:00 PM",
      location: "Cloud Center",
      capacity: "110/150",
      description: "Mastering cloud technologies and deployment strategies for modern applications.",
      image: "/images/events/3.jpg"
    }
  ];

  const EventCard: React.FC<{ event: Event; type: 'ongoing' | 'upcoming' | 'past' }> = ({ event, type }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden group" data-aos="fade-up">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
          type === 'ongoing'
            ? "bg-maroon text-gold"
            : type === 'upcoming'
              ? "bg-gold text-maroon"
              : "bg-gray-500 text-white"
        }`}>
          {type === 'ongoing' ? "Ongoing" : type === 'upcoming' ? "Upcoming" : "Past"}
        </div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Container */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-maroon dark:text-gold group-hover:text-gold dark:group-hover:text-maroon transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Event Details Grid */}
        <div className="space-y-3 mb-4">
          {/* Date and Time */}
          <div className="flex items-start">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{event.date}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{event.time}</p>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Location</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{event.location}</p>
              </div>
            </div>
          )}

          {/* Capacity */}
          {event.capacity && (
            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-3">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Capacity</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{event.capacity}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-4">
          {event.description}
        </p>

        {/* Action Button */}
        <button className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
          type === 'ongoing' 
            ? 'bg-maroon hover:bg-gold text-gold hover:text-maroon focus:ring-gold' 
            : type === 'upcoming'
              ? 'bg-gold hover:bg-maroon text-maroon hover:text-gold focus:ring-maroon'
              : 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500'
        }`}>
          {type === 'ongoing' ? "Join Now" : type === 'upcoming' ? "Register Now" : "View Event Recap"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <Carousel />

      {/* Ongoing Events */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Ongoing Events</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Events happening right now that you can join immediately
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ongoingEvents.map((event, index) => (
              <EventCard key={index} event={event} type="ongoing" />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Mark your calendar for these exciting future events
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <EventCard key={index} event={event} type="upcoming" />
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Past Events</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Relive the memories from our successful past events
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <EventCard key={index} event={event} type="past" />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;

const Footer: React.FC = () => {
  return (
    <footer 
      className="w-full bg-gradient-to-b from-[#4b0d0e] to-[#3a0a0b] relative mt-16 overflow-hidden"
      data-aos="fade-up"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"></div>

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-red-400 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-yellow-400 blur-xl"></div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <div className="lg:col-span-1" data-aos="fade-right" data-aos-delay="200">
          <div className="flex items-center space-x-2 mb-4">
             <img 
                src="/images/logo/logo.png" 
                alt="Philtech GMA Logo" 
                className="w-10 h-10 object-contain"
              />
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

        <div data-aos="fade-up" data-aos-delay="300">
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
        
        <div data-aos="fade-up" data-aos-delay="400">
          <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
          <div className="space-y-4">
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
        </div>

        {/* Stay Updated Section - After Contact Us */}
        <div data-aos="fade-left" data-aos-delay="500">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 h-full">
            <h4 className="text-lg font-semibold text-white mb-2">Stay Updated</h4>
            <p className="text-gray-300 text-sm mb-3">Subscribe to our newsletter for the latest updates.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 pr-24"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-gradient-to-r from-red-500 to-yellow-500 text-white px-4 rounded-md font-medium hover:opacity-90 transition-opacity text-sm">
                Send
              </button>
            </div>
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
  Footer
};