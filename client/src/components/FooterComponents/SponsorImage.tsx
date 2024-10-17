import React from "react";

interface SponsorImageProps {
  src: string;
  alt: string;
  className: string;
  onDelete?: () => void;
}

const SponsorImage: React.FC<SponsorImageProps> = ({
  src,
  alt,
  className,
  onDelete,
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <img
        loading="lazy"
        src={src}
        alt={alt}
        className="object-contain grow w-full aspect-[1.77] max-md:mt-10"
        onClick={onDelete}
      />
    </div>
  );
};

export default SponsorImage;
