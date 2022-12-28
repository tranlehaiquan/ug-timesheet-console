const path = require("path");

module.exports = {
  mode: "none",
  entry: [
    // Finally, this is your app's code:
    "./src/temp/index.tsx",
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "commonjs",
  },
  externals: {
    react: "react",
    lodash: "lodash",
    "react-dom": "react-dom",
    classnames: "classnames",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ["style-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(ts|tsx)$/,
        loader: "babel-loader",
      },
    ],
  },
};
