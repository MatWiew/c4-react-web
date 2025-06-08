import React, { forwardRef, useState, useEffect } from "react";
import King from "../assets/King";
import QuestionMark from "../assets/QuestionMark";

const About = forwardRef<HTMLDivElement>((props, ref) => {
  const [kingSize, setKingSize] = useState(
    window.innerWidth > 1023 ? 385 : 290
  );
  const [questionMarkSize, setQuestionMarkSize] = useState(
    window.innerWidth > 1023 ? 400 : 320
  );
  const [bp, setBp] = useState(
    window.innerWidth > 1023 ? true : false
  );

  useEffect(() => {
    const handleResize = () => {
      setKingSize(window.innerWidth > 1023 ? 385 : 290);
      setQuestionMarkSize(window.innerWidth > 1023 ? 400 : 320);
      setBp(window.innerWidth > 1023 ? true : false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div ref={ref} id="about" className="relative lg:top-[1950px] md:top-[1300px] top-[1400px] flex w-full justify-center snap-start">
        <div className="flex items-center lg:max-w-[525px] lg:mt-[457px] mt-[20rem]">
          <div className="text-center">
            <div className="lg:text-5xl text-4xl italic font-black text-white lg:max-w-[45vw] max-w-[100vw]">
              Kim jesteśmy
            </div>
            <div className="lg:mt-10 mt-5 lg:text-lg text-sm leading-7 text-zinc-400 lg:max-w-[45vw] max-lg:h-[300px] max-w-[100vw] mx-9 lg:mx-0">
            Fundacja C4 to klub szachowy mający na celu zrzeszanie szachistów i popularyzowanie gry w szachy. Nasza misja to wspieranie rozwoju umiejętności strategicznych i intelektualnych wśród graczy w każdym wieku. Organizujemy turnieje, warsztaty i treningi, aby doskonalić techniki gry i budować społeczność pasjonatów szachów.
            </div>
          </div>
          <QuestionMark size={questionMarkSize} isLargeBreakpoint={bp}/>
        </div>
        <div className="lg:mt-[457px] mt-[300px] lg:ml-[20vw] hidden lg:block">
          <King size={kingSize} />
        </div>
      </div>
    </>
  );
});

About.displayName = "About";

export default About;
