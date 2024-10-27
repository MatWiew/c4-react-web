import React from "react";
import SponsorImage from "./SponsorImage";

interface SponsorData {
  src: string;
  alt: string;
  className: string;
  _id: string; // Add an id field for deletion
}

interface SponsorSectionAProps {
  sponsors: SponsorData[];
  onSponsorDelete: (id: string) => void; // Accept delete handler as a prop
}

const SponsorSectionA: React.FC<SponsorSectionAProps> = ({
  sponsors,
  onSponsorDelete,
}) => {
  return (
    <section className="flex flex-col items-center">
      <h2 className="z-10 mt-0 md:text-[3rem] text-[2rem] font-black text-center text-white">
        Nasi sponsorzy:
      </h2>
      <div className="mt-12 w-full max-w-[881px]">
        <div className="flex gap-5 cursor-pointer">
          {sponsors.slice(0, 2).map((sponsor) => (
            <SponsorImage
              key={sponsor._id}
              src={sponsor.src}
              alt={sponsor.alt}
              className={sponsor.className}
              onDelete={() => onSponsorDelete(sponsor._id)} // Call delete handler
            />
          ))}
        </div>
      </div>
      <div className="self-stretch mt-16 w-full">
        <div className="flex gap-5 cursor-pointer">
          {sponsors.slice(2).map((sponsor) => (
            <SponsorImage
              key={sponsor._id}
              src={sponsor.src}
              alt={sponsor.alt}
              className={sponsor.className}
              onDelete={() => onSponsorDelete(sponsor._id)} // Call delete handler
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorSectionA;
