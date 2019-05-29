const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MyPackage = require('./package.json');

module.exports = (function () {
  const env = process.env;
  const production = env.NODE_ENV === 'production';
  const { amd, umd, cjs, old, NODE_ENV: mode } = env;
  const devtool = production ? '' : 'source-map';
  const entry = {};
  const libraryTarget = amd ? 'amd' : umd ? 'umd' : cjs ? 'commonjs' : old ? 'umd' : 'commonjs';
  const libraryTargetPath = amd ? 'amd' : umd ? 'umd' : cjs ? 'cjs' : old ? '' : 'cjs';
  const distDir = path.resolve(__dirname, 'dist', libraryTargetPath);
  const plugins = [
    new HtmlWebpackPlugin({
      template: './sdktest/index.html',
      inject: false,
    })
  ];
  if (production) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        ie8: true,  //瘦身后，支持IE8
        beautify: false,
        mangle: {
          keep_fnames: true
        },
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true
        },
        comments: false
      })
    )
  }
  const mainEntryName = production ? "index.min" : "index.dev";
  entry[mainEntryName] = './src/index.ts';
  return {
    mode,
    entry,
    output: {
      path: distDir,
      filename: '[name].js',
      libraryTarget
    },
    devtool,
    resolve: {
      extensions: ['', '.ts']
    },
    module: {
      loaders: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          include: __dirname
        },
        {
          test: /\.ts$/,
          loader: `string-replace-loader`,
          query: {
            search: '@@VERSION',
            replace: MyPackage.version,
            flags: 'g'
          },
          exclude: /node_modules/
        }
      ]
    },
    plugins,
    devServer: production ? false : {
      port: 3000,
      host: '0.0.0.0',
      disableHostCheck: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
})();