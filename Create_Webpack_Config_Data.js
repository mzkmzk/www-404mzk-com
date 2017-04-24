var  glob = require('glob');
var  _ = require('underscore');
var  path = require('path');
var fs = require('fs');

const CHUNK_NAME_SEP = '___'

const DEFAULT_CONFIG = {
    src: './Src',

}

var Create_Webpack_Config_Data = function(config){
    //var entry_html = this.get_entry_html( './Src' ),
        //entry_js = _.mapObject(entry_html,)
}



Create_Webpack_Config_Data.prototype.get_entry_js = function(glob_path){
    let js_path = path.join( glob_path, 'Js' ),
        js_path_glob = path.join( js_path, '**/*.js' ) ,
        files = glob.sync( js_path_glob );
    
    return _.chain(files)
            .filter(element => {
                console.log(path.join( './', element.replace(/js/ig,'') + 'html' ))
                console.log(fs.existsSync(  path.join( './', element.replace(/js/ig,'') + 'html' )  ))
               return fs.existsSync(  path.join( './', element.replace(/js/ig,'') + 'html' )  ) ;
               // return fs.existsSync( './' +  )
            })
            .map(element => {
                console.log('map '+element)
                return [
                   path.relative( js_path, element ).replace(path.sep, CHUNK_NAME_SEP).replace('.js','') 
                    ,  './' + element//path.join('./', element)
                ]
            })
            .object()
            .value();
}

Create_Webpack_Config_Data.prototype.get_entry_html = function(glob_path){
    let path_glob = path.join( glob_path, '**/*.html' ),
        files = glob.sync( path_glob, {
            ignore:  '**/Old_WebSite/**/*.html' 
        } );
    console.log('get_entry_html')
    console.log(files)
    
    return _.chain(files)
            .map(element => {
                var chunk_name = path.relative( glob_path, element ).replace(path.sep, CHUNK_NAME_SEP).replace('.html',''),
                    chunks
                    path_file = '';
                
                if ( chunk_name === 'static___footer' || chunk_name === 'static___header' ) {
                    chunks = [ ];
                    path_file = '';
                }else {
                    chunks =  ['lib', chunk_name]
                }
                return { 
                        filename: path_file + path.relative( glob_path, element ),
                        template: element,
                        inject: false,
                        minify: { //压缩HTML文件
                          removeComments: false, //移除HTML中的注释
                          collapseWhitespace: false //删除空白符与换行符
                        },
                        inject: 'body',
                        chunks: chunks,
                        hash: true
                     }
                
            })
            .value();

    
}

module.exports = Create_Webpack_Config_Data;