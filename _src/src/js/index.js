let isSupportWebp = (() => {

    var elem = document.createElement('canvas');

    if (!!(elem.getContext && elem.getContext('2d'))) {
        // was able or not to get WebP representation
        return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    }
    else {
        // very old browser like IE 8, canvas not supported
        return false;
    }

})()

let isNeedWebp = (() => {
    return location.href.indexOf('notwebp=1') === -1
})()

new vip_lazyload({
    load_before: function(element, url){
        if ( isNeedWebp && isSupportWebp ){
            return url +'&imageMogr2/format/webp/quality/75'
        }else {
            return url
        }
        
    }
})