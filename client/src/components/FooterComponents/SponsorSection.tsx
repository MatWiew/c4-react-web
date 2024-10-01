import React from "react";
import SponsorImage from "./SponsorImage";

interface SponsorData {
  src: string;
  alt: string;
  className: string;
}

const sponsorData: SponsorData[] = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9f7ff97a604df99f303f33342fa98419e6159504b7bb49b0b5660c77fee21c32?apiKey=3d4b1e2fe5494ed690d3adef16496114&",
    alt: "Sponsor 1",
    className: "w-6/12 max-md:w-full",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/76e6812683937fb49f19db8ee21db72820a701b08daba974a6f23bf60bcff9d8?apiKey=3d4b1e2fe5494ed690d3adef16496114&",
    alt: "Sponsor 2",
    className: "w-6/12 max-md:w-full",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/849a52b2283d03475e95008d30749024f3dbd76c270198e39aeb51d3a83c6e70?apiKey=3d4b1e2fe5494ed690d3adef16496114&",
    alt: "Sponsor 3",
    className: "w-[39%] max-md:w-full",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b6f163c1241103e2186443c3984397c0796cae8509f6c455a5f19cf86db46692?apiKey=3d4b1e2fe5494ed690d3adef16496114&",
    alt: "Sponsor 4",
    className: "w-[22%] max-md:w-full",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/81dd0bdd2b189245c181875c833d9a87b351a36e74091e92430cf2c3fb12f9f6?apiKey=3d4b1e2fe5494ed690d3adef16496114&",
    alt: "Sponsor 5",
    className: "w-[39%] max-md:w-full bg-white",
  },
];

const SponsorSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center">
      <h2 className="z-10 mt-0 text-6xl font-black text-center text-white max-md:max-w-full max-md:text-4xl">
        Nasi sponsorzy:
      </h2>
      <div className="mt-12 w-full max-w-[881px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          {sponsorData.slice(0, 2).map((sponsor, index) => (
            <SponsorImage key={index} {...sponsor} />
          ))}
        </div>
      </div>
      <div className="self-stretch mt-16 w-full max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          {sponsorData.slice(2).map((sponsor, index) => (
            <SponsorImage key={index + 2} {...sponsor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorSection;
