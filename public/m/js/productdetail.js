var id = 0;
//入口函数
$(function () {
    // 1.获取商品详情函数
    getProductDetail();
    //调用加入购物车功能函数
    addShoppingCar();

    function getProductDetail() {
        //1.调用函数获取商品id
        id = getQueryString('id');
        console.log(id);
        //2.调用API获取商品详情数据
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: id
            },
            success: function (data) {
                console.log(data);
                // 需要将尺码数据转变为数组类型
                var arr = data.size.split('-');
                var size = [];
                for (var i = arr[0] - 0; i <= arr[1] - 0; i++) {
                    size.push(i);
                }
                data.size = size;
                var html = template('productDetailTpl', data);
                $('#main .mui-scroll').html(html);

                //初始化轮播图
                var gallery = mui('.mui-slider');
                gallery.slider({
                    interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
                });

                //初始化区间滚动
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });
                // 初始化数字输入框
                mui(".mui-numbox").numbox();
            }
        });



    }

    //2.给尺码添加点击事件
    $('#main').on('tap', '.btn-size', function () {
        console.log(this);
        //给选中的添加类
        $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
    });

    //3.加入购物车函数
    /*1.给按钮添加点击事件
      2.判断 尺码,数量是否选择了
      3.调用接口发送请求
     */
    function addShoppingCar() {
        //1.给按钮添加点击事件
        $('#footer .add-cart').on('tap', function () {
            //2.判断尺码,数量是否选择了
            //2.1尺码没选择直接结束
            // $('.productInfo .btn-size').attr('class').indexOf('mui-btn-warning') == -1
            var size = $('.btn-size.mui-btn-warning').data('size');
            if (!size) {
                mui.toast('请选择尺码', {
                    duration: 1000,
                    type: 'div'
                });
                return false;
            }    
            //2.2 数量是否大于0
            //获取选中数量  使用MUI提供的方法获取数字框的值 传递一个数字框的容器
            var num = mui('.mui-numbox').numbox().getValue();
            if (!num) {
                mui.toast('请选择数量', {
                    duration: 1000,
                    type: 'div'
                });
                return false;
            }  
            //3.调用接口发送请求
            $.ajax({
                url: '/cart/addCart',
                type: 'post',
                data: {productId: id,num: num,  size:size},
                success: function(data){
                    console.log(data);
                    //判断是否加入购物车成功
                    if(data.error){
                        //未登录,会跳转值登录界面
                        location = 'login.html?returnurl='+location.href;
                    }else{
                        //加入购物车成功
                        location = 'shoppingCart.html';
                    }
                }
            });
        });
    }

    // 公共的 使用正则封装的一个获取url参数值的函数
    function getQueryString(name) {
        var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
        var arr = location.search.match(reg);
        if (arr != null) {
            return decodeURI(arr[0].split('=')[1]);
        }
        return "";
    };

});