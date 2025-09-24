import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-[#4b0d0e] to-[#3a0a0b] relative mt-16 overflow-hidden">
      {/* Top border or accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"></div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-red-400 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-yellow-400 blur-xl"></div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-6 flex flex-col items-center justify-center text-center relative z-10">
        {/* Logo/Brand Section */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Philtech GMA</h2>
          </div>
          <p className="text-gray-300 mt-2 max-w-md">
            Innovating technology solutions for a better tomorrow.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex gap-6 mb-8">
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
              className={`text-gray-200 hover:text-white transition-all duration-300 transform hover:scale-110 bg-white/10 rounded-full p-3 ${icon.color}`}
              aria-label={icon.label}
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                {icon.svg}
              </svg>
            </a>
          ))}
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap justify-center gap-8 text-base text-gray-300 mb-8">
          {[
            { href: "/about", label: "About Us" },
            { href: "/services", label: "Services" },
            { href: "/contact", label: "Contact" },
            { href: "/privacy", label: "Privacy Policy" },
          ].map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="hover:text-white transition-all duration-300 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/10 w-full">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-200">Philtech GMA</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}