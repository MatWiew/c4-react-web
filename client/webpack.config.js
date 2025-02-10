const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'; // Check if running in production mode

  return {
    entry: './src/index.tsx', // Your client-side entry point (React app)
    output: {
      filename: isProduction ? '[name].[contenthash].js' : '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true, // Clean the output folder before each build
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/, // Handle TypeScript files
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.js$/, // Transpile JavaScript with Babel (for React, ES6+)
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/, // Handle CSS files
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'], // Resolve TypeScript and JavaScript files
    },
    optimization: {
      minimize: isProduction, // Minify only in production
      minimizer: isProduction ? [new TerserPlugin()] : [], // Apply TerserPlugin in production only
    },
    devtool: isProduction ? false : 'inline-source-map', // Source maps in development mode
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'), // Serve files from the dist folder
      compress: true, // Enable gzip compression
      port: 8080, // Port for the dev server
      hot: true, // Enable Hot Module Replacement (HMR)
      open: true, // Automatically open the browser
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html', // HTML template to inject JS
        filename: 'index.html',
      }),
    ],
  };
};
