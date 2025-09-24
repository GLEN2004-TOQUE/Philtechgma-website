import React from "react";

import Navbar from "./components/Navbar";

import Carousel from "./components/Carousel";

import HistorySection from "./components/HistorySection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <Navbar />
      <Carousel />
      <HistorySection />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Main Content
        </h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          This is where the main content of the page will be displayed.
        </p>
      </main>
      <Footer />
    </div>
  );
}