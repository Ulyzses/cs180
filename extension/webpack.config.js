const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    content: './src/content.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  plugins: [
    new copyWebpackPlugin({
      patterns: [
        { from: 'static' }
      ]
    })
  ],
  devtool: 'cheap-module-source-map',
}