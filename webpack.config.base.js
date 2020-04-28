module.exports = {
    entry: {
        main: './src/main.ts',
    },
    rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader',
        },
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
    },
};
