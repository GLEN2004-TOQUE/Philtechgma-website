
import { useState } from "react";

const navLinks = [
  { href: "/", title: "Home" },
  { href: "/about", title: "About" },
  { href: "/faculties", title: "Faculties" },
  { href: "/events", title: "Events" },
  { href: "/enrollment-process", title: "Enrollment Process" },
  { href: "/contacts", title: "Contacts" },
  { href: "/developer", title: "Developer" },
];

export default function NavLinks() {

  const [showPrograms, setShowPrograms] = useState(false);
  const [showCollege, setShowCollege] = useState(false);

  const handleProgramsClick = (e) => {
    e.preventDefault();
    setShowPrograms((prev) => !prev);
    setShowCollege(false);
  };

  const handleCollegeClick = (e) => {
    e.preventDefault();
    setShowCollege((prev) => !prev);
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center w-full">
      {navLinks.map((link) => (
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
}