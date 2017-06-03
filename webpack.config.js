var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var webpack_config_data = require('./Create_Webpack_Config_Data.js');
var QiniuPlugin = require('k-qiniu');
var _package = require('./package.json');
var env = require('./.env.js')
var entries = []


console.log( (new webpack_config_data()).get_entry_html('./Src') )




var __DEV__ = process.env.NODE_ENV !== 'production',
    __SERVER__ = process.env.NODE_ENV === 'SERVER',
    public_path

if ( !__DEV__  ) {
  public_path =   'http://publish.404mzk.com/static/' + _package.name + "/" + _package.version +"/";
}else{
  public_path = '/'
}


entries = (new webpack_config_data()).get_entry_js('./Src');
//var entries = getEntry('Src/Js/index.js');//搜索主js
//var entries = getEntry('src/js/**/*.js', 'src/js/');//搜索所有主js
entries['lib'] =['jquery','k-logging','k-report']; //说明lib模块

//var entries = getEntry('src/js/**/*.js');
//entries[ 'index' ] = ['webpack-hot-middleware/client', entries[ 'index' ]] 

 //entries[ 'index' ] = ['webpack-hot-middleware/client', entries[ 'index' ]] 
var chunks = Object.keys(entries);
var config = {
  entry: entries,
  output: {
    path: path.join(__dirname, 'public'),
    publicPath : public_path,
    filename: 'js/[name]-[chunkhash:4].js',
    //chunkFilename: 'js/[id].[chunkhash].js'
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
        //loaders: ['style','css','sass']
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      },{
        test: /\.css$/,
        loaders: ['style','css']
        //loader: ExtractTextPlugin.extract('style', 'css')
      }, {
        test: /\.(html|tpl)$/,
        loader: 'html?minimize=false'
        //loader: "html?-minimize" //避免压缩html,https://github.com/webpack/html-loader/issues/50
      }, {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name]-[hash:4].[ext]'
      }, {
        test: /\.(png|jpe?g|gif)$/,
        //loader: 'url-loader?limit=819'
        loader: 'url-loader?limit=819&name=images/[name]-[hash:4].[ext]'
      }, {
        test: /\.(mp4|swf)$/,
        loader: 'file?name=video/[name]-[hash:4].[ext]'
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
    new ExtractTextPlugin('css/[name]-[contenthash:4].css'), ///单独使用link标签加载css并设置路径，相对于output配置中的publickPath
   __DEV__ ? function() {} : new UglifyJsPlugin({ //压缩代码
      compress: {
        warnings: false,
        screw_ie8: false

      }, 
      mangle: false,
            output: { screw_ie8: false },
      //except: ['$super', '$', 'exports', 'require'] //排除关键字
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    __SERVER__ ? new webpack.HotModuleReplacementPlugin() : () => {},
    new webpack.NoErrorsPlugin(),
    __DEV__ ? function(){} : new QiniuPlugin({

      // 七牛云的两对密匙 Access Key & Secret Key
      accessKey: env.qiniu_access_key,
    
      secretKey: env.qiniu_secret_key,
    
      // 七牛云存储空间名称
      bucket: 'publish',
      
      // 上传到七牛后保存的文件名
      path: 'static/[name]/[version]/[asset]'

    })
  ]
};

 (new webpack_config_data()).get_entry_html('./Src').forEach(element => {
  console.log(element)
    config.plugins.push(new HtmlWebpackPlugin(element));
 })
console.log( config);
module.exports = config;