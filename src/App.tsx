import React from "react";
import { Routes, Route, useLocation, Router } from "react-router-dom";
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
import CollegePortal from "./components/CollegePortal";
import SeniorHighPortal from "./components/SeniorHighPortal";
import { useEffect } from "react";
import ViewGrades from "./viewgrades";
import ViewGradesSH from "./ViewGradesSH";
import TeachersPortal from "./components/TeachersPortal";
import AdminPortal from "./components/AdminPortal";

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
        <Route path="/CollegePortal" element={<CollegePortal />} />
        <Route path="/regular" element={<Regular />} />
        <Route path="/sunday" element={<Sunday />} />
        <Route path="/seniorhigh" element={<SeniorHigh />} />
        <Route path="/viewgrades" element={<ViewGrades />} />
        <Route path="/SeniorHighPortal" element={<SeniorHighPortal/>}/>
        <Route path="/viewgradesSH" element={<ViewGradesSH />} />
        <Route path="/TeachersPortal" element={<TeachersPortal />} />
        <Route path="/AdminPortal" element={<AdminPortal />} />
      </Routes>
    </>
  );
};

export default App;
