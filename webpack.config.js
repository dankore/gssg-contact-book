const path = require("path");

module.exports = {
  entry: "./javascript/main.js",
  output: {
    filename: "main-bundled.js",
    path: path.resolve(__dirname, "public")
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
