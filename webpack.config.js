/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { entry, resolve, rules } = require('./webpack.config.base');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry,
    output: {
        path: path.resolve(__dirname, './public/'),
        filename: '[name].js',
        publicPath: '/',
    },
    mode: 'development',
    devtool: 'eval',
    devServer: {
        contentBase: './public',
        index: 'index.html',
        hot: true,
        stats: 'minimal',
        historyApiFallback: true,
        proxy: {
            '/api/': 'http://localhost:3000',
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
