const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: {
        app: './src/app.ts',
        judging: './src/judging.ts',
    },
    output: {
        path: path.resolve(__dirname, './dist/public/js/'),
        filename: '[name].js',
        publicPath: '/js/'
    },
    mode: 'development',
    devtool: '#eval-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        stats: 'minimal',
        proxy: {
            '/': 'http://localhost:3000',
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              exclude: /node_modules/,
              options: {
                appendTsSuffixTo: [/\.vue$/]
              }
            },
            {
                test: /\.pug$/,
                loader: 'pug-plain-loader'
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js' 
        }
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}
