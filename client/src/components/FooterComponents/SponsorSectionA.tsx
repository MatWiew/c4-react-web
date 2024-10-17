import React, { useEffect, useState } from "react";
import SponsorImage from "./SponsorImage";

interface SponsorData {
  src: string;
  alt: string;
  className: string;
  _id: string; // Add an id field for deletion
}

const SponsorSectionA: React.FC = () => {
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);

  // Fetch sponsors from the backend
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sponsors");
        if (!response.ok) {
          throw new Error("Failed to fetch sponsors");
        }
        const data = await response.json();
        const sponsorData = data.map(
          (sponsor: { _id: string; name: string; image_url: string }) => ({
            src: sponsor.image_url,
            alt: sponsor.name,
            className: "w-6/12 max-md:w-full",
            _id: sponsor._id,
          })
        );
        setSponsors(sponsorData);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };

    fetchSponsors();
  }, []);

  const handleDelete = async (_id: string) => {
    if (window.confirm("Are you sure you want to delete this sponsor?")) {
      try {
        console.log(_id);
        const response = await fetch(
          `http://localhost:5000/api/sponsors/${_id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Failed to delete sponsor");

        // Update the sponsors list after deletion
        setSponsors((prev) => prev.filter((sponsor) => sponsor._id !== _id));
      } catch (error) {
        console.error("Error deleting sponsor:", error);
      }
    }
  };

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
              {...sponsor}
              onDelete={() => handleDelete(sponsor._id)}
            />
          ))}
        </div>
      </div>
      <div className="self-stretch mt-16 w-full">
        <div className="flex gap-5 cursor-pointer">
          {sponsors.slice(2).map((sponsor) => (
            <SponsorImage
              key={sponsor._id}
              {...sponsor}
              onDelete={() => handleDelete(sponsor._id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorSectionA;
