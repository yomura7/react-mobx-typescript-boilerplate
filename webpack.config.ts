import { ensureDirSync } from "fs-extra";
import * as path from "path";
import * as webpack from "webpack";

// plugins
import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import * as HappyPack from "happypack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as WebpackCleanupPlugin from "webpack-cleanup-plugin";

// variables
const isProduction = process.argv.indexOf("-p") >= 0;
const sourcePath = path.join(__dirname, "./src");
const outPath = path.join(__dirname, "./build/dist");

ensureDirSync(outPath);

const config: webpack.Configuration = {
  context: sourcePath,
  devServer: {
    contentBase: sourcePath,
    historyApiFallback: {
      disableDotRule: true,
    },
    hot: true,
    inline: true,
    stats: "errors-only",
  },
  devtool: "cheap-module-eval-source-map",
  entry: {
    main: "./index.tsx",
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: "happypack/loader?id=ts",
      },
      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                localIdentName: "[local]__[hash:base64:5]",
                modules: true,
                sourceMap: !isProduction,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                plugins: [
                  require("postcss-import")({ addDependencyTo: webpack }),
                  require("postcss-url")(),
                  require("postcss-cssnext")(),
                  require("postcss-reporter")(),
                  require("postcss-browser-reporter")({
                    disabled: isProduction,
                  }),
                ],
              },
            },
          ],
        }),
      },
      // static assets
      { test: /\.html$/, use: "html-loader" },
      { test: /\.png$/, use: "url-loader?limit=10000" },
      { test: /\.jpg$/, use: "file-loader" },
    ],
  },
  node: {
    fs: "empty",
    net: "empty",
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2,
        },
        vendors: {
          chunks: "all",
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },
      name: true,
    },
  },
  output: {
    chunkFilename: "[chunkhash].js",
    filename: "bundle.js",
    path: outPath,
    publicPath: "/",
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new ExtractTextPlugin({
      disable: !isProduction,
      filename: "styles.css",
    }),
    new HtmlWebpackPlugin({
      title: "Frontend Boilerplate with React and TypeScript",
    }),
    new HappyPack({
      id: "ts",
      loaders: [
        ...(isProduction
          ? []
          : ["babel-loader?plugins=react-hot-loader/babel"]),
        "ts-loader?happyPackMode=true",
      ],
      threads: 2,
    }),
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
    }),
  ],
  resolve: {
    alias: {
      app: path.resolve(__dirname, "src/app/"),
    },
    extensions: [".js", ".ts", ".tsx"],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ["module", "browser", "main"],
  },
  target: "web",
};

export default config;
