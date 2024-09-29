import React from "react";

function Send({size, color}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      version="1.1"
      viewBox="0 0 30 30"
    >
      <g transform="translate(0 -289.063)">
        <path
          fill={color}
          fillOpacity="1"
          stroke="none"
          strokeDasharray="none"
          strokeMiterlimit="4"
          strokeOpacity="1"
          strokeWidth="2"
          d="M25.5 304.063c0-1.12-1-1.5-1-1.5l-20-8 3.604 8.56 9.396.94-9.396.939-3.604 8.56 20-8s1-.38 1-1.5z"
          opacity="1"
        ></path>
      </g>
    </svg>
  );
}

export default Send;