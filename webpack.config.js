const path = require('path');

const srcDir = path.resolve(__dirname, 'src');
const buildDir = path.resolve(__dirname, 'dist', 'dev');

module.exports = {
    mode: 'development',
    entry: {
        main: path.join(srcDir, 'main.ts')
    },
    output: {
        clean: true,
        filename: '[name].js',
        path: buildDir
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};
