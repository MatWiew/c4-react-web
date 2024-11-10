import React from "react";

interface PawnProps {
  size?: number;
  className?: string;
  color?: string;
}

const Pawn: React.FC<PawnProps> = ({ size = 24, className }) => {
  const aspectRatio = 9 / 14;
  const width = size * aspectRatio;

  return (
    <svg
      width={width}
      height={size}
      fill="none"
      viewBox="0 0 16 26"
      className={className}
    >
      <g id="layer1" transform="translate(-339.68 -80.326)">
        <image
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAA+CAYAAAC2szLVAAAABHNCSVQICAgIfAhkiAAABO9JREFU aIHNmu1V4zgUhh85/CdbwWoL2MGpYDIVwFYAUwFMBWQrmEwFhApgKkioQHamADwVJBSA7/6QHDvO lyQnnH3P4cQfV76vr3S/ZBRdIUbD2TWUV4AG+u5OBqoAeYbyBTUoYlWobgR/3UM5ciczUM9Q5u6u BnUJ6gooIJmg/v63k75wgvMHJBckf0XMcLec0Ug2tbLz7x9J8LtVmj0hpr9532hk/oTkY7scADEj O+bX/QcQNDcrgvvlNJIbJF8g5m6d6B7LH4dkNnVTvGnBrfItC0o2RebTExI02q3D68BxzvrmDjFD d5yeiuQNkr9Gjh0j+cIe5wskH/sOTQJV6UaICYMa3EH51Z3MAO/ZiCCpFoFjaqjBsz14fwP6vus6 lGQRKL8DvXMA1GDpIx1BUg0Dx2yBaDflXggl+QzoqDgn+a39NRpIQSbBz/BXZiZIbgLH3KzGSD4J jRChlgQYATosD6tLKP9BzBXWq0cRegMh5i6oYBDTR8yVi49xcTYKNji7Kii/3hlObIaZONnwbEXn ejKbrnu7mgFLKJeQ9EFSbCHcQPmHb+ipcBZOzPQBV4UngDRvOsKqdX1N5S1iHkMq9TBLSn7P+qJf ghRABvIbG+yX7q8Nbf/UZ2t9NUZ9+hak/zDBqpLJF7b86lAT2nW6QOaXPuIh053apkq+hq6pDajB DJnP4H0A/DwkHhgn1RZHiICYoV2/iVc4CiHp6r/E2LAT0auISW1VnkyxUeDFZ1ig4xgNDCG5xzrB FerTwemqxyYunZaPwLhLL+6nUPIFkj14yNogX+XsqnsMQEzuxlqgfITER+GN+/0MjGKsF0fSIgPx qKzVhbOm9l2DbXQhCfW+zyFoYBm7BruQ9FSYaOzLRMfWrpb0QFm4A1+rb+ADSEqOtaJ3d9hGF5K+ UzhpyOkYRV1IalCHSapB02GGMYo6knx/C5DPoOdV9bTRgaS6gKTwly9fQNKYdRlHUox2bUNIa/uM Xcc3oepiLTm0PwGbV2owA5aQ3EbqDIAtLl6jWtNVK5yPjk9sTdH8KbY1teOrTf5TbKLazfqp1375 /uf03UwsfF90f9Er+a11ENFA9eYFlF86Fax1Adxn9VHq/duuZ+4mKSatK+k1ZCBZNMFa9ZD1DFTs evl93eKuNZO6hqzRX0u7195Q1ELf9uuqT114aOg9AF/awnssudpCWbqeJANm2LqwW0u7psekrjGr yN6gLh59BuouG0zBqDe/ZNve545gnozqY48iojuaOtL27sjmdFvPawbqAvgJ5cw9rOCYU271TVl3 oh+oi7vqZIvjNK0IbvCtS2eFe/ISySqn+V1fbzpTbwHv+er6tpeyxUaV05s3zptnWyyZv1I1TtZh ZkB22kYe50DcQXLtdP+1fbbqnTMTW+p3xsH8HvoF9lRYeXs7v6/CTvg2yNFh8/ui+uTcDEFDoDj5 2vOBGixt6pUhYnTDu3uXINoF0zGUOWpwhBwdCLvUUlDaXRnW3l17dRsFsGwEdfd14VhIXP6WKo+3 OJTfLMnNAL4POzbuN4oMjzEbcASVro/5cbZ+c62YKGgG6WMWFT5YZSI5r0imQIa6GHwokX1QgwIx L9DTlXdrWx3/36D+BKm8W11Yd59P4f2F3R+NiiOzaBa9sFp2SbriRJW77X+ZNIU9yMghmQP35Y3D zlQA/AftuqaYR4KHEgAAAABJRU5ErkJggg=="
          id="image45813"
          width="10.848"
          height="16.404"
          x="434.276"
          y="70.161"
          preserveAspectRatio="none"
        ></image>
        <path
          id="path46725"
          fill="#ff6200"
          fillOpacity="1"
          stroke="#000"
          strokeDasharray="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4"
          strokeWidth="0.162"
          d="M20.311 1.267c-4.136.441-8.1 4.06-7.925 8.403.08 3.592 3.171 6.605 6.673 6.987 2.53.31 5.34-.086 7.19-2.002 2.248-2.183 2.571-5.86.96-8.5-1.265-2.139-3.239-3.992-5.627-4.769a4.2 4.2 0 0 0-1.27-.12m1.642 1.565c1.875.455 3.515 1.704 4.838 3.074.502.463.8 1.931-.213 1.883-1.714-.617-3.003-2.065-4.21-3.379-.305-.454-.939-.98-.817-1.545.127-.049.27-.03.402-.033m3.911 9.381c.622.134.16 1.136-.076 1.466-.365.395-.788 1.006-1.297 1.13-.127-.845.379-1.798.935-2.436a.6.6 0 0 1 .438-.16"
          paintOrder="markers stroke fill"
          transform="matrix(.26458 0 0 .26458 339.68 80.326)"
        ></path>
        <path
          id="path46764"
          fill="#ff6200"
          fillOpacity="1"
          stroke="#000"
          strokeDasharray="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4"
          strokeWidth="0.162"
          d="M21.843 19.136c-3.243.11-6.541.539-9.577 1.72-.697.239-1.34 1.376-.378 1.726 1.016.227 2.262.446 2.666 1.578.87 2.44.67 5.112.609 7.66-.14 3.414-1.3 6.668-2.63 9.77 3.088.275 6.224.094 9.33.153h7.473c-1.466-1.547-2.97-3.24-3.32-5.425-.643-3.296-.95-6.69-.727-10.044.078-1.845 1.919-2.624 3.085-3.728.692-.523.978-1.634.116-2.17-1.884-1.296-4.46-1.197-6.647-1.24m1.886 7.467c.544.871.413 2.066.376 3.073-.132.4-.013 1.223-.437 1.387-.378-1.105-.145-2.375-.18-3.54.068-.264-.07-.783.241-.92"
          paintOrder="markers stroke fill"
          transform="matrix(.26458 0 0 .26458 339.68 80.326)"
        ></path>
        <path
          id="path46803"
          fill="#ff6200"
          fillOpacity="1"
          stroke="#000"
          strokeDasharray="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4"
          strokeWidth="0.162"
          d="M23.339 43.952c-4.653.084-9.354-.108-13.957.685-.743.21-1.852.404-2.119 1.211.485 1.091 1.953 1.1 2.945 1.409 3.031.632 6.307.734 9.251 1.258-4.69.426-9.736-.23-14.036 2.11-.92.541-2.377 1.513-1.842 2.763.904.905 2.378.743 3.557.95 7.868.713 15.777.437 23.662.266 2.067-.172 4.207-.187 6.193-.817.489-.43-.286-1.13-.408-1.589-.937-1.374-2.156-2.809-3.807-3.278-1.13-.1-.986-1.634-.861-2.45.107-.848.262-1.69.473-2.519q-4.525-.001-9.051.001"
          paintOrder="markers stroke fill"
          transform="matrix(.26458 0 0 .26458 339.68 80.326)"
        ></path>
        <path
          id="path46842"
          fill="#ff6200"
          fillOpacity="1"
          stroke="#000"
          strokeDasharray="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4"
          strokeWidth="0.162"
          d="M22.125 56.954c-5.197.095-10.419-.092-15.595.469-1.307.258-2.807.19-3.927.979-.571.898.842 1.51 1.555 1.576 7.443.8 14.948.775 22.426.75 3.185-.097 6.406.019 9.56-.494.988-.17 2.253-1.131 1.88-2.242-1.01-.843-2.496-.655-3.733-.837-4.048-.263-8.111-.19-12.166-.201"
          paintOrder="markers stroke fill"
          transform="matrix(.26458 0 0 .26458 339.68 80.326)"
        ></path>
      </g>
    </svg>
  );
};

export default Pawn;
