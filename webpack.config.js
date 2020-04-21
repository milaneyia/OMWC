/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: {
        main: './src/main.ts',
    },
    output: {
        path: path.resolve(__dirname, './public/js/'),
        filename: '[name].js',
        publicPath: '/js/',
    },
    mode: 'development',
    devtool: '#eval-source-map',
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
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
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
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
};
