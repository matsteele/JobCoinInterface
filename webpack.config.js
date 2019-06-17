var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var path = require('path');


const rules = [
  {
    test: /\.tsx?/,
    use: 'babel-loader'
  }
]

module.exports = {
  target:   'web',
  mode: 'development',
  context:  path.join(__dirname, 'src'),
  devtool:  debug ? 'inline-sourcemap' : null,
  entry:    './entry.tsx',
  resolve:  {
    extensions:['.ts','.tsx','.js'],
    alias: {
      'utils': path.resolve(__dirname, './src/utils'),
      'store': path.resolve(__dirname, './src/store')   // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
    }
  },
  devServer: {
    contentBase:'./',
    port: 5000,
    watchContentBase: true,
    historyApiFallback: true
  },
  module: {rules},
  output: {
    path: path.resolve(__dirname,'build/'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  ],
};


