const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "source-map" : "eval-source-map",

    entry: {
      FactoryManager: "./src/js/FactoryManager.js",
    },

    output: {
      // 1. Spostiamo la base a /dist (più pulito)
      path: path.resolve(__dirname, "dist"),
      // 2. Specifichiamo la sottocartella js nel nome del file
      filename: "js/app.bundle.js",
      // 3. FONDAMENTALE: Dice al server che i file virtuali partono da /dist/
      publicPath: "/dist/",
      library: {
        name: "FactoryManager",
        type: "window",
        export: "default",
      },
      clean: true,
    },

    devServer: {
      static: {
        // Serve l'index.html che sta nella root del progetto
        directory: __dirname,
        // Ignora dist e node_modules per evitare il loop di refresh
        watch: {
          ignored: [path.resolve(__dirname, "dist"), path.resolve(__dirname, "node_modules")],
        },
      },
      hot: true,
      port: 8080,
      host: "127.0.0.1",
      devMiddleware: {
        writeToDisk: false, // In memoria come richiesto
      },
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: { loader: "babel-loader" },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            // I file andranno in dist/assets
            filename: "assets/[name][ext]",
          },
        },
      ],
    },

    optimization: {
      minimize: isProduction,
      minimizer: [new TerserPlugin()],
    },

    plugins: [
      new MiniCssExtractPlugin({
        // Il file andrà in dist/css/styles.css
        filename: "css/styles.css",
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "src/assets",
            to: "assets", // va in dist/assets
            noErrorOnMissing: true,
          },
        ],
      }),
      new ESLintPlugin({ configType: "flat" }),
    ],
  };
};
