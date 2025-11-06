import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Calendar, X, Sun, Moon, User, ChevronDown, Clock, Mail, Star, ArrowRight, BookOpen, GraduationCap, University, School, Building, Newspaper } from "lucide-react";
import { useParallax } from "../hooks/Parallax";
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
              seniorhigh
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
const HeroBackground: React.FC = () => {
  const [typewriterText, setTypewriterText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [typeIndex, setTypeIndex] = useState<number>(0);
  const [isDarkMode] = useDarkMode();

  const backgroundImage = "/images/carousel-backgrounds/3.jpg";

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

  return (
    <>
      <div className="w-full hero-container relative overflow-hidden bg-gray-900">
        <div className="relative w-full h-full">
          {/* Background Image Container */}
          <div className="absolute inset-0">
            <img
              src={backgroundImage}
              alt="Philtech GMA Background"
              className="hero-image w-full h-full object-cover object-center"
              draggable="false"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/1920/1080?random=1";
              }}
            />
          </div>

          {/* Background Overlay */}
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
      </div>

      <style>{`
        .hero-container {
          /* Para sa desktop - full viewport height */
          height: 100vh;
          min-height: 500px;
        }

        @media (max-width: 768px) {
          .hero-container {
            height: 70vh;
            min-height: 400px;
            max-height: 600px;
          }
        }

        @media (max-width: 480px) {
          .hero-container {
            height: 60vh;
            min-height: 350px;
            max-height: 500px;
          }
        }

        .hero-image {
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

const HistorySection: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  useAOS();
  const parallax1 = useParallax(0.2);
  const parallax2 = useParallax(0.3);
  const parallax3 = useParallax(0.4);

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-red-950/20 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-gradient-to-r from-red-400 to-yellow-400 blur-3xl animate-pulse" style={parallax1}></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-red-400 blur-3xl animate-pulse delay-1000" style={parallax2}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 blur-xl animate-pulse delay-500" style={parallax3}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 
            data-aos="fade-up" 
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#7b1112] via-[#BC1F27] to-[#FFB302] bg-clip-text text-transparent"
          >
            Philtech History
          </h2>
          <div 
            data-aos="fade-up"
            data-aos-delay="200"
          ></div>
          <p 
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Discover the inspiring journey of Philippine Technological Institute of Science Arts and Trade Inc.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="relative max-w-2xl w-full" data-aos="zoom-in" data-aos-delay="400">
            {!open && (
              <div className="relative">
                <button
                  className="envelope-container group w-full h-64 sm:h-72 md:h-80 bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 dark:from-gray-800 dark:via-red-900/30 dark:to-gray-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-700 hover:scale-105 hover:shadow-3xl border-4 border-[#7b1112] relative overflow-hidden"
                  onClick={() => setOpen(true)}
                  aria-label="Open history envelope"
                >
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-8 h-8 border-2 border-[#7b1112] rounded rotate-45 animate-spin-slow"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-[#7b1112] rounded-full animate-bounce"></div>
                    <div className="absolute top-1/2 right-8 w-4 h-4 bg-[#7b1112] rounded-full animate-pulse"></div>
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
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#7b1112] rounded-full animate-ping"></div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-[#7b1112] dark:text-[#7b1112] mb-2 group-hover:text-[#5a0d0d] dark:group-hover:text-[#5a0d0d] transition-colors">
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
                    className="envelope-flap absolute -top-1 left-1/2 -translate-x-1/2 w-40 h-20 bg-[#7b1112] shadow-lg transition-all duration-500 group-hover:shadow-xl"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/30 rounded-full"></div>
                  </div>
                </button>
              </div>
            )}

            {open && (
              <div className="envelope-open bg-white dark:bg-gray-800 rounded-3xl shadow-3xl transition-all duration-1000 animate-scale-in-up relative border-4 border-[#7b1112] overflow-hidden max-h-[80vh]">
                <div className="sticky top-0 bg-[#7b1112] text-white p-6 z-20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <img src="/images/logo/logo.png" alt="Philtech Logo" className="w-8 h-8" />
                        Philippine Technological Institute
                      </h3>
                      <p className="text-amber-200 text-sm mt-1">Est. 2010 - Science, Arts & Trade</p>
                    </div>
                    <button
                      className="w-10 h-10 rounded-full bg-white text-[#7b1112] flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#5a0d0d] hover:text-white text-xl font-bold shadow-lg"
                      onClick={() => setOpen(false)}
                      aria-label="Close history envelope"
                    >
                      &times;
                    </button>
                  </div>
                </div>

                <div className="p-8 overflow-y-auto max-h-96">
                  <div className="absolute left-8 top-20 bottom-8 w-1 bg-[#7b1112] opacity-20 hidden lg:block"></div>

                  <div className="relative">
                    <div className="space-y-6 mb-8">
                      <div className="flex items-center gap-4" >
                        <div className="w-4 h-4 bg-[#7b1112] rounded-full flex-shrink-0 shadow-lg"></div>
                        <div>
                          <h4 className="font-bold text-[#7b1112] dark:text-[#7b1112]">2010 - Foundation</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Established by 11 visionary founders</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4" >
                        <div className="w-4 h-4 bg-[#7b1112] rounded-full flex-shrink-0 shadow-lg"></div>
                        <div>
                          <h4 className="font-bold text-[#7b1112] dark:text-[#7b1112]">2011 - First Programs</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">IT, Hotel Services & Business Management</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4" >
                        <div className="w-4 h-4 bg-[#7b1112] rounded-full flex-shrink-0 shadow-lg"></div>
                        <div>
                          <h4 className="font-bold text-[#7b1112] dark:text-[#7b1112]">2013 - Expansion</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Santa Rosa & GMA branches opened</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4" >
                        <div className="w-4 h-4 bg-[#7b1112] rounded-full flex-shrink-0 shadow-lg"></div>
                        <div>
                          <h4 className="font-bold text-[#7b1112] dark:text-[#7b1112]">2021 - Bachelor Programs</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">First bachelor's degree program launched</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4" >
                        <div className="w-4 h-4 bg-[#7b1112] rounded-full flex-shrink-0 shadow-lg"></div>
                        <div>
                          <h4 className="font-bold text-[#7b1112] dark:text-[#7b1112]">2022-2023 - Continued Growth</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Added Computer Science and Office Administration</p>
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p 
                        className="text-gray-700 dark:text-gray-200 leading-relaxed text-justify mb-6 indent-8"
                      >
                        Philippine Technological Institute of Science Arts and Trade Inc., founded in 2010 as a non-stock non-profit non-sectarian private Educational Institution to blaze the trail in the field of technical education. Its eleven founders were a mixture of engineers, a scientist/inventor and practitioner in the IT industry, school administrators, managers and academic professionals in both public and private institutions.
                      </p>

                      <p 
                        className="text-gray-700 dark:text-gray-200 leading-relaxed text-justify mb-6 indent-8"
                      >
                        The first school was established in November of 2010 and is presently located at F.T. Catapusan St. in Tanay, Rizal. In June 2011, Philippine Technological Institute opened and offered two-year programs in Information Technology, Hotel and Restaurant Services, and Business Outsourcing Management.
                      </p>

                      <p 
                        className="text-gray-700 dark:text-gray-200 leading-relaxed text-justify mb-6 indent-8"
                      >
                        By November of 2012, negotiations for additional branches went underway. The Board of Trustees resolved that two new PHILTECH branches should be established in Sta. Rosa, Laguna and General Mariano Alvarez, Cavite, both opening in the first semester of school year 2013-2014.
                      </p>

                      <p 
                        className="text-gray-700 dark:text-gray-200 leading-relaxed text-justify mb-6 indent-8"
                      >
                        By 2021, the GMA branch offered its first bachelor's program: Bachelor in Technical Vocational Teacher Education Major in Food and Beverage Management. The institution continued to grow, adding Bachelor of Science in Computer Science and Bachelor of Science in Office Administration by school year 2022-2023.
                      </p>

                      <div 
                        className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-red-900/20 p-6 rounded-2xl mt-8 border-l-4 border-[#7b1112]"
                      >
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-center italic font-medium">
                          "To date, the institution has been giving its best in proving its objective to provide <span className="text-[#7b1112] dark:text-[#7b1112] font-bold">global success through academic excellence</span> with admiration for knowledge and appreciation for skills."
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
  useAOS();
  const parallax1 = useParallax(0.2, 'left');
  const parallax2 = useParallax(0.3, 'right');
  const parallax3 = useParallax(0.4, 'left');

  const campuses = [
    {
      id: 1,
      name: "PHILTECH GMA",
      location: "General Mariano Alvarez, Cavite",
      image: "/images/campuses/gma-campus.jpg",
      established: "2013",
      students: "500+",
      collegePrograms: ["BTVTED-FBM", "BSCS", "BSOA"],
      seniorHighStrands: ["ABM", "HUMSS", "TVL-ICT", "TVL-HE"],
      description: "Our flagship GMA campus offers comprehensive bachelor's programs and technical education in a modern facility.",
      highlights: ["First to offer bachelor's programs", "Modern computer laboratories", "Industry partnerships"],
      coordinates: { lat: 14.2978, lng: 120.9958 }
    },
    {
      id: 3,
      name: "PHILTECH TANAY",
      location: "Tanay, Rizal",
      image: "/images/campuses/tanay-campus.jpg",
      established: "2010",
      students: "1000+",
      collegePrograms: [],
      seniorHighStrands: ["ABM", "HUMSS", "TVL-ICT", "TVL-HE"],
      description: "Our founding campus in Tanay, Rizal, where the Philtech legacy began. The largest campus serving the local community.",
      highlights: ["Original founding campus", "Largest student population", "Community-focused programs"],
      coordinates: { lat: 14.5979, lng: 121.3547 }
    }
  ];

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-red-950/20 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-32 h-32 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-3xl animate-pulse" style={parallax1}></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur-3xl animate-pulse delay-1000" style={parallax2}></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-2xl animate-pulse delay-500" style={parallax3}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#7b1112] via-[#BC1F27] to-[#FFB302] bg-clip-text text-transparent"
            data-aos="fade-up"
          >
            Our Campuses
          </h2>
          <div 
            data-aos="fade-up"
            data-aos-delay="200"
          ></div>
          <p 
            className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Discover our strategic locations across Luzon, each serving their communities with excellence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-aos="fade-up" data-aos-delay="400">
          {campuses.map((campus, index) => (
            <div 
              key={campus.id}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-3xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-4xl hover:transform hover:scale-[1.02] group flex flex-col"
              data-aos="fade-up"
              data-aos-delay={500 + (index * 100)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={campus.image}
                  alt={campus.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/800/600?random=${campus.id}`;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
                
                {/* Campus Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-[#7b1112] to-[#FFB302] text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    {campus.name}
                  </div>
                </div>

                {/* Established Badge */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Est. {campus.established}
                </div>
              </div>

              <div className="p-6 lg:p-8 flex flex-col flex-1">
                {/* Location */}
                <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
                  <MapPin size={18} className="mr-2 text-[#7b1112]" />
                  <span className="text-sm font-medium">{campus.location}</span>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {campus.description}
                </p>

                {/* Stats - Dynamic grid based on whether campus has college programs */}
                <div className={`grid ${campus.collegePrograms.length > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-6`}>
                  <div className="text-center p-3 bg-amber-50 dark:bg-gray-700 rounded-lg">
                    <Users size={20} className="mx-auto mb-2 text-[#7b1112]" />
                    <div className="text-xl font-bold text-gray-800 dark:text-white">{campus.students}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Students</div>
                  </div>
                  {campus.collegePrograms.length > 0 && (
                    <div className="text-center p-3 bg-amber-50 dark:bg-gray-700 rounded-lg">
                      <GraduationCap size={20} className="mx-auto mb-2 text-[#7b1112]" />
                      <div className="text-xl font-bold text-gray-800 dark:text-white">{campus.collegePrograms.length}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">College Programs</div>
                    </div>
                  )}
                  <div className="text-center p-3 bg-amber-50 dark:bg-gray-700 rounded-lg">
                    <BookOpen size={20} className="mx-auto mb-2 text-[#7b1112]" />
                    <div className="text-xl font-bold text-gray-800 dark:text-white">{campus.seniorHighStrands.length}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">SHS Strands</div>
                  </div>
                </div>

                {/* College Programs - Only show if campus has college programs */}
                {campus.collegePrograms.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                      <University size={18} className="mr-2 text-[#FFB302]" />
                      College Programs Offered
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {campus.collegePrograms.map((program, programIndex) => (
                        <span
                          key={programIndex}
                          className="px-3 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-amber-200 dark:border-gray-600"
                        >
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Senior High Strands */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                    <School size={18} className="mr-2 text-[#FFB302]" />
                    Senior High Strands Offered
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {campus.seniorHighStrands.map((strand, strandIndex) => (
                      <span
                        key={strandIndex}
                        className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-blue-200 dark:border-gray-600"
                      >
                        {strand}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                    <Star size={18} className="mr-2 text-[#FFB302]" />
                    Campus Highlights
                  </h4>
                  <ul className="space-y-2">
                    {campus.highlights.map((highlight, highlightIndex) => (
                      <li key={highlightIndex} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-[#7b1112] rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-3xl shadow-3xl p-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            Campus Comparison
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-amber-50 dark:bg-gray-700 rounded-xl">
              <div className="text-3xl font-bold text-[#7b1112] mb-2">2</div>
              <div className="text-gray-600 dark:text-gray-300">Strategic Locations</div>
            </div>
            <div className="text-center p-6 bg-amber-50 dark:bg-gray-700 rounded-xl">
              <div className="text-3xl font-bold text-[#7b1112] mb-2">1500+</div>
              <div className="text-gray-600 dark:text-gray-300">Total Students</div>
            </div>
            <div className="text-center p-6 bg-amber-50 dark:bg-gray-700 rounded-xl">
              <div className="text-3xl font-bold text-[#7b1112] mb-2">3</div>
              <div className="text-gray-600 dark:text-gray-300">College Programs</div>
            </div>
            <div className="text-center p-6 bg-amber-50 dark:bg-gray-700 rounded-xl">
              <div className="text-3xl font-bold text-[#7b1112] mb-2">8</div>
              <div className="text-gray-600 dark:text-gray-300">SHS Strands</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
        .shadow-4xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </section>
  );
};

const NewsAndAnnouncementsSection: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const newsItems = [
    {
      id: 1,
      title: "Marketing Summit and Team Building 2025",
      date: "2025-10-29",
      author: "Philtech GmaPage",
      image: "/images/News&Announcements/team-building .jpg",
      excerpt: "The Marketing Summit and Team Building held last October 29–30, 2025, at Shercon Resort Tropical Farm Suites Ecology Park, was a resounding success! 🌿💼",
      content: "✨ Theme: Connect, Create, Conquer — Strategic Planning of Marketing Techniques for 2026–2027 ✨ The Marketing Summit and Team Building held last October 29–30, 2025, at Shercon Resort Tropical Farm Suites Ecology Park, was a resounding success! 🌿💼 Through this event, the PhilTech Administrative and Faculty Staff strengthened their bonds, shared innovative ideas, and developed strategic plans to gear up for the upcoming Senior High School Curriculum 2026–2027. Together, we are ready to connect, create, and conquer new challenges ahead! 💪🎯",
      tags: ["Connect", "Create", "Conquer"],
      department: "Faculties, Marketing and Admins",
      contact: "philtech.2013gma@gmail.com"
    },
    {
      id: 2,
      title: "Supreme Student Government",
      date: "2025-10-14",
      author: "Philtech GmaPage",
      image: "/images/News&Announcements/votes.jpg",
      excerpt: "Philtech Supreme Student Government! Check out the list below and get ready to make your voices be heard!📢",
      content: "The results are in! 🗳️ Congratulations, to our Student Government winners! 📣 A new chapter begins for the Philtech GMA! Remember that leadership is a privilege, not a right.",
      tags: ["PSSGElection2025"],
      department: "Senior High Students",
      contact: "philtech.2013gma@gmail.com"
    },
    {
      id: 3,
      title: "World Teachers Day",
      date: "2025-10-04",
      author: "Philtech GmaPage",
      image: "/images/News&Announcements/teacherday.jpg",
      excerpt: "On this World Teachers' Day, we express our heartfelt gratitude to all educators who guide our journey of learning with dedication, compassion, and wisdom.",
      content: "Happy World Teachers' Day! 💐 Behind every successful student is a teacher who believed, encouraged, and patiently guided them. Your tireless dedication, kindness, and sacrifices make an everlasting impact on our lives. Thank you for shaping not only our skills but also our values, giving us wings to fly higher and dreams to chase. You are truly the heart of education and the hope of tomorrow.🌍❤️.",
      tags: ["WorldTeachersday"],
      department: "All Teachers",
      contact: "career@philtech.edu"
    },
  ];

  // Function to calculate relative time (e.g., "2 months ago", "1 day ago")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears > 0) {
      return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    } else if (diffInMonths > 0) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return 'Today';
    }
  };

  const handleNewsClick = (news: any) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#7b1112] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FFB302] rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#BC1F27] rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#7b1112] via-[#BC1F27] to-[#FFB302] bg-clip-text text-transparent"
            data-aos="fade-up"
          >
            News & Announcements
          </h2>
          <div 
            className="w-32 h-1 bg-gradient-to-r from-[#7b1112] to-[#FFB302] mx-auto rounded-full shadow-lg"
            data-aos="fade-up"
            data-aos-delay="200"
          ></div>
          <p 
            className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Stay informed with the latest updates, achievements, and important announcements from PHILTECH GMA
          </p>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {newsItems.map((news, index) => (
            <div
              key={news.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col"
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              <div className="relative">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/400/300?random=${news.id}`;
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r from-[#7b1112] to-[#BC1F27]">
                    Announcement
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 line-clamp-2">
                  {news.title}
                </h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Calendar size={16} className="mr-2 text-[#7b1112]" />
                      <span className="text-sm font-semibold">{getRelativeTime(news.date)}</span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(news.date)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <User size={16} className="mr-2 text-[#FFB302]" />
                    <span className="text-sm">{news.author}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Building size={16} className="mr-2 text-[#BC1F27]" />
                    <span className="text-sm">{news.department}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                  {news.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {news.tags.map((tag: string, tagIndex: number) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-[#7b1112]/10 text-[#7b1112] dark:bg-[#FFB302]/20 dark:text-[#FFB302] text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => handleNewsClick(news)}
                    className="w-full bg-gradient-to-r from-[#7b1112] to-[#BC1F27] hover:from-[#f7a102] hover:to-[#f7a102] text-white px-4 py-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Newspaper size={16} />
                    Read Full Story
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {newsItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-[#7b1112]/10 rounded-full flex items-center justify-center">
              <Newspaper size={40} className="text-[#7b1112]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No announcements found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no announcements at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Announcement Detail Modal */}
      {isModalOpen && selectedNews && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in-up"
          >
            <div className="relative">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/800/400?random=${selectedNews.id}`;
                }}
              />
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 bg-[#7b1112] hover:bg-[#BC1F27] text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 shadow-lg"
                aria-label="Close announcement details"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r from-[#7b1112] to-[#BC1F27]">
                    Announcement
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {selectedNews.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-[#7b1112] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Published</p>
                      <p className="font-semibold">{getRelativeTime(selectedNews.date)}</p>
                      <p className="text-sm text-gray-400">{formatDate(selectedNews.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-[#FFB302] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Author</p>
                      <p className="font-semibold">{selectedNews.author}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-[#BC1F27] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-semibold">{selectedNews.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-[#7b1112] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-semibold">{selectedNews.contact}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedNews.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#7b1112]/10 text-[#7b1112] dark:bg-[#FFB302]/20 dark:text-[#FFB302] text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                  {selectedNews.content}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={handleCloseModal}
                  className="bg-gradient-to-r from-[#7b1112] to-[#BC1F27] hover:from-[#f7a102] hover:to-[#f7a102] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Close Announcement
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
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in-up {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
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
      name: "Christopher Glen",
      role: "BSCS 3rd Year student of BSCS",
      image: "/images/testimonials/tox.jpg",
      text: "PHILTECH GMA provided me with the perfect balance of theoretical knowledge and practical skills. The supportive faculty and modern facilities helped me secure a job for the future",
      rating: 5,
      program: "Computer Science",
      campus: "GMA Campus"
    },
    {
      id: 2,
      name: "Mhaytan James",
      role: "BSCS 3rd Year student of BSCS",
      image: "/images/testimonials/tan.jpg",
      text: "The hands-on approach to learning at PHILTECH is exceptional. The industry partnerships and real-world projects have prepared me well for my future career in Tech industry.",
      rating: 5,
      program: "Computer Science",
      campus: "GMA Campus"
    },
    {
      id: 3,
      name: "Mervin",
      role: "BSCS 3rd Year student of BSCS",
      image: "/images/testimonials/mer.jpg",
      text: "Teaching at PHILTECH has been incredibly rewarding. The institution's commitment to academic excellence and student success creates an environment where both students and faculty can thrive.",
      rating: 5,
      program: "Computer Science",
      campus: "GMA Campus"
    },
    {
      id: 4,
      name: "Christian",
      role: "BSCS 3rd Year student of BSCS",
      image: "/images/Devs/dacula.jpg",
      text: "My PHILTECH education was the foundation of my successful career. The practical skills and industry connections I gained have been invaluable in my professional journey.",
      rating: 5,
      program: "Computer Science",
      campus: "GMA Campus"
    },
    {
      id: 5,
      name: "Angelica Anne",
      role: "BSCS 3rd Year student of BSCS",
      image: "/images/Devs/martinez.jpg",
      text: "The BSCS program at PHILTECH has amazing facilities and teachers who genuinely care about our future.",
      rating: 5,
      program: "Computer Science",
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
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#7b1112] via-[#BC1F27] to-[#FFB302] bg-clip-text text-transparent"
            data-aos="fade-up"
          >
            What They Say
          </h2>
          <div 
            className="w-32 h-1 bg-gradient-to-r from-[#7b1112] to-[#FFB302] mx-auto rounded-full shadow-lg"
            data-aos="fade-up"
            data-aos-delay="200"
          ></div>
          <p 
            className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Hear from our students, alumni, and faculty about their PHILTECH experience
          </p>
        </div>

        <div 
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden border border-amber-200 dark:border-amber-800"
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFB302]/10 to-[#BC1F27]/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#7b1112]/10 to-[#FFB302]/10 rounded-full translate-y-20 -translate-x-20"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0" data-aos="fade-right" data-aos-delay="500">
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
                  <div 
                    className="flex justify-center lg:justify-start mb-4"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
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
                  <blockquote 
                    className="text-xl md:text-2xl font-medium text-gray-800 dark:text-white mb-6 leading-relaxed italic"
                    data-aos="fade-up"
                    data-aos-delay="700"
                  >
                    "{currentTestimony.text}"
                  </blockquote>

                  {/* Person Info */}
                  <div className="space-y-2">
                    <h4 
                      className="text-2xl font-bold bg-gradient-to-r from-[#7b1112] to-[#BC1F27] bg-clip-text text-transparent"
                      data-aos="fade-up"
                      data-aos-delay="800"
                    >
                      {currentTestimony.name}
                    </h4>
                    <p 
                      className="text-gray-600 dark:text-gray-300 font-medium"
                      data-aos="fade-up"
                      data-aos-delay="900"
                    >
                      {currentTestimony.role}
                    </p>
                    <div 
                      className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400"
                      data-aos="fade-up"
                      data-aos-delay="1000"
                    >
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
                <div 
                  className="flex items-center justify-center lg:justify-start space-x-4 mt-8"
                  data-aos="fade-up"
                  data-aos-delay="1100"
                >
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
          <div className="flex-1 text-white">
            <div className="max-w-2xl">
              <h2 
                className="text-4xl sm:text-5xl md:text-6xl font-black mb-6"
                data-aos="fade-right"
              >
                Your Future Starts{" "}
                <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Here
                </span>
              </h2>
              
              <div 
                className="w-24 h-1 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full mb-8"
                data-aos="fade-right"
                data-aos-delay="200"
              ></div>

              <p 
                className="text-xl mb-8 leading-relaxed text-white/90"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                Join the PHILTECH family and embark on an educational journey that transforms 
                dreams into reality. Our dedicated registrar team is ready to guide you every step of the way.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div 
                  className="flex items-center space-x-3"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-300">Expert Faculty</h4>
                    <p className="text-sm text-white/80">Industry professionals</p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-3"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Calendar className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-300">Flexible Schedule</h4>
                    <p className="text-sm text-white/80">Multiple program options</p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-3"
                  data-aos="fade-up"
                  data-aos-delay="600"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <MapPin className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-300">Modern Facilities</h4>
                    <p className="text-sm text-white/80">State-of-the-art labs</p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-3"
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
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
              <div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                data-aos="fade-up"
                data-aos-delay="800"
              >
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
              <div 
                className="grid grid-cols-3 gap-4 text-center"
                data-aos="fade-up"
                data-aos-delay="900"
              >
                <div>
                  <div className="text-2xl font-bold text-amber-300">500+</div>
                  <div className="text-sm text-white/80">Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-300">8+</div>
                  <div className="text-sm text-white/80">Programs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-300">98%</div>
                  <div className="text-sm text-white/80">Graduation Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Registrar Image */}
          <div className="flex-1">
            <div className="relative">
              {/* Main Image Container */}
              <div 
                className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
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
                  <div 
                    className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl border-2 border-amber-300 animate-float"
                    data-aos="fade-right"
                    data-aos-delay="600"
                  >
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
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-amber-300/30 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-red-400/30 rounded-full blur-xl"></div>
              </div>

              {/* Contact Information Box */}
              <div 
                className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20"
                data-aos="fade-up"
                data-aos-delay="800"
              >
                <h4 className="text-xl font-bold text-[#7b1112] mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-[#BC1F27]" />
                  Quick Contact
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email:</span>
                <a href="mailto:registrar@philtech.edu" className="text-[#BC1F27] font-medium hover:text-[#7b1112]">
                  philtech.2013gma@gmail.com
                </a>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Phone:</span>
                <a href="tel:+6321234567" className="text-[#BC1F27] font-medium hover:text-[#7b1112]">
                  (+63) 997-224-0222
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
            Global Success Through Academic Excellence.
          </p>

          <div className="flex gap-4">
            {[
              {
                href: "https://www.facebook.com/philtechgma2013",
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
              { href: "/regular", label: "College" },
              { href: "/seniorhigh", label: "Senior High" },
              { href: "/developer", label: "Our Team" },
              { href: "/enrollment-process", label: "Enrollment Process" },
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
                <a href="mailto:info@philtechgma.com" className="text-white hover:text-yellow-400 transition-colors">philtech.2013gma@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <div>
                <p className="text-gray-300">Call us</p>
                <a href="tel:+1234567890" className="text-white hover:text-yellow-400 transition-colors">+63 997 224 0222</a>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div>
                <p className="text-gray-300">Visit us</p>
                <p className="text-white">2nd Floor CRDM Building Governor's Drive Baranggay Maderan, GMA, Cavite, General Mariano Alvarez, Philippines</p>
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
  HeroBackground,
  HistorySection,
  CampusSection,
  NewsAndAnnouncementsSection,
  TestimonialsSection,
  EnrollmentCTASection,
  Footer
};