$(function(){
   
    // 1.ajax请求左侧分类
    $.ajax({
        //默认是get请求,所以不用写请求类型了
        url : '/category/queryTopCategory',
        // 请求成功的回调函数
        success: function(obj){ 
            // console.log(obj);
            var html = template('categoryLeftTpl',obj);
            console.log(html);
            $('.category-left ul').html(html);
        },
        // 请求失败的回调函数
        error: function(error){
            console.log(error);
        }
    });

    //2.默认获取id为1的右侧的二级分类
        getSecondCategory(1);
    //定义一个全局的旧id
    var oldId = 0;
    //完成点击左侧分类切换右侧分类的事件
    //给父元素注册点击事件,然后委托给子类li
    $('.category-left ul').on('tap','li',function(){
        //1.给当前点击li添加active其他的兄弟删除
        $(this).addClass('active').siblings().removeClass('active');
    
        //2.获取当前元素存的id
        var id = this.dataset['id'];
        //zepto获取自定义属性的值,通过data函数,除了取值还可以类型转换
        // var id = $(this).data('id');  
        //3.判断当前点击的是否还是同一个
        //return yu return false 的区别 return false;
        if(id == oldId){
            return false;
        }
        //4.调用获取二级分类的函数
        getSecondCategory(id);
        oldId = id;
    }); 
     // 3.初始化区域滚动实现分类左侧滚动
     mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    // 封装一个用于获取右侧分类的函数 id为参数
    function getSecondCategory(id){
        $.ajax({
            data: {id:id},
            url: '/category/querySecondCategory',
            success: function(obj){
                // console.log(obj);
                var html = template('categoryRightTpl',obj);
                $('.category-right .mui-row').html(html);
            }
        });
    }
})