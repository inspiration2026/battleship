const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devServer: {
        static: './dist',
        open: true,
        port: 8080
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                type: 'javascript/auto' // ← This is the key fix
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html'
        })
    ]
};