var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var path = require('path');

module.exports = {
  mode: 'production',
  context: path.join(__dirname, 'client'),
  entry: ['babel-polyfill', '../clientSrc/App.js'],
  output: {
    path: __dirname + '/public/js/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs'],
    symlinks: true,
    alias: {
      react: path.resolve('node_modules/react'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
    ],
  },
};
