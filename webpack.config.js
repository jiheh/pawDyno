'use strict';

const {resolve} = require('path');
let MODE =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'public')
  },
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: [
          'style-loader',
          'css-loader',
        ]
      }
    ]
  }
};
