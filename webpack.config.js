/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const path = require("path");

const PnpWebpackPlugin = require(`pnp-webpack-plugin`);
const ReactRefreshTypeScript = require("react-refresh-typescript");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const RobotstxtPlugin = require("robotstxt-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const Dotenv = require("dotenv-webpack");
// enable this for analyze
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  mode: "development",
  entry: "./index.tsx",
  devtool: "source-map",
  target: "web",
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src/"),
      "@components": path.resolve(__dirname, "src/components/"),
      "@store": path.resolve(__dirname, "src/store/"),
      "@utils": path.resolve(__dirname, "src/utils/"),
      "@assets": path.resolve(__dirname, "assets/")
    },
    extensions: [".ts", ".tsx", ".js"],
    plugins: [PnpWebpackPlugin]
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)]
  },
  module: {
    rules: [
      {
        test: /fonts[\\/].*\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: ["url-loader"]
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          getCustomTransformers: () => ({
            before: [ReactRefreshTypeScript()]
          })
        }
      },
      {
        test: /.s?css$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              additionalData: `@import "./src/styles/variables.scss";`
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: ["file-loader"]
      },
      {
        test: /\.(webp)$/i,
        use: ["file-loader", "webp-loader"]
      }
    ]
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true
  },
  output: {
    filename: "[name]-[contenthash].js",
    chunkFilename: "[name]-[contenthash].js",
    path: path.resolve(__dirname, "public/dist"),
    publicPath: "/"
  },
  optimization: {
    minimize: !isDevelopment,
    usedExports: true,
    sideEffects: true,
    removeEmptyChunks: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
        extractComments: true
      }),
      new CssMinimizerPlugin({ parallel: true })
    ],
    splitChunks: {
      chunks: "async",
      minSize: 200000,
      minRemainingSize: 0,
      maxSize: 400000,
      minChunks: 2,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 5,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html")
      // favicon: "./assets/logo.ico"
    }),
    new MiniCssExtractPlugin({
      filename: "[name]-[contenthash].css",
      chunkFilename: "[name]-[contenthash].css",
      insert: (linkTag) => {
        const preloadLinkTag = document.createElement("link");
        preloadLinkTag.rel = "preload";
        preloadLinkTag.as = "style";
        preloadLinkTag.href = linkTag.href;
        document.head.appendChild(preloadLinkTag);
        document.head.appendChild(linkTag);
      }
    }),
    new RobotstxtPlugin({
      fliePath: "./robots.txt"
    }),
    new webpack.ProvidePlugin({
      process: "process/browser"
    }),
    isDevelopment && new ReactRefreshWebpackPlugin()
    // enable this for analyze
    // new BundleAnalyzerPlugin(),
  ].filter(Boolean)
};
