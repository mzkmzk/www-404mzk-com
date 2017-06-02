let $ = require('jquery'),
    k_report = require('k-report').default,
    k_logging = require('k-logging').default;
    window.$ = $;

import '../Css/index.scss'
import _ from 'underscore'

try{
  k_logging.setOptions(
      {
        app_key: '404mzk',
        open_level : ['info','warn','error'],
        method: ['','', ''],
        switch_listener: true
      }
)
}catch(e){
    // console.log(e)
  //console.log('k_loggin error');
}

//header
let window_inner_height = window.innerHeight
document.addEventListener('scroll', () => {
  let body_scroll_top = document.body.scrollTop

  k_logging.info('body_scroll_top: '+body_scroll_top)
  k_logging.info('window_inner_height: '+window_inner_height)
  if ( (document.body.scrollTop + 50 )< window.innerHeight  ){
    $('.header').hide()
  }else {
    $('.header').show()
  }
})



//alert(7)


try{
  k_report.setOptions(
    {
    'debug': false,
    'loadtime': {
        'url': 'http://k-inner-report.404mzk.com/v1/Creator_Loadtime_Controller/insert',
    },
    'network': {
        'url': 'http://k-inner-report.404mzk.com/v1/Creator_Network_Controller/insert',
        'timeout': 1000,
    },
    'error': {
        'url': 'http://k-inner-report.404mzk.com/v1/Creator_Error_Controller/insert',
    }}
)
}catch(e){
   // console.log(e)
  //console.log('k_report error');
}