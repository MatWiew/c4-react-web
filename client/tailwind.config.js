// postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    // Add other PostCSS plugins here as needed
  ],
  // Specify where PostCSS should look for files to process
  // Adjust the `include` array to include your `src/components` directory
  // and any other directories containing CSS files that should be processed
  include: [
    'src/**/*.css', // Include CSS files in src directory and all subdirectories
    'src/**/*.pcss', // Include PostCSS files if used
    'src/components/**/*.css', // Include CSS files specific to components
    'src/components/**/*.pcss', // Include PostCSS files specific to components
    // Add more directories as needed
  ],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
};
