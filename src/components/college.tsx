import React from "react";
import { Navbar, Footer } from "./faculties";

const College: React.FC = () => {
  const collegePrograms = [
    {
      name: "Bachelor of Science in Computer Science (BSCS)",
      description: "Comprehensive program covering software development, algorithms, data structures, and emerging technologies.",
      duration: "4 years",
      image: "/images/logo/cs.png"
    },
    {
      name: "Bachelor of Science in Office Administration (BSOA)",
      description: "Focuses on administrative skills, business communication, and office management practices.",
      duration: "4 years",
      image: "/images/logo/oa.png"
    },
    {
      name: "Bachelor of Technical-Vocational Teacher Education (BTVTED-FBM)",
      description: "Prepares students to become technical-vocational teachers in food and beverage management.",
      duration: "4 years",
      image: "/images/logo/tvted.png"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#7B1112] to-[#FFB302] bg-clip-text text-transparent mb-4">
              College Programs
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our comprehensive college programs designed to prepare you for successful careers in various fields.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collegePrograms.map((program, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={program.image}
                      alt={program.name}
                      className="w-12 h-12 mr-4 object-contain"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {program.name}
                      </h3>
                      <span className="text-sm text-[#7B1112] dark:text-[#FFB302] font-medium">
                        {program.duration}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {program.description}
                  </p>
                  <button className="w-full bg-gradient-to-r from-[#7B1112] to-[#FFB302] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default College;
