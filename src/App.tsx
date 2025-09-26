import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar, Carousel, CampusSection, HistorySection, OngoingEventsSection, TestimonialsSection, EnrollmentCTASection, Footer } from "./components/home";
import About from "./components/about";

const Home: React.FC = () => {
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

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default App;
