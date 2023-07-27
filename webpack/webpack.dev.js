const path = require('path');

const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const srcDir = path.resolve(__dirname, '..', 'src');
const buildDir = path.resolve(__dirname, '..', 'dist', 'dev');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = merge(common, {
    entry: {
        main: path.join(srcDir, 'main.ts'),
        style: path.join(srcDir, 'style.ts')
    },
    output: {
        clean: true,
        filename: '[name].js',
        path: buildDir
    },
    resolve: {
        plugins: [new TsconfigPathsPlugin({
            configFile: path.resolve(__dirname, '..', 'tsconfig.json')
        })]
    }
});
