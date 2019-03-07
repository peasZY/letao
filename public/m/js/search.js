$(function () {
    addHistory();
    queryHistory();
    delSingleHistory();
    clearHistory();
    // 初始化mui区域滑动
    initScroll();
    gotoProductList();

    // 定义全部变量,阻止删除记录事件跳转页面
    var isGoto = true;

    /* 1.添加记录函数 */
    function addHistory() {
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

            //刷新查询记录
            queryHistory();
            //7.清空搜索框的值
            $('#main input').val('');

            //8.点击跳转至商品列表页面,并传递一些参数
            location.href = "productlist.html?search=" + txt + "&time=" + new Date().getTime();

        });
    }

    /* 2.查询记录函数 */
    function queryHistory() {
        /* 获取本地存储的数据 */
        var searchHistory = localStorage.getItem('searchHistory');
        // 判断是否存在本地数据
        if (searchHistory) {
            searchHistory = JSON.parse(searchHistory);
        } else {
            searchHistory = [];
        }
        //调用模板传入本地数据
        var html = template('searchHistoryTpl', {
            list: searchHistory
        });
        //渲染到ul上
        $('#main .search-history ul').html(html);
    }

    /* 3.删除单个记录函数 */
    function delSingleHistory() {
        //给父元素注册点击事件
        $('#main .search-history ul').on('tap', 'i', function () {
            isGoto = false;
            //获取要删除数组元素的索引index
            var index = $(this).data('index');
            //获取本地存储数据
            var searchHistory = localStorage.getItem('searchHistory');
            searchHistory = JSON.parse(searchHistory);
            //删除数组中指定的元素
            searchHistory.splice(index, 1);
            //删除本地存储数据,替换已存在的数据
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            //刷新查询记录
            queryHistory();

        });
    }
    /* 4.删除所有记录的函数 */
    function clearHistory() {
        //给删除记录按钮添加点击事件
        $('.search-history .title a').on('tap', function () {
            //删除本地存储的建和值
            localStorage.removeItem('searchHistory');
            //刷新查询记录
            queryHistory();
        });
    }

    /* 5. 滑动列表 初始化区域滚动的函数*/
    function initScroll() {
        //  初始化区域滚动
        mui('.mui-scroll-wrapper').scroll({
            indicators: false, //是否显示滚动条 如果不想要滚动条把这个参数的值改成false
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏        
        });
    }

    /* 6.给历史记录li添加点击事件,实现跳转至商品列表界面 */
    function gotoProductList() {
        //给li添加点击事件
        $('.search-history .mui-table-view').on('tap', 'li', function () {
            if (isGoto) {
                //获取li的搜索内容
                var search = $(this).data('value');
                //跳转界面
                location.href = 'productlist.html?search=' + search + '&time=' + new Date().getTime();
            }
            //重置
            isGoto = true;
        });
    }
});