const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MyPackage = require('./package.json');

module.exports = env => {
  env = env ? env : {}; //环境变量
  const mode = env.production ? "production" : "development"; //开发或生产模式
  const devtool = env.production || env.nodevtool ? "" : "source-map"; //
  const entry = {};
  const plugins = [];
  const optimization = {};  //优化选项
  const minimizer = []; //优化选项：瘦身器
  const libraryTarget = env.amd ? 'amd' : env.umd ? 'umd' : env.cjs ? 'commonjs' : env.old ? 'umd' : 'commonjs';
  const libraryTargetPath = env.amd ? 'amd' : env.umd ? 'umd' : env.cjs ? 'cjs' : env.old ? '' : 'cjs';
  const distDir = path.resolve(__dirname, 'dist', libraryTargetPath);
  const mainEntryName = env.production ? "index.min" : "index.dev";
  entry[mainEntryName] = './src/index.ts';
  optimization['minimizer'] = minimizer;
  if (!env.amd) { //非amd(即umd或cjs）模式
    plugins.push(
      new HtmlWebpackPlugin({
        template: './sdktest/index.html',
        inject: false,
      })
    )
  }
  if (env.production) { //生产模式
    minimizer.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          ie8: true,  //瘦身后，支持IE8
          beautify: false,
          mangle: {
            keep_fnames: true
          },
          comments: false
        }
      })
    )
  }


  return {
    mode: mode,
    entry: entry,
    devtool: devtool,
    output: {
      path: distDir,
      libraryTarget: libraryTarget,
      filename: "[name].js"
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: "ts-loader",
          exclude: /node_modules/
        },
        {
          test: /\.ts$/,
          loader: 'string-replace-loader',
          options: {
            search: '@@VERSION',
            replace: MyPackage.version,
            flags: 'g'
          }
        }
      ]
    },
    plugins: plugins,
    optimization: optimization
  }
}