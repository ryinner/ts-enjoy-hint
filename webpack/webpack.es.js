const path = require('path');

const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const srcDir = path.resolve(__dirname, '..', 'src');
const buildDir = path.resolve(__dirname, '..', 'dist', 'esm');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = merge(common, {
    entry: {
        index: path.join(srcDir, 'index.ts'),
        style: path.join(srcDir, 'style.ts')
    },
    output: {
        clean: true,
        filename: '[name].js',
        path: buildDir,
        library: {
            type: 'module',
        },
    },
    experiments: {
        outputModule: true,
    },
    resolve: {
        plugins: [new TsconfigPathsPlugin({
            configFile: path.resolve(__dirname, '..', 'tsconfig.esm.json')
        })]
    }
});
