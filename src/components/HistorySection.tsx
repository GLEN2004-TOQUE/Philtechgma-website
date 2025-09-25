import React, { useState } from "react";

const HistorySection: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-red-950/20 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-gradient-to-r from-red-400 to-yellow-400 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-red-400 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced title with gradient and animation */}
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
            {/* Envelope closed state - Enhanced design */}
            {!open && (
              <div className="relative">
                <button
                  className="envelope-container group w-full h-64 sm:h-72 md:h-80 bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 dark:from-gray-800 dark:via-red-900/30 dark:to-gray-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-700 hover:scale-105 hover:shadow-3xl border-4 border-gradient-to-r from-[#FFB302] to-[#BC1F27] relative overflow-hidden"
                  onClick={() => setOpen(true)}
                  aria-label="Open history envelope"
                >
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-8 h-8 border-2 border-[#FFB302] rounded rotate-45 animate-spin-slow"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-[#BC1F27] rounded-full animate-bounce"></div>
                    <div className="absolute top-1/2 right-8 w-4 h-4 bg-[#FFB302] rounded-full animate-pulse"></div>
                  </div>

                  {/* Main content */}
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

                  {/* Enhanced envelope flap */}
                  <div
                    className="envelope-flap absolute -top-1 left-1/2 -translate-x-1/2 w-40 h-20 bg-gradient-to-b from-[#FFB302] to-[#BC1F27] shadow-lg transition-all duration-500 group-hover:shadow-xl"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/30 rounded-full"></div>
                  </div>
                </button>
              </div>
            )}

            {/* Enhanced envelope open state */}
            {open && (
              <div className="envelope-open bg-white dark:bg-gray-800 rounded-3xl shadow-3xl transition-all duration-1000 animate-scale-in-up relative border-4 border-gradient-to-r from-[#FFB302] to-[#BC1F27] overflow-hidden max-h-[80vh]">
                {/* Header with close button */}
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

                {/* Content area with scroll */}
                <div className="p-8 overflow-y-auto max-h-96">
                  {/* Timeline dots decoration */}
                  <div className="absolute left-8 top-20 bottom-8 w-1 bg-gradient-to-b from-[#FFB302] to-[#BC1F27] opacity-20 hidden lg:block"></div>

                  <div className="relative">
                    {/* Key milestones */}
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

                    {/* Main story */}
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

export default HistorySection;
