const path = require("path");
// Extractors & Copiers
const CopyPlugin = require("copy-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// Optimization
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// ESLint
const ESLintPlugin = require("eslint-webpack-plugin");
// Manifest
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

const htmlPageNames = ["options.html"];
const multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
        template: `./src/pages/${name}`,
        filename: `${name}`,
        chunks: [`${name}`],
        hash: true,
    })
});

module.exports = {
    entry: {
        main: "./src/main.ts",
        worker: "./src/worker.ts"
    },
    target: "web",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                include: [path.resolve(__dirname, "src")],
                exclude: /node_modules/,
            },
            {
                test: /\.s?[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader", "postcss-loader"]
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/images/[name][ext]",
                },
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/fonts/[name][ext]",
                },
            }
        ],
    },
    output: {
        publicPath: "/",
        filename: "js/[name].js", // Cannot add hashnames due to manifest.json "content_scripts" require a static file name
        chunkFilename: "js/[name].chunk.js",
        path: path.resolve(__dirname, "public"),
    },
    mode: "development",
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js", "..."],
    },
    optimization: {
        usedExports: false,
        removeEmptyChunks: true,
        removeAvailableModules: true,
        realContentHash: true,
        chunkIds: "total-size",
        splitChunks: {
            chunks: "async",
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    enforce: true,
                    filename: "js/vendors.js"
                },
            },
        },
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
            new CssMinimizerPlugin()
        ],
    },
    plugins: [
        new WebpackManifestPlugin({
            fileName: "asset-manifest",
            useLegacyEmit: true
        }),
        new MiniCssExtractPlugin({
            linkType: "text/css",
            filename: "css/[name].[contenthash].css",
            chunkFilename: "css/[name].[contenthash].chunk.css",
            attributes: {
                media: "print"
            }
        }),
        new CleanWebpackPlugin(),
        new ESLintPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, `./src/popup/popup.html`),
            filename: "./popup/popup.html",
            inject: "body",
            minify: false, // Keep false for development, set to true for production build
            chunks: ["main"],
            hash: true,
            meta: {
                description: { name: "description", content: "Powerful & comprehensive bookmark  editor for Microsoft Edge Web Browser" },
                author: { name: "author", content: "Handy Marky: Favorites Editor" },
                owner: { name: "owner", content: "Handy Marky: Favorites Editor" },
                canonical: { rel: "canonical", href: "https://dervisoksuzoglu.com.tr" },
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/assets/images"),
                    to: "assets/images",
                    noErrorOnMissing: true,
                },
                {
                    from: path.resolve(__dirname, "src/assets/fonts"),
                    to: "assets/fonts",
                    noErrorOnMissing: true,
                },
                {
                    from: path.resolve(__dirname, "manifest.json"),
                    to: "manifest.json",
                    noErrorOnMissing: true,
                },
                {
                    from: path.resolve(__dirname, "src/_locales"),
                    to: "_locales",
                    noErrorOnMissing: true,
                }
            ],
        }),
        new CspHtmlWebpackPlugin(
            {
                "base-uri": ["'self'"],
                "object-src": ["'none'"],
                "script-src": ["'self'"],
                "style-src": ["'self'"],
                "img-src": ["'self'"],
                "font-src": ["'self'"],
                "connect-src": ["'self'"],
                "frame-src": ["'self'"]
            },
            {
                enabled: true,
                hashingMethod: "sha256",
                hashEnabled: {
                    "script-src": true,
                    "style-src": true
                },
                nonceEnabled: {
                    "script-src": true,
                    "style-src": true
                }
            }
        )
    ].concat(multipleHtmlPlugins)
}