$(function () {
    // mui初始化轮播图
    //获得slider插件对象
    mui('.mui-slider').slider({
        interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
    });
    //初始化mui的区域滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    //swiper初始化轮播图
    new Swiper('.slide .swiper-container', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
    });
    //swiper初始化区域滚动
    new Swiper('#main> .swiper-container', {
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbar: {
          el: '.swiper-scrollbar',
        },
        mousewheel: true,
      });
  

})