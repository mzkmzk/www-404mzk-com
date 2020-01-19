const  path = require('path'),
       LOCAL_PATH = path.join(__dirname , '../public/v2018'),
       HTML_ENTRY = [{
            "filename": "../index.html",
            "template": "./src/assets/index.html",
            "chunks": ["index"]
        }]

let webpack = require('webpack'),
    __DEV__ = process.env.NODE_ENV !== 'production',
    package = require('./package.json'),
    CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    _package = require('./package.json'),
    URL_NAME,
    env = require('./.env.js'),
    QiniuPlugin = require('k-qiniu');
    _package = require('./package.json');

if ( !__DEV__  ) {
  URL_NAME =   'http://publish.404mzk.com/static/' + _package.name + "/" + _package.version +"/";
}else{
  URL_NAME = '/'
}

let config = {
    entry: {
        'index': './src/js/index.js',
        //'vendor': ['jquery', 'underscore']
    },
    output: {
        path: LOCAL_PATH ,
        chunkFilename: __DEV__ ?  '[name].js?h=[chunkhash:3]' :  '[name].min.js?h=[chunkhash:3]', //mock_data
        publicPath: URL_NAME,
        filename: __DEV__ ?  '[name].js?h=[chunkhash:3]' :  '[name].min.js?h=[chunkhash:3]' //verdor
    },
    module: {
        rules: [
            {
                test: /\.tpl$/,
                use: [{
                    loader: 'compressed-string-loader'
                }]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                 enforce: 'post',
                use: [{
                    loader: 'babel-loader',
                }]
            },
            {
                test: /\.(css|scss)$/,
                 use: [

                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].css?h=[hash:3]",
                        },
                    },
                    {
                        loader: "extract-loader"
                    },
                    
                    {
                        loader: "css-loader",
                        options: {
                            name: "[name].[ext]",
                            minimize: !__DEV__ 
                        }
                    },
                    {
                        loader: "sass-loader"
                    },
                 ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader?name=[name]',
                    options: {
                        limit: 1,
                        name: '[name].[ext]?h=[hash:3]'
                    }
                }]
            },
            {
                 test: /\.html$/,
                 loader: 'html-loader',
                 options: {
                    attrs: ['img:src', 'link:href', 'img:data-vll-src', 'section:data-vll-bgurl']
                 }
             }
        ]
    },
    plugins: [
        /*new CommonsChunkPlugin({
          name: 'vendor', 
        }),*/
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(  process.env.NODE_ENV  + '' )
            },
            '_PACKAGE_VERSION': JSON.stringify(package.version + '')
        }), !__DEV__ ? new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true,
                screw_ie8: false
            },
            mangle: true,
            beautify: false,
            output: {
                screw_ie8: false
            }
        }) : function() {},
        __DEV__ ? function(){} : new QiniuPlugin({

          // 七牛云的两对密匙 Access Key & Secret Key
          accessKey: env.qiniu_access_key,
        
          secretKey: env.qiniu_secret_key,
        
          // 七牛云存储空间名称
          bucket: 'publish',
          
          // 上传到七牛后保存的文件名
          path: 'static/[name]/[version]/[asset]'

    })
    ],
    watch: true
};
config.plugins = config.plugins.concat( get_entry_html(HTML_ENTRY) )

module.exports = config

webpack(module.exports, function(err, stats) {

    if (err) throw err;
    
    //stats相关的设置可见 https://doc.webpack-china.org/configuration/stats/
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n');


    
})



function get_entry_html(html_array){
    return html_array.map( element => {
        return  new HtmlWebpackPlugin({
            filename: element.filename,
            template: element.template,
            inject: false,
            minify: { //压缩HTML文件
              removeComments: true, //移除HTML中的注释
              collapseWhitespace: true //删除空白符与换行符
            },
            inject: 'body',
            chunks: element.chunks,
            hash: false
        })
    })
}

