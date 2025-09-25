import React, { useState } from "react";
import { Menu, X, Sun, Moon, User } from "lucide-react";
import Logo from "./Logo.tsx";
import NavLinks from "./NavLinks.tsx";
import { useDarkMode } from "../hooks/useDarkMode";

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

export default Navbar;
