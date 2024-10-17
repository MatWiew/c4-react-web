import React, { useEffect, useState } from "react";
import SponsorImage from "./SponsorImage";

interface SponsorData {
  src: string;
  alt: string;
  className: string;
}

const SponsorSection: React.FC = () => {
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);

  // Fetch sponsors from the backend
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sponsors"); // Update the URL to your endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch sponsors");
        }
        const data = await response.json();
        // Assuming data is an array of objects { name: string, imageUrl: string }
        const sponsorData = data.map(
          (sponsor: { name: string; image_url: string }) => ({
            src: sponsor.image_url,
            alt: sponsor.name,
            className: "w-6/12 max-md:w-full", // You can customize this per sponsor if needed
          })
        );
        setSponsors(sponsorData);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };

    fetchSponsors();
  }, []);

  return (
    <section className="flex flex-col items-center">
      <h2 className="z-10 mt-0 md:text-[3rem] text-[2rem] font-black text-center text-white">
        Nasi sponsorzy:
      </h2>
      <div className="mt-12 w-full max-w-[881px]">
        <div className="flex gap-5">
          {sponsors.slice(0, 2).map((sponsor, index) => (
            <SponsorImage key={index} {...sponsor} />
          ))}
        </div>
      </div>
      <div className="self-stretch mt-16 w-full">
        <div className="flex gap-5">
          {sponsors.slice(2).map((sponsor, index) => (
            <SponsorImage key={index + 2} {...sponsor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorSection;
