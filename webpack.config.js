  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js-IndexedDB.js',
      library: 'js_IndexedDB',
      libraryTarget: 'umd'
    },
    module: {
      rules: [{
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
        
      }]
    }
  };