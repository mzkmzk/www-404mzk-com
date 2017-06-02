document.querySelector('.menu .bt').addEventListener('click',function(){
    //console.log('menu bt click');
    var $content = document.getElementsByClassName('show-button')[0];
    $content.setAttribute('style','display:inherit');
    $content.classList.toggle('slideOutDown');
    $content.classList.toggle('slideInDown');
},false);

window.onload = function(){
    document.querySelector('.background-image').setAttribute ('style','opacity: 1;');
}