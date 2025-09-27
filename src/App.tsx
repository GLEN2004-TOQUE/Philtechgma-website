import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar, Carousel, CampusSection, HistorySection, OngoingEventsSection, TestimonialsSection, EnrollmentCTASection, Footer } from "./components/home";
import { useAOS } from "./hooks/useAOS";
import About from "./components/about";
import Faculties from "./components/faculties";
import Events from "./components/events";
import EnrollmentProcess from "./components/enrollment-process";
import Contact from "./components/contacts";
import Developer from "./components/developer";
import Regular from "./components/regular";
import Sunday from "./components/sunday";
import SeniorHigh from "./components/seniorhigh";
import Login from "./dblogin/login";

const Home: React.FC = () => {
  useAOS(); // Enable AOS animations

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
      <Route path="/faculties" element={<Faculties />} />
      <Route path="/events" element={<Events />} />
      <Route path="/enrollment-process" element={<EnrollmentProcess />} />
      <Route path="/contacts" element={<Contact />} />
      <Route path="/developer" element={<Developer />} />
      <Route path="/dblogin/login" element={<Login />} />
      <Route path="/programs/college/regular" element={<Regular />} />
      <Route path="/programs/college/sunday" element={<Sunday />} />
      <Route path="/programs/senior" element={<SeniorHigh />} />
    </Routes>
  );
};

export default App;
