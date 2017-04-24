var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var webpack_config_data = require('./Create_Webpack_Config_Data.js');
var entries = []


console.log( (new webpack_config_data()).get_entry_html('./Src') )

const debug = process.env.NODE_ENV !== 'production';


entries = (new webpack_config_data()).get_entry_js('./Src');
//var entries = getEntry('Src/Js/index.js');//搜索主js
//var entries = getEntry('src/js/**/*.js', 'src/js/');//搜索所有主js
entries['lib'] =['jquery','k-logging','k-report']; //说明lib模块

//var entries = getEntry('src/js/**/*.js');
entries[ 'index' ] = ['webpack-hot-middleware/client', entries[ 'index' ]] 
console.log( entries);

var chunks = Object.keys(entries);
var config = {
  entry: entries,
  output: {
    path: path.join(__dirname, 'public'),
    //publicPath: '/v2017/k_pc/public/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].chunk.js?[chunkhash]'
  },
  module: {
    loaders: [ //加载器
      {
              test: /\.js$/,
              loaders: ['es3ify','babel']
              //exclude: __dirname + '/node_modules',
              //include: __dirname + '/Src',
          },
          /*{
              test: /\.js$/,
              loader: 'es3ify'
              //exclude: __dirname + '/node_modules',
              //include: __dirname + '/Src',
          },*/
      {
        test: /\.scss$/,
        //loaders: ['style','css']
        loaders: ['style','css','sass']
        //loader: ExtractTextPlugin.extract('style', 'css','sass')
      }, {
        test: /\.(html|tpl)$/,
        loader: 'html?minimize=false'
        //loader: "html?-minimize" //避免压缩html,https://github.com/webpack/html-loader/issues/50
      }, {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }, {
        test: /\.(png|jpe?g|gif)$/,
        //loader: 'url-loader?limit=819'
        loader: 'url-loader?limit=819&name=images/[name].[ext]'
      }, {
        test: /\.(mp4|swf)$/,
        loader: 'file?name=video/[name].[ext]'
      }
    ],
     /*postLoaders: [
          { test: /\.js$/, loader: 'es3ify' }
        ]*/
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'lib', // 将公共模块提取，生成名为`lib`的chunk
      chunks: chunks,
      //minChunks: chunks.length // 提取所有entry共同依赖的模块
    }),
    new ExtractTextPlugin('css/[name].css'), ///单独使用link标签加载css并设置路径，相对于output配置中的publickPath
   debug ? function() {} : new UglifyJsPlugin({ //压缩代码
      compress: {
        warnings: false,
        screw_ie8: false

      }, 
      mangle: false,
            output: { screw_ie8: false },
      //except: ['$super', '$', 'exports', 'require'] //排除关键字
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

 (new webpack_config_data()).get_entry_html('./Src').forEach(element => {
  console.log(element)
    config.plugins.push(new HtmlWebpackPlugin(element));
 })

module.exports = config;