/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { entry, resolve, rules } = require('./webpack.config.base');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry,
    output: {
        path: path.resolve(__dirname, './public/js/'),
        filename: '[name].js',
        publicPath: '/js/',
    },
    mode: 'development',
    devtool: 'eval-cheap-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        stats: 'minimal',
        proxy: {
            '/': 'http://localhost:3000',
        },
    },
    module: {
        rules: [
            ...rules,
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: resolve.extensions,
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
};
