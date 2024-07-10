import React from "react";
import King from "../assets/King";
import QuestionMark from "../assets/QuestionMark";

function About() {
  return (
    <>
      <div className="flex flex-col mx-12 pt-20 w-full max-h-[385px] relative">
        <div className="relative">
          <div className="mt-20 w-full text-5xl italic font-black text-white relative">
            Kim jesteśmy
          </div>
          <div className="absolute inset-0 flex items-center">
            {/* Assuming QuestionMark is an SVG component */}
            <QuestionMark size={385} />
          </div>
          <div className="mt-14 w-full text-lg leading-7 text-zinc-400 max-w-[50vw] whitespace-pre-line">
            Informacje o nas i o klubie...
          </div>
          {/* Position the King component relative to its parent */}
          <div className="absolute top-0 right-0">
            {/* Assuming King is an SVG component */}
            <King size={385} />
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
