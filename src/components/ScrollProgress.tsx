"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useScroll } from "framer-motion";

interface Section {
  id: string;
  label: string;
  position: number; // 0–1
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState("");

  const updateSections = useCallback(() => {
    const sectionEls = document.querySelectorAll("section[id]");
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const mapped: Section[] = [];
    sectionEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      mapped.push({
        id: el.id,
        label: el.getAttribute("data-label") || el.id,
        position: top / docHeight,
      });
    });
    setSections(mapped);
  }, []);

  useEffect(() => {
    updateSections();
    window.addEventListener("resize", updateSections);

    // Also update after a delay for dynamic content
    const timer = setTimeout(updateSections, 1000);

    // Track active section
    function onScroll() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = window.scrollY / docHeight;

      const sectionEls = document.querySelectorAll("section[id]");
      let current = "";
      sectionEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
          current = el.id;
        }
      });
      setActiveSection(current);
      void progress;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", updateSections);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [updateSections]);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      {/* Main progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: "linear-gradient(90deg, #00897B, #4DB6AC)",
        }}
      />

      {/* Section markers on the progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[61] h-[3px] pointer-events-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="absolute top-1/2 -translate-y-1/2 group"
            style={{ left: `${section.position * 100}%` }}
            title={section.label}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-mannatech border-mannatech scale-125"
                  : "bg-white border-mannatech/40 hover:border-mannatech hover:scale-125"
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
}
