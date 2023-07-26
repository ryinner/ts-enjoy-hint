const path = require('path');

const srcDir = path.resolve(__dirname, 'src');
const buildDir = path.resolve(__dirname, 'dist', 'dev');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: path.join(srcDir, 'main.ts'),
        style: path.join(srcDir, 'style.ts')
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
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new MiniCssExtractPlugin({filename: "[name].css"}),
    ]
};
