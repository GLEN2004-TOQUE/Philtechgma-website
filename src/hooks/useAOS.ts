import { useState, useEffect } from "react";

export function useAOS(): [boolean, () => void] {
  const [isAnimated, setIsAnimated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedState = window.localStorage.getItem("aosEnabled");
      return savedState ? JSON.parse(savedState) : true;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isAnimated) {
        document.documentElement.classList.add("aos-enabled");
        window.localStorage.setItem("aosEnabled", JSON.stringify(true));
        
        // Initialize AOS when enabled
        initializeAOS();
      } else {
        document.documentElement.classList.remove("aos-enabled");
        window.localStorage.setItem("aosEnabled", JSON.stringify(false));
        
        // Disable AOS animations
        disableAOS();
      }
    }
  }, [isAnimated]);

  const initializeAOS = () => {
    // Add CSS for AOS animations
    if (!document.querySelector('#aos-styles')) {
      const style = document.createElement('style');
      style.id = 'aos-styles';
      style.textContent = `
        .aos-enabled [data-aos] {
          opacity: 0;
          transition: all 0.6s ease;
        }
        
        .aos-enabled [data-aos].aos-animate {
          opacity: 1;
          transform: translateY(0) translateX(0) scale(1) rotate(0deg);
        }
        
        /* Fade animations */
        .aos-enabled [data-aos="fade-up"] {
          transform: translateY(30px);
        }
        
        .aos-enabled [data-aos="fade-down"] {
          transform: translateY(-30px);
        }
        
        .aos-enabled [data-aos="fade-left"] {
          transform: translateX(30px);
        }
        
        .aos-enabled [data-aos="fade-right"] {
          transform: translateX(-30px);
        }
        
        /* Zoom animations */
        .aos-enabled [data-aos="zoom-in"] {
          transform: scale(0.5);
        }
        
        .aos-enabled [data-aos="zoom-out"] {
          transform: scale(1.5);
        }
        
        /* Slide animations */
        .aos-enabled [data-aos="slide-up"] {
          transform: translateY(100%);
        }
        
        .aos-enabled [data-aos="slide-down"] {
          transform: translateY(-100%);
        }
        
        /* Flip animations */
        .aos-enabled [data-aos="flip-left"] {
          transform: perspective(2500px) rotateY(-100deg);
        }
        
        .aos-enabled [data-aos="flip-right"] {
          transform: perspective(2500px) rotateY(100deg);
        }
      `;
      document.head.appendChild(style);
    }

    // Initialize intersection observer for AOS
    setupIntersectionObserver();
  };

  const disableAOS = () => {
    // Remove all AOS animations and reset elements
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(el => {
      el.classList.remove('aos-animate');
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
  };

  const setupIntersectionObserver = () => {
    const elements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        } else {
          // Remove animation when element leaves viewport to enable re-triggering on scroll up
          entry.target.classList.remove('aos-animate');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));

    // Cleanup function
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  };

  const toggleAOS = () => {
    setIsAnimated((prev: boolean) => !prev);
  };

  return [isAnimated, toggleAOS];
}

// Additional helper hook for individual element AOS
export function useElementAOS() {
  useEffect(() => {
    const element = document.querySelector('[data-aos]');
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    }, { threshold: 0.1 });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);
}