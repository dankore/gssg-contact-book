const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './javascript/main.js',
  output: {
    filename: 'main-bundled.js',
    path: path.resolve(__dirname, 'public'),
  },
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000,
    open: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 2000000,
    maxEntrypointSize: 2000000,
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: './public/index.html',
  //   }),
  // ],
};
