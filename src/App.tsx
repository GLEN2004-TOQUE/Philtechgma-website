import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar, HeroBackground, CampusSection, HistorySection, NewsAndAnnouncementsSection, TestimonialsSection, EnrollmentCTASection, Footer } from "./components/home";
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
import VerifyEmail from "./dblogin/VerifyEmail";
import College from "./components/college";
import { useEffect } from "react";

const Home: React.FC = () => {
  useAOS(); // Enable AOS animations

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <Navbar />
      <HeroBackground />
      <HistorySection />
      <CampusSection />
      <NewsAndAnnouncementsSection/>
      <TestimonialsSection/>
      <EnrollmentCTASection/>
      <Footer />
    </div>
  );
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/faculties" element={<Faculties />} />
        <Route path="/events" element={<Events />} />
        <Route path="/enrollment-process" element={<EnrollmentProcess />} />
        <Route path="/contacts" element={<Contact />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="/dblogin/login" element={<Login />} />
        <Route path="/dblogin/verify-email" element={<VerifyEmail />} />
        <Route path="/college-portal" element={<College />} />
        <Route path="/regular" element={<Regular />} />
        <Route path="/sunday" element={<Sunday />} />
        <Route path="/seniorhigh" element={<SeniorHigh />} />
      </Routes>
    </>
  );
};

export default App;
