import { useEffect, useState } from "react";

export const useActiveSection = (sectionIds: string[], offsetHtmlPx = 100) => {
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offsetHtmlPx;

      // Check which section is currently active based on vertical scroll positions
      for (const sectionId of sectionIds) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds, offsetHtmlPx]);

  return activeSection;
};
