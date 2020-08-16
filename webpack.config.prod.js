/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { entry, resolve, rules } = require('./webpack.config.base');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

module.exports = {
    entry,
    output: {
        path: path.resolve(__dirname, 'dist/public/js/'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/js/',
    },
    mode: 'production',
    module: {
        rules: [
            ...rules,
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    configFile: 'tsconfig.src.json',
                },
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: resolve.extensions,
        alias: {
            'vue$': 'vue/dist/vue.min.js',
        },
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '../css/[name].css',
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public/template.html'),
            filename: path.join(__dirname, 'dist/public/index.html'),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'public'),
                    to: path.join(__dirname, 'dist/public'),
                    toType: 'dir',
                    globOptions: {
                        ignore: [
                            '**/index.html',
                            '**/template.html',
                        ],
                    },
                },
            ],
        }),
        new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, 'dist/public/'),
            routes: [ '/', '/info', '/teams', '/results/qualifiers', '/results/elimination', '/staff' ],
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            postProcess (renderedRoute) {
                renderedRoute.route = renderedRoute.originalRoute;
                const s = renderedRoute.route.split('/');
                renderedRoute.outputPath = path.join(__dirname, 'dist/public', `${s[s.length - 1] || 'index'}.html`);

                return renderedRoute;
            },
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'all',
                },
            },
        },
    },
};
