import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./components/Menu";
import About from "./components/About";
import Chess from "./components/Chess";
import News from "./components/News";
import useInView from "./hooks/useInView";
import Tournaments from "./components/Tournaments";
import Club from "./components/Club";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FootEnd from "./components/FooterComponents/FootEnd";

const App: React.FC = () => {
  const navigate = useNavigate();

  // Create refs for each section
  const aboutRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);
  const tournamentsRef = useRef<HTMLDivElement>(null);
  const clubRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Map section names to their refs
  const refs: Record<string, React.RefObject<HTMLDivElement>> = {
    about: aboutRef,
    news: newsRef,
    tournaments: tournamentsRef,
    club: clubRef,
    shop: shopRef,
    contact: contactRef,
  };

  // Get the active section
  const activeSection = useInView(refs);

  // Update URL based on the active section
  useEffect(() => {
    if (activeSection) {
      const pathMap: { [key: string]: string } = {
        about: "/",
        news: "/news",
        tournaments: "/tournaments",
        club: "/club",
        shop: "/shop",
        contact: "/contact",
      };
      navigate(pathMap[activeSection]);
    }
  }, [activeSection, navigate]);

  const scrollToDesiredContent = (section: string): Promise<void> => {
    return new Promise((resolve) => {
      const ref = refs[section as keyof typeof refs];
      if (ref && ref.current) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              resolve();
              observer.disconnect();
            }
          });
        });

        observer.observe(ref.current);
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        resolve(); // Resolve immediately if ref is not available
      }
    });
  };

  return (
    <div className="App lg:h-[7743px] h-[4443px] snap-y snap-mandatory">
      <div className="min-h-full flex flex-col justify-between">
        <main className="flex-grow">
          <Menu
            scrollToDesiredContent={scrollToDesiredContent}
            activeSection={activeSection}
          />
          <About ref={aboutRef} />
          <Chess />
          <News ref={newsRef} />
          <Tournaments ref={tournamentsRef} />
          <Club ref={clubRef} />
          <Contact ref={contactRef} />
          <Footer />
        </main>

        <div className="relative">
          <FootEnd
            scrollToDesiredContent={scrollToDesiredContent}
            activeSection={activeSection}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
