var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const debug = process.env.NODE_ENV !== 'production';



var entries = getEntry('Src/Js/Index.js');//搜索主js
//var entries = getEntry('src/js/**/*.js', 'src/js/');//搜索所有主js
entries['lib'] =['jquery','underscore','k-logging','k-report','thunderjs']; //说明lib模块

//var entries = getEntry('src/js/**/*.js');

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
        test: /\.css$/,
        //loaders: ['style','css']
        loader: ExtractTextPlugin.extract('style', 'css')
      }, {
        test: /\.(html|tpl)$/,
        loader: 'html'
        //loader: "html?-minimize" //避免压缩html,https://github.com/webpack/html-loader/issues/50
      }, {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }, {
        test: /\.(png|jpe?g|gif)$/,
        //loader: 'url-loader?limit=819'
        loader: 'url-loader?limit=819&name=images/[name].[ext]'
      }, {
        test: /\.mp4$/,
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
    new ExtractTextPlugin('css/[name].css'), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    debug ? function() {} : new UglifyJsPlugin({ //压缩代码
      compress: {
        warnings: false
      },
      except: ['$super', '$', 'exports', 'require'] //排除关键字
    }),
  ]
};


var pages = Object.keys(getEntry('src/**/*.html'));
pages.forEach(function(pathname) {
  var conf = {
    filename: '' + pathname + '.html', //生成的html存放路径，相对于path
    template: 'src/' + pathname + '.html', //html模板路径
    inject: false, //js插入的位置，true/'head'/'body'/false
    /*
     * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
     * 如在html标签属性上使用{{...}}表达式，很多情况下并不需要在此配置压缩项，
     * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
     * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
     */
     minify: { //压缩HTML文件
      removeComments: false, //移除HTML中的注释
      collapseWhitespace: false //删除空白符与换行符
     }
  };
  if (pathname in config.entry) {
    //conf.favicon = path.resolve(__dirname, 'src/imgs/favicon.ico');
    conf.inject = 'body';
    conf.chunks = ['lib', pathname];
    conf.hash = true;
  }
  config.plugins.push(new HtmlWebpackPlugin(conf));
});

console.log(JSON.stringify(config))

module.exports = config;

function getEntry(globPath, pathDir) {
  var files = glob.sync(globPath);
  var entries = {}, //pathname
    entry, dirname, basename, extname;
  //debugger;
  //console.log("files: "+ JSON.stringify(files));
  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    
    //debugger;
    dirname = path.dirname(entry); //获取文件路径
    extname = path.extname(entry); //获取文件后缀
    basename = path.basename(entry, extname); //获取文件基本名称
    //console.log("basename: "+ basename);
    //pathname = path.normalize(path.join(dirname,  basename)); //组合路径 这里得到的是entery去掉后缀后的绝对路径
    //pathDir = path.normalize(pathDir);
    //console.log(pathDir);
    //if(pathname.startsWith(pathDir)){ //这里感觉是对glob的不信任啊.....
    //  pathname = pathname.substring(pathDir.length)
    //}
    //console.log("pathname: "+ pathname);

    
    entries[basename] = ['./' + entry];
  }
  console.log("entries: "+ JSON.stringify(entries));
  return entries;
}