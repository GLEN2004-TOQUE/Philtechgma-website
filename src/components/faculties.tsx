import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { X, Sun, Moon, User, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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

const FacultyShowcaseSection: React.FC = () => {
  useAOS();
  const [activeTab, setActiveTab] = useState<'college' | 'seniorHigh'>('college');

  // Sort teachers alphabetically by name
  const sortedCollegeTeachers = [
    { name: "MR. ATIENZA", subjects: ["Accounting", "Finance", "Economics"] },
    { name: "MR. CALCEÑA", subjects: ["Civil Engineering", "Structural Design", "Construction Management"] },
    { name: "MS. CARMONA", subjects: ["Human Resources", "Organizational Behavior", "Labor Laws"] },
    { name: "MR. ELLO", subjects: ["Data Structures", "Algorithm Analysis", "Computer Architecture"] },
    { name: "MR. GORDON", subjects: ["Physics", "Engineering Mechanics", "Thermodynamics"] },
    { name: "MR. V. GORDON", subjects: ["Chemistry", "Materials Science", "Laboratory Techniques"] },
    { name: "MS. IGHARAS", subjects: ["Hospitality Management", "Tourism", "Customer Service"] },
    { name: "MR. ICABANDE", subjects: ["Software Engineering", "Mobile Development", "Algorithms"] },
    { name: "MR. JIMENEZ", subjects: ["Business Management", "Entrepreneurship", "Marketing"] },
    { name: "MR. LACERNA", subjects: ["Network Security", "System Administration", "Cybersecurity"] },
    { name: "MS. MAGNO", subjects: ["Physical Education", "Health", "Wellness"] },
    { name: "MR. MATILA", subjects: ["Operations Management", "Supply Chain", "Logistics"] },
    { name: "MS. OCTAVO", subjects: ["Food Technology", "Food Safety", "Quality Control"] },
    { name: "MR. ORNACHO", subjects: ["Philosophy", "Ethics", "Logic"] },
    { name: "MR. PATALEN", subjects: ["Filipino", "Philippine Literature", "Cultural Studies"] },
    { name: "MR. PATIAM", subjects: ["Electrical Circuits", "Electronics", "Digital Systems"] },
    { name: "MS. RENDORA", subjects: ["English Communication", "Technical Writing", "Literature"] },
    { name: "MR. RODRIGUEZ", subjects: ["Mathematics", "Statistics", "Calculus"] },
    { name: "MS. TESORO", subjects: ["Art Appreciation", "Music", "Cultural Heritage"] },
    { name: "MR. VALENZUELA", subjects: ["Mechanical Engineering", "Machine Design", "CAD/CAM"] },
    { name: "MR. VELE", subjects: ["Computer Programming", "Database Management", "Web Development"] },
    { name: "MS. VELE", subjects: ["Psychology", "Human Behavior", "Social Sciences"] },
    { name: "MS. DIMAPILIS", subjects: ["Research Methods", "Thesis Writing", "Academic Writing"] },
  ].sort((a, b) => a.name.localeCompare(b.name));

  // Senior High School Teachers - sorted alphabetically
  const sortedSeniorHighTeachers = [
    { name: "MR. ALCEDO", subjects: ["General Mathematics", "Statistics", "Business Math"] },
    { name: "MS. ANGELES", subjects: ["Practical Research", "Inquiries and Investigation", "Capstone Project"] },
    { name: "MR. CALCEÑA", subjects: ["Pre-Calculus", "Basic Calculus", "General Physics"] },
    { name: "MR. GARCIA", subjects: ["Filipino sa Piling Larang", "Komunikasyon at Pananaliksik", "Pagbasa at Pagsusuri"] },
    { name: "MS. GAJIRAN", subjects: ["Entrepreneurship", "Business Ethics", "Principles of Marketing"] },
    { name: "MR. R. GORDON", subjects: ["General Chemistry", "Physical Science", "Earth and Life Science"] },
    { name: "MR. V. GORDON", subjects: ["Biology", "Environmental Science", "Research in Daily Life"] },
    { name: "MR. JIMENEZ", subjects: ["Organization and Management", "Fundamentals of Accountancy", "Business Finance"] },
    { name: "MS. LAGUADOR", subjects: ["Media and Information Literacy", "Empowerment Technologies", "Computer Systems Servicing"] },
    { name: "MR. ORNACHO", subjects: ["Introduction to Philosophy", "Disciplines and Ideas in Social Sciences", "Trends and Issues"] },
    { name: "MS. RENDORA", subjects: ["English for Academic Purposes", "Reading and Writing Skills", "Oral Communication"] },
    { name: "MS. RIVERA", subjects: ["Personal Development", "Understanding Culture and Society", "Disaster Readiness"] },
    { name: "MS. ROQUIOS", subjects: ["Contemporary Philippine Arts", "Creative Writing", "Creative Industries"] },
    { name: "MR. RODRIGUEZ", subjects: ["Pre-Calculus", "Statistics and Probability", "Basic Calculus"] },
    { name: "MR. SANTOS", subjects: ["Physical Education and Health", "Wellness and Fitness", "Recreational Activities"] },
    { name: "MS. SANTOS", subjects: ["Applied Economics", "Social Sciences", "Philippine Politics and Governance"] },
    { name: "MS. TESORO", subjects: ["Work Immersion", "Career Guidance", "Homeroom Guidance"] },
    { name: "MRS. TESORO", subjects: ["Work Immersion", "Career Guidance", "Homeroom Guidance"] },
    { name: "MS. TINGSON", subjects: ["Cookery", "Food and Beverage Services", "Bread and Pastry Production"] },
    { name: "MR. UMALI", subjects: ["Electrical Installation and Maintenance", "Electronics Product Assembly", "Technical Drafting"] },
    { name: "MRS. YABUT", subjects: ["Housekeeping Services", "Tourism Promotion Services", "Travel Services"] },
  ].sort((a, b) => a.name.localeCompare(b.name));

  const activeTeachers = activeTab === 'college' ? sortedCollegeTeachers : sortedSeniorHighTeachers;
  const activeTabTitle = activeTab === 'college' ? 'College' : 'Senior High School';

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#7b1112] via-[#BC1F27] to-[#FFB302] bg-clip-text text-transparent"
            data-aos="fade-down"
            data-aos-duration="800"
          >
            Faculty Directory
          </h2>
          <p
            className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-duration="700"
          >
            Meet our dedicated faculty members from College and Senior High School. Each card displays the teacher's name and subjects they teach.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-center mb-8 gap-4" data-aos="fade-up" data-aos-delay="200">
          <button
            onClick={() => setActiveTab('college')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center ${
              activeTab === 'college'
                ? 'bg-gradient-to-r from-[#7b1112] to-[#BC1F27] text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 7l9-5-9-5-9 5 9 5z" />
            </svg>
            College Faculty ({sortedCollegeTeachers.length})
          </button>
          <button
            onClick={() => setActiveTab('seniorHigh')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center ${
              activeTab === 'seniorHigh'
                ? 'bg-gradient-to-r from-[#FFB302] to-[#BC1F27] text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Senior High Faculty ({sortedSeniorHighTeachers.length})
          </button>
        </div>

        {/* Active Tab Indicator */}
        <div className="mb-8 text-center" data-aos="fade-up" data-aos-delay="250">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#7b1112]/10 to-[#FFB302]/10">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              activeTab === 'college' ? 'bg-[#7b1112]' : 'bg-[#FFB302]'
            }`}></div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Currently viewing: <span className="text-[#7b1112] dark:text-[#FFB302]">{activeTabTitle} Teachers</span>
            </span>
          </div>
        </div>

        {/* Alphabetical Index */}
        <div className="mb-8 flex flex-wrap justify-center gap-2" data-aos="fade-up" data-aos-delay="300">
          {Array.from(new Set(activeTeachers.map(teacher => teacher.name.charAt(4)))).map(letter => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-[#7b1112]/10 to-[#BC1F27]/10 hover:from-[#7b1112] hover:to-[#BC1F27] hover:text-white text-[#7b1112] dark:text-[#FFB302] font-bold transition-all duration-300"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Faculty Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeTeachers.map((teacher, index) => (
            <div
              key={index}
              id={`letter-${teacher.name.charAt(4)}`}
              className="group relative"
              data-aos="fade-up"
              data-aos-delay={index * 30}
              data-aos-duration="400"
            >
              {/* Faculty Card */}
              <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Card Header with Name */}
                <div className={`p-5 border-b ${
                  activeTab === 'college' 
                    ? 'bg-gradient-to-r from-[#7b1112]/5 to-[#BC1F27]/5 border-[#7b1112]/10'
                    : 'bg-gradient-to-r from-[#FFB302]/5 to-[#BC1F27]/5 border-[#FFB302]/10'
                } dark:from-gray-800 dark:to-gray-900 dark:border-gray-700`}>
                  <div className="flex items-center">
                    {/* Initial Circle */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md mr-4 ${
                      activeTab === 'college'
                        ? 'bg-gradient-to-r from-[#7b1112] to-[#BC1F27]'
                        : 'bg-gradient-to-r from-[#FFB302] to-[#BC1F27]'
                    }`}>
                      <span className="text-xl font-bold text-white">
                        {teacher.name.split(' ')[1]?.charAt(0) || teacher.name.charAt(0)}
                      </span>
                    </div>
                    
                    {/* Name Section */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {teacher.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          activeTab === 'college'
                            ? 'bg-gradient-to-r from-[#FFB302]/20 to-[#FFB302]/10 text-[#BC1F27] dark:text-[#FFB302]'
                            : 'bg-gradient-to-r from-[#7b1112]/20 to-[#7b1112]/10 text-[#7b1112] dark:text-[#FFB302]'
                        }`}>
                          {activeTabTitle} Teacher
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {teacher.subjects.length} subjects
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body with Subjects */}
                <div className="p-5">
                  <div className="mb-3 flex items-center">
                    <svg className={`w-4 h-4 mr-2 ${
                      activeTab === 'college' ? 'text-[#FFB302]' : 'text-[#7b1112] dark:text-[#FFB302]'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subjects Handled</h4>
                  </div>
                  
                  <ul className="space-y-2">
                    {teacher.subjects.map((subject, idx) => (
                      <li 
                        key={idx}
                        className="text-sm text-gray-600 dark:text-gray-400 pl-4 relative before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full"
                        style={{
                          background: activeTab === 'college' 
                            ? 'linear-gradient(to right, #FFB302, #BC1F27)'
                            : 'linear-gradient(to right, #7b1112, #FFB302)'
                        }}
                      >
                        {subject}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      <span className={`font-medium ${
                        activeTab === 'college' ? 'text-[#7b1112] dark:text-[#FFB302]' : 'text-[#FFB302]'
                      }`}>
                        {teacher.name.charAt(4)}
                      </span>
                      <span className="mx-1">•</span>
                      Alphabetical
                    </span>
                    <div className={`text-xs px-2 py-1 rounded ${
                      activeTab === 'college'
                        ? 'bg-gradient-to-r from-[#7b1112]/10 to-[#BC1F27]/10 text-[#7b1112] dark:text-[#FFB302]'
                        : 'bg-gradient-to-r from-[#FFB302]/10 to-[#BC1F27]/10 text-[#FFB302]'
                    }`}>
                      #{String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div 
          className="mt-12 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <h3 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Faculty Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#7b1112] to-[#BC1F27] bg-clip-text text-transparent">
                {sortedCollegeTeachers.length}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">College Teachers</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#FFB302] to-[#BC1F27] bg-clip-text text-transparent">
                {sortedSeniorHighTeachers.length}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Senior High Teachers</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#7b1112] to-[#FFB302] bg-clip-text text-transparent">
                {sortedCollegeTeachers.reduce((acc, teacher) => acc + teacher.subjects.length, 0) + 
                 sortedSeniorHighTeachers.reduce((acc, teacher) => acc + teacher.subjects.length, 0)}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Total Subjects</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#BC1F27] to-[#FFB302] bg-clip-text text-transparent">
                {sortedCollegeTeachers.length + sortedSeniorHighTeachers.length}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Total Faculty</p>
            </div>
          </div>
          
          {/* Quick Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setActiveTab('college')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'college'
                    ? 'bg-gradient-to-r from-[#7b1112] to-[#BC1F27] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Switch to College
              </button>
              <button
                onClick={() => setActiveTab('seniorHigh')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'seniorHigh'
                    ? 'bg-gradient-to-r from-[#FFB302] to-[#BC1F27] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Switch to Senior High
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Faculties: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <Navbar />
      <HeroBackground />
      <FacultyShowcaseSection />
      <Footer />
    </div>
  );
};

export default Faculties;

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
  Footer
};