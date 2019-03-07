//全局变量默认 1;
var page = 1;
//全局变量判断是否需要进行重新上拉加载
var isMore = false;
//入口函数
$(function () {
    // 1.判断是否为登录状态
    if (!localStorage.getItem('loginState')) {
        //未登录,跳到登录界面
        location = 'login.html?returnurl=' + location.href;
        return false;
    }

    //2.查询购物车带分页接口
    queryCart();
    //3.下拉刷新和上拉加载函数
    cartRefresh();
    //4.侧滑出来的删除功能
    delProduct();


    /* 查询购物车带分页接口 */
    function queryCart() {
        $.ajax({
            url: "/cart/queryCartPaging",
            data: {
                page: 1,
                pageSize: 4
            },
            success: function (res) {
                console.log(res);
                var html = template('queryCartTpl', res);
                $('#main ul').html(html);
            }
        });
    }

    /* 下拉刷新和上拉加载函数 */
    function cartRefresh() {
        mui.init({
            pullRefresh: {
                container: "#pullrefresh", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    callback: pullDownRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                },
                up: {
                    callback: pullUpRefresh
                }
            }
        });

        //下拉刷新具体业务函数
        function pullDownRefresh() {
            //如果想请求慢一点,可以给一个定时器
            setTimeout(function () {
                //重新查询购物车
                queryCart();
                //没有更多内容了endPulldownToRefresh 传入true， 不再执行下拉刷新
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                //判断是否需要进行重置上拉加载有效
                if (isMore) {
                    mui('#pullrefresh').pullRefresh().refresh(true);
                    //page重置为1
                    page = 1;
                }

            }, 1000);
        }

        //上拉加载
        function pullUpRefresh() {
            setTimeout(function () {
                //请求网络数据
                $.ajax({
                    url: '/cart/queryCartPaging',
                    //page自增
                    data: {
                        page: ++page,
                        pageSize: 4
                    },
                    success: function (res) {
                        console.log(res);
                        // 因为data数据后台返回有点问题 当没有数据 后台直接返回空数组 而不是对象 
                        // 如果是空数组传入到模板使用里面的data会报错
                        if (Array.isArray(res)) {
                            // 判断如果是一个空数组 赋值给一个对象 里面有data数组值为空
                            res = {
                                data: []
                            }
                        }
                        if (res.data.length > 0) {
                            var html = template('queryCartTpl', res);
                            $('#main ul').append(html);
                            //没有更多内容了 传入true， 不再执行下拉刷新
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        } else {
                            //当没有更多内容的时候
                            isMore = true;
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(isMore);
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            }, 1000);
        }
    }

    /* 删除商品功能 */
    function delProduct() {
        /*  1.添加点击事件
            2.调用接口删除购物车商品
            3.重新加载购物车数据 
        */
        //给ul注册点击事件委托给删除按钮
        $('#main ul').on('tap', '.btn-delete', function () {
            //获取id
            id = $(this).data('id');
            //弹出提示框是否删除商品,使用mui提示框
            /* 
                参数1:提示对话框上显示的内容,可以使文本也可以是html
                参数2:提示对话框上显示的标题
                参数3:提示对话框上按钮显示的内容
                参数4:提示对话框上关闭后的回调函数,有一个参数e e.index对应的是参数3中数组的的索引
            */
            mui.confirm('您是否要删除此商品', '<strong>温馨提示</strong>', ['确定', '取消'], function (e) {
                //用户点击了是,删除商品,调用接口去删除商品
                if (e.index == 0) {
                    $.ajax({
                        url: '/cart/deleteCart',
                        data: {
                            id: id
                        },
                        success: function (res) {
                            console.log(res);
                            //删除商品成功,重新加载页面
                            if (res.success) {
                                queryCart();
                            }
                        }
                    });
                }
            });

        });
    }
});