const path = require('path');
//const fs = require('fs-extra');
const { spawn } = require('child_process');
//const HtmlWebpackPlugin = require('html-webpack-plugin');

const inputDirectory = path.join(__dirname, 'src');
const outputDirectory = path.join(__dirname, 'build.www');

const common = {
    //
}

module.exports = {
    mode: 'development',
    target: 'node-webkit',
    devtool: 'source-map',
    entry: {
        'App': path.join(inputDirectory, 'App.ts'),
        'classic/Frontend': path.join(inputDirectory, 'frontend', 'classic', 'Frontend.tsx'),
        'playground/Frontend': path.join(inputDirectory, 'frontend', 'playground', 'Frontend.tsx'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        path: outputDirectory,
        filename: '[name].js'
        //libraryTarget: 'umd'
    },
    plugins: [    
        /*
        new HtmlWebpackPlugin({
                template: path.join(inputDirectory, 'index.html'),
        })
        */
    ],
    devServer: {
        contentBase: outputDirectory,
        compress: false,
        port: 5000,
        hot: true,
        after(app, server) {
            spawn('nw', ['build.app'])
        }
    }
};