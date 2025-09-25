import React, { useEffect, useState, useRef, useCallback } from "react";
import { MapPin, Users, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function CampusSection() {
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

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Auto-advance carousel
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        if (!isTransitioning) {
          setCurrent((prev) => (prev + 1) % campuses.length);
        }
      }, 5000); // 5 seconds per slide
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, isTransitioning, campuses.length]);

  const handleSlideChange = useCallback((direction) => {
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

  const goToSlide = (index) => {
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
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-32 h-32 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-red-700 via-red-800 to-yellow-600 bg-clip-text text-transparent animate-fade-in-up">
            Our Campuses
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-red-700 to-yellow-500 mx-auto rounded-full shadow-lg"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
            Discover our three strategic locations across Luzon, each serving their communities with excellence
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-3xl overflow-hidden border border-gray-200 dark:border-gray-700"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Campus Image and Info */}
          <div className="relative h-[600px] lg:h-[500px]">
            {/* Background Image */}
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
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/800/600?random=${campus.id}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50"></div>
                </div>
              ))}
            </div>

            {/* Campus Information Overlay */}
            <div className="absolute inset-0 flex flex-col lg:flex-row">
              {/* Left side - Campus Details */}
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

                  {/* Campus Stats */}
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

                  {/* Programs */}
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

              {/* Right side - Highlights Card */}
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

            {/* Navigation Arrows */}
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

          {/* Bottom Navigation Dots */}
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
            
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-red-700 to-yellow-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((current + 1) / campuses.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Call to Action */}
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
}