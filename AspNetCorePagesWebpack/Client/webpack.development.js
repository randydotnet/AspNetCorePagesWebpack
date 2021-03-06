const path = require('path');
const rxPaths = require('rxjs/_esm5/path-mapping');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const helpers = require('./webpack.helpers');

const ROOT = path.resolve(__dirname, '..');

console.log('@@@@@@@@@ USING DEVELOPMENT @@@@@@@@@@@@@@@');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  performance: {
    hints: false
  },
  entry: {
    polyfills: './Client/polyfills.ts',
      vendor: './Client/vendor.development.ts',
      app: './Client/main.ts'
  },

  output: {
    path: ROOT + '/wwwroot/',
    filename: 'dist/[name].bundle.js',
    chunkFilename: 'dist/[id].chunk.js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: rxPaths()
  },

  devServer: {
    historyApiFallback: true,
    contentBase: path.join(ROOT, '/wwwroot/'),
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'awesome-typescript-loader',
          'source-map-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|ttf|svg|eot)$/,
        use: 'file-loader?name=assets/[name]-[hash:6].[ext]'
      },
      {
        test: /favicon.ico$/,
        use: 'file-loader?name=/[name].[ext]'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
          include: path.join(ROOT, 'Client/styles'),
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.scss$/,
          exclude: path.join(ROOT, 'Client/styles'),
        use: ['raw-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      }
    ],
    exprContextCritical: false
  },
  plugins: [
    function() {
      this.plugin('watch-run', function(watching, callback) {
        console.log(
          '\x1b[33m%s\x1b[0m',
          `Begin compile at ${new Date().toTimeString()}`
        );
        callback();
      });
    },

    new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),

    // new webpack.optimize.CommonsChunkPlugin({ name: ['vendor', 'polyfills'] }),

    new CleanWebpackPlugin(['./wwwroot/dist', './wwwroot/assets'], {
      root: ROOT
    }),

    new HtmlWebpackPlugin({
        filename: '../Pages/Shared/_Layout.cshtml',
        inject: 'body',
        template: 'Client/_Layout.cshtml'
    }),

    new CopyWebpackPlugin([
        { from: './Client/assets/*.*', to: 'assets/', flatten: true }
    ]),

    new CopyWebpackPlugin([
        { from: './node_modules/bootstrap/dist/css/*.*', to: 'css/', flatten: true }
    ])
  ]
};
