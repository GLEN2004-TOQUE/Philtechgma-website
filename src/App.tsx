import React from "react";
import { Navbar, Carousel, CampusSection, HistorySection, OngoingEventsSection, TestimonialsSection, EnrollmentCTASection, Footer } from "./components/home";

const App: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <Navbar />
      <Carousel />
      <HistorySection />
      <CampusSection />
      <OngoingEventsSection/>
      <TestimonialsSection/>
      <EnrollmentCTASection/>
      <Footer />
    </div>
  );
};

export default App;
