const webpack = require('webpack');

module.exports = {
  entry: {
    all: __dirname + '/assets/js/index.js',
  },
  resolve: {
    root: __dirname + '/assets/js',
    alias: {
      'masonry': 'masonry-layout',
      'isotope': 'isotope-layout' } },
  output: {
    path: __dirname + '/public/assets',
    filename: '[name].js',
    publicPath: '/assets',
  },
  module: {
    loaders: [
      { test: /.*\.sass$/,
        loaders: ['style', 'css', 'sass', 'import-glob'] },
      
      { test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: { presets: ['es2015'] } },

      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,     loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=assets/fonts/[name].[ext]' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=assets/fonts/[name].[ext]' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=assets/fonts/[name].[ext]' },
      { test: /\.[ot]tf(\?v=\d+\.\d+\.\d+)?$/,  loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=assets/fonts/[name].[ext]' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,     loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=assets/fonts/[name].[ext]'}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }
    }),
  ],
  devServer: {
    port: 3000,
    inline: true,
    stats: 'minimal'
  },
};

