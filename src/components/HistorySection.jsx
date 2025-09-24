import React, { useState } from "react";

export default function HistorySection() {
  const [open, setOpen] = useState(false);
  return (
    <section className="w-full py-16 px-4 bg-gradient-to-b from-white via-[#ffe5d0] to-[#fff7f0] dark:from-gray-900 dark:via-[#7b1112]/10 dark:to-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10 text-[#7b1112] dark:text-[#FFB302]">
          History of Philtech
        </h2>
        <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
          <div className="relative w-full sm:w-2/3 md:w-1/2 flex flex-col items-center">
            {/* Envelope closed state */}
            {/* Envelope closed state */}
            {!open && (
              <button
                className="envelope-closed w-full h-40 sm:h-48 md:h-56 bg-gradient-to-br from-[#fff7f0] to-[#ffe5d0] dark:from-gray-800 dark:to-[#7b1112]/30 rounded-2xl shadow-xl flex flex-col items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up border-2 border-[#FFB302] dark:border-[#BC1F27]"
                onClick={() => setOpen(true)}
                aria-label="Open history envelope"
              >
                {/* Logo with bounce animation */}
                <img
                  src="/assets/images/logo/logo.png"
                  alt="Philtech Logo"
                  className="w-16 h-16 mb-2 animate-bounce"
                />
                <span className="text-lg sm:text-xl font-bold text-[#BC1F27] dark:text-[#FFB302]">
                  Tap to open
                </span>
                <span className="text-xs text-gray-500 mt-1">(History of Philtech)</span>
                <div
                  className="envelope-flap absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-[#FFB302] rounded-b-3xl z-10"
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                />
              </button>
            )}
            {/* Envelope open state (expanded card) */}
            {open && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-all duration-700 animate-fade-in-up relative z-20 border-2 border-[#FFB302] dark:border-[#BC1F27] scale-100 overflow-y-auto" style={{width: '1000px', maxHeight: '350px'}}>
                <button
                  className="absolute top-3 right-3 text-2xl text-[#BC1F27] dark:text-[#FFB302] bg-white dark:bg-gray-800 w-8 h-8 flex items-center justify-center shadow transition-colors group"
                  onClick={() => setOpen(false)}
                  aria-label="Close history envelope"
                  style={{ borderRadius: '50%' }}
                >
                  <span className="transition-colors group-hover:text-[goldenrod]">&times;</span>
                </button>
                <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed text-justify">
                  Philippine Technological Institute of Science Arts and Trade Inc., founded in 2010 as a non-stock non-profit non-sectarian private Educational Institution to blaze the trail in the field of technical education. Its eleven founders were a mixture of engineers, a scientist/ inventor and practitioner in the IT industry, school administrators, managers and academic professionals in both public and private institutions. Today, the school is more popularly known as PHILTECH. The first school was established in November of 2010 and is presently located at F.T. Catapusan St. in Tanay, Rizal. In June 2011, Philippine Technological Institute of Science Arts and Trade Inc. opened and offered two-year programs in Information Technology, Hotel and Restaurant Services, and Business Outsourcing Management. With every member of the Board of Trustees, going out of their way to promote the school and its program offerings, the first semester of school year 2011-2012 continued to provide the same educational services with additional programs accredited by the Technical Education and Skills Development Authority Rizal. The first batch of graduates marched onto their commencement exercises on April 5, 2013 with no less than the TESDA Rizal Provincial Office Director Velma A. Salazar as their graduation guest of honor. By November of 2012, the negotiation for additional branches went underway. The Board of Trustees resolved that two new PHILTECH branches should be established and operated in Sta. Rosa, Laguna and General Mariano Alvarez, Cavite. Both branches open in the first semester of school year 2013 2014. With Tanay (560 students), Sta. Rosa branch (350 students) and GMA branch (250) students, school year 2013 2014, and with a very dynamic and credible faculty and staff in its roster, PHILTECH is set to render its services again to at least 1160 students who decided to entrust their quest for excellence in the field of education and training in our hands. To answer the need of the community for learning, by the year 2021, one of the branches of the institution, GMA branch, offered its first bachelors program, Bachelor in Technical Vocational Teacher Education Major in Food and Beverage Management. With its quality instructors and facilities, the institution applied for additional programs to be offered. By the school year 2022-2023, with 103 students, started to roll out for the Bachelor of Science in Computer Science and Bachelor of Science in Office Administration. To date, the institution has been giving its best in proving its objective to provide global success through academic excellence with the admiration to knowledge and appreciation to skills. PhilTech never tires from helping our Filipino youth. It is patriotic. As educators, it is always fulfilling to mold young minds into productive citizens. Indeed, it is always a blessing.
                </p>
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
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .envelope-flap {
          transition: all 0.5s cubic-bezier(.4,2,.6,1);
        }
        .envelope-closed {
          position: relative;
          overflow: visible;
        }
      `}</style>
    </section>
  );
}
