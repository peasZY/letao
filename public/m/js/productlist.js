//全局变量需要写在入口函数外面
var search = '';
//默认page=1;
var page = 1;
//全局变量判断是否需要进行重新上拉加载
var isMore = false;
$(function () {
    // 1.页面刚加载调用当前查询商品的函数
    queryProduct();
    //2.点击当前页面商品搜索按钮也要实现搜索功能
    searchProducts();
    // 3.调用下拉刷新和上拉加载的功能函数
    pullRefresh();
    //4.商品排序功能
    sortProduct();

    /* 1.页面刚加载调用当前查询商品的函数 */
    function queryProduct() {
        /* 
        思路:1.localstorage.search获取url的参数
            2.分割参数,获得所需要的参数
            3.ajax请求,获取数据
    */
        search = getQueryString('search');
        $('.search-form input').val(search);
        $.ajax({
            url: '/product/queryProduct',
            data: {
                page: 1,
                pageSize: 4,
                proName: search
            },
            success: function (res) {
                console.log(res);
                var html = template('productListTpl', res);
                $('.products-list .mui-row').html(html);
            }
        });
    }

    /* 2.点击当前页面商品搜索按钮也要实现搜索功能 */
    function searchProducts() {
        //1.点击搜索按钮保存查询记录到本地存储中
        $('.search-form .btn-search').on('tap', function () {
            //1.获取搜索框的内容,并去掉两头的空格
            var txt = $('#main input').val().trim();
            //2.判断输入的内容是否为空 使用MUI的消息框 自动消失消息框
            if (txt == '') {
                //提示请输入要搜索的商品
                mui.toast({
                    duration: 'long',
                    type: 'div'
                });
                // 后面的代码也不执行了 所有使用return
                // return;
                // return false 不仅仅可以终止当前函数 还可以终止后面还要做的事情 比如表单提交等
                return false;
            }

            var searchHistory = localStorage.getItem('searchHistory');
            //3.存储前还要判断是否存在本地存储
            if (searchHistory) {
                searchHistory = JSON.parse(searchHistory);

            } else {
                searchHistory = [];
            }

            //4.遍历数组,去掉数组中存在的本次搜索值,
            for (var i = 0; i < searchHistory.length; i++) {
                if (searchHistory[i].key == txt) {
                    searchHistory.splice(i, 1);
                    i--;
                }
            }
            //5.往数组中添加元素
            searchHistory.unshift({
                key: txt,
                time: new Date().getTime()
            });
            //6.本地存储只能存简单类型数据,需要把数组转成json
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

            //8.点击跳转至商品列表页面,并传递一些参数
            location.href = "productlist.html?search=" + txt + "&time=" + new Date().getTime();

        });
    }

    /* 3.初始化mui下拉刷新和上拉加载 */
    function pullRefresh() {
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
                //重新查询商品
                queryProduct();
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
                    url: '/product/queryProduct',
                    //page自增
                    data: {
                        page: ++page,
                        pageSize: 4,
                        proName: search
                    },
                    success: function (res) {
                        console.log(res);
                        if (res.data.length > 0) {
                            var html = template('productListTpl', res);
                            $('.products-list .mui-row').append(html);
                            //没有更多内容了 传入true， 不再执行下拉刷新
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        } else {
                            //当没有更多内容的时候
                            isMore = true;
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(isMore);
                        }
                    }
                });
            }, 1000);
        }
    }

    /* 4. 商品排序功能函数*/
    function sortProduct(){
        /* 思路
            1. 给所有排序按钮添加点击事件
            2. 切换active类名
            3. 获取当前排序的方式 (提前把所有按钮排序方式保存到按钮属性上 通过js去获取排序方式)
            4. 调用API传人当前商品排序的方式 和 排序顺序（1表示升序  2 表示降序）
            5. 获取后台排序后的商品数据 调用模板 
            6. 把模板渲染到页面 */
        //1.给所有排序按钮添加点击事件
        $(".products-list .mui-card-header a").on('tap',function(){
            //2.切换active类名
            $(this).addClass('active').siblings().removeClass('active')
            //3.获取当前排序的方式
            var sort = $(this).data('sort');
            // 4. 如果默认顺序是2降序 点击了之后改成1升序 如果默认是1升序 点击了变成2降序
            if(sort == 2){
                sort = 1;
                //4.1 更改图标
                $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
            }else{
                sort = 2;
                //4.2 更改图标
                $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
            //4.3 更改data-sort 的值
            $(this).data('sort',sort);
            //5.获取当前的排序类型
            var type = $(this).data('type');
            var obj = {
                page: 1,
                pageSize : 4,
                proName: search
            };
            //5.1动态的给对象添加属性
            obj[type] = sort;
            //6.调用API传入当前的排序类型和排序的顺序
            $.ajax({
                url : "/product/queryProduct",
                data : obj,
                success : function(data){
                    // console.log(data);
                    var html = template('productListTpl',data);
                    $('.products-list .mui-row').html(html);
                }
            });
        });

    }

    /* 给点击购买按钮添加点击事件,实现跳转商品详情页面 */
    $(".mui-card-content .mui-row").on('tap','.product-buy',function(){
        var id = $(this).data('id');
        location = 'productdetail.html?id='+id;
    });

    /* 封装函数获取传递过来的参数值 */
    // function getQueryString(search){
    //     var arr = location.search.substr(1).split('&');
    //     for(var i=0;i < arr.length;i++){
    //         if(arr[i].split('=')[0] == search){
    //             return decodeURI(arr[i].split('=')[1]);
    //             //默认url中文是encodeURI 
    //         }
    //     }
    //     return '';
    // }

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