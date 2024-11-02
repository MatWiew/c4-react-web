import React, { useEffect, useState } from "react";

interface SponsorData {
  src: string;
  alt: string;
}

const isPrime = (num: number) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const SponsorSection: React.FC = () => {
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sponsors");
        if (!response.ok) {
          throw new Error("Failed to fetch sponsors");
        }
        const data = await response.json();
        const sponsorData = data.map(
          (sponsor: { name: string; image_url: string }) => ({
            src: sponsor.image_url,
            alt: sponsor.name,
          })
        );
        setSponsors(sponsorData);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };

    fetchSponsors();
  }, []);

  const renderSponsors = () => {
    const totalSponsors = sponsors.length;

    if (totalSponsors === 0) {
      return <p className="text-center text-white">No sponsors available.</p>;
    }

    if (totalSponsors === 1) {
      return sponsors.map((sponsor, index) => (
        <div key={index} className="flex w-1/2 mx-auto flex-wrap">
          <div className="w-full p-1 md:p-2">
            <img
              alt={sponsor.alt}
              src={sponsor.src}
              className="block h-full w-full rounded-lg object-cover object-center"
            />
          </div>
        </div>
      ));
    }
    if (totalSponsors === 2 || totalSponsors === 4) {
      return sponsors.map((sponsor, index) => (
        <div key={index} className="flex w-1/2 flex-wrap">
          <div className="w-full p-1 md:p-2">
            <img
              alt={sponsor.alt}
              src={sponsor.src}
              className="block h-full w-full rounded-lg object-cover object-center"
            />
          </div>
        </div>
      ));
    }

    if (totalSponsors === 5) {
      return sponsors.map((sponsor, index) => {
        const isTwoColumnLastRow = index >= 3;
        return (
          <div
            key={index}
            className={`flex ${
              isTwoColumnLastRow ? "w-1/2" : "w-1/3"
            } flex-wrap`}
          >
            <div className="w-full p-1 md:p-2">
              <img
                alt={sponsor.alt}
                src={sponsor.src}
                className="block h-full w-full rounded-lg object-cover object-center"
              />
            </div>
          </div>
        );
      });
    }

    if (totalSponsors % 3 == 0)
      return sponsors.map((sponsor, index) => {
        return (
          <div key={index} className="flex w-1/3 flex-wrap">
            <div className="w-full p-1 md:p-2">
              <img
                alt={sponsor.alt}
                src={sponsor.src}
                className="block h-full w-full rounded-lg object-cover object-center"
              />
            </div>
          </div>
        );
      });

    if (totalSponsors >= 7 && isPrime(totalSponsors)) {
      let x = 0;
      if (
        totalSponsors === 11 ||
        totalSponsors === 17 ||
        totalSponsors === 23
      ) {
        x = 2;
      } else {
        x = 4;
      }
      return sponsors.map((sponsor, index) => {
        const isLastTwoRows = index >= totalSponsors - x; // Check if in the last two rows
        return (
          <div
            key={index}
            className={`flex ${isLastTwoRows ? "w-1/2" : "w-1/3"} flex-wrap`}
          >
            <div className="w-full p-1 md:p-2">
              <img
                alt={sponsor.alt}
                src={sponsor.src}
                className="block h-full w-full rounded-lg object-cover object-center"
              />
            </div>
          </div>
        );
      });
    }

    if (totalSponsors % 2 === 0) {
      let x = 0;
      if (
        totalSponsors === 10 ||
        totalSponsors === 6 ||
        totalSponsors === 14 ||
        totalSponsors === 18
      ) {
        x = 4;
      } else {
        x = 2;
      }
      return sponsors.map((sponsor, index) => {
        const isLastTwoRows = index >= totalSponsors - x; // Check if in the last two rows
        return (
          <div
            key={index}
            className={`flex ${isLastTwoRows ? "w-1/2" : "w-1/3"} flex-wrap`}
          >
            <div className="w-full p-1 md:p-2">
              <img
                alt={sponsor.alt}
                src={sponsor.src}
                className="block h-full w-full rounded-lg object-cover object-center"
              />
            </div>
          </div>
        );
      });
    }
  };

  return (
    <section className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
      <h2 className="z-10 mt-0 md:text-[3rem] text-[2rem] font-black text-center text-white mb-12">
        Nasi sponsorzy:
      </h2>
      <div className="m-1 flex flex-wrap md:-m-2">{renderSponsors()}</div>
    </section>
  );
};

export default SponsorSection;
