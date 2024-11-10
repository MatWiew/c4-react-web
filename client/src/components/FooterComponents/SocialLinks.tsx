import React from "react";
import { motion } from "framer-motion";

interface SocialLinkProps {
  name: string;
  iconSrc: string;
  href: string;
}

const socialLinks: SocialLinkProps[] = [
  {
    name: "Facebook",
    iconSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/c5b431f3a591143155288a64bd8931615ad78e2fa40bfb9c9c7fc1963b79af7c?placeholderIfAbsent=true&apiKey=3d4b1e2fe5494ed690d3adef16496114",
    href: "https://www.facebook.com/profile.php?id=100057633067673",
  },
  {
    name: "Instagram",
    iconSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/dd5ee00dcf3b145434d310f74b178759b68745e02efbfb3ea9da8b3a95088bbc?placeholderIfAbsent=true&apiKey=3d4b1e2fe5494ed690d3adef16496114",
    href: "https://www.instagram.com/klub.szachowy.c4/",
  },
  {
    name: "Youtube",
    iconSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/fdce96ad0c83b2525b18f0bbe54823998b3b625a140dfbd5042ff833d86fddc0?placeholderIfAbsent=true&apiKey=3d4b1e2fe5494ed690d3adef16496114",
    href: "#",
  },
];

const SocialLink: React.FC<SocialLinkProps> = ({ name, iconSrc, href }) => {
  return (
    <motion.a
      initial={{ scale: 1, filter: "brightness(1)" }}
      whileHover={{ scale: 1.1, filter: "brightness(0.7)" }}
      transition={{ type: "spring", stiffness: 300 }}
      href={href}
      className="flex xl:text-[1.3rem] text-[2vw] gap-2.5 items-center p-3 mt-5 border border-solid border-white border-opacity-30 rounded-[149px] max-md:pl-5 text-white hover:no-underline hover:text-current min-w-[120px]"
    >
      <img
        loading="lazy"
        src={iconSrc}
        alt={`${name} icon`}
        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[30px]"
      />
      <span className="self-stretch my-auto">{name}</span>
    </motion.a>
  );
};

const SocialLinks: React.FC = () => {
  return (
    <div className="flex flex-col text-xl font-base ml-4 max-md:mr-[6vw] mt-7">
      <div className="flex flex-col leading-none text-white whitespace-nowrap">
        {socialLinks.map((link, index) => (
          <SocialLink key={index} {...link} />
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
