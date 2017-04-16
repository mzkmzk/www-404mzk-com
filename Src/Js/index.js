var $ = require('jquery'),
    k_report = require('k-report').default,
    k_logging = require('k-logging').default;
    window.$ = $;



try{
  k_logging.setOptions(
      {
        app_key: 'xlpc',
        open_level : ['info','warn','error'],
        method: ['','', ''],
        switch_listener: true
      }
)
}catch(e){
     console.log(e)
  console.log('k_loggin error');
}


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
    console.log(e)
  console.log('k_report error');
}