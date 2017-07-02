import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';
import HtmlPlugin from 'html-webpack-plugin';

export default {
  context: path.join(__dirname, '../src'),

  entry: {
    app: [
      'babel-polyfill',
      './app.js',
    ],
    vendor: ['react', 'moment', 'lodash', 'react-dom'],
  },

  output: {
    path: path.join(__dirname, '../out'),
    filename: '[name].[chunkhash].js',
    publicPath: '/',
  },

  target: 'web',

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?modules&localIdentName=[name]_[local]_[hash:base64:3]',
            'postcss-loader',
          ],
        }),
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|ico)$/,
        use: ['file-loader?name=[hash].[ext]'],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['runtime'],
    }),
    new ExtractTextPlugin('[name].[chunkHash].css'),
    new HtmlPlugin({
      title: 'Coin Monitor',
      template: './index.ejs',
    }),
  ],
};
