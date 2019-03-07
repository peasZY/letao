//入口函数
$(function(){
    //1.登录功能函数
    login();
    function login(){
        //1.给登录按钮注册点击事件
        //2.判断用户名和密码都不能为空
        //3.调用API去登录
        //4.登陆成功后返回对应商品详情界面
        $('#main .btn-login').on('tap',function(){
            //获取用户名,判断是否为空
            var userName = $('#main .user-name').val().trim();
            if(!userName){
                mui.toast('用户名不能为空',{
                    duration: 500,
                    type: 'div'
                });
                //后续代码不执行
                return false;
            }
            var pwd = $('#main .pwd').val().trim();
            if(!pwd){
                mui.toast('密码不能为空',{
                    duration: 500,
                    type: 'div'
                });
                //后续代码不执行
                return false;
            }
            //调用API
            $.ajax({
                type: "post",
                url: "/user/login",
                data: {username:userName,password:pwd},
                success: function (response) {
                    // 判断是否登录成功
                    if(response.error){
                        //登录失败,提示错误信息
                        mui.toast(response.message,{
                            duration: 1000,
                            type: 'div',
                        });
                    }else{
                        //本地保存登录状态
                        localStorage.setItem('loginState','ture');

                        //登录成功,跳转至对应商品详情页
                        location = getQueryString('returnurl');
                    }
                }
            });
        });
    };


    // 公共的 使用正则封装的一个获取url参数值的函数
    function getQueryString(name) {
        var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
        var arr = location.search.match(reg);
        if (arr != null) {
            // console.log(arr[0].indexOf('='));
            // console.log(arr[0].indexOf('=')+1);
            return decodeURI(arr[0].substr(arr[0].indexOf('=')+1));
        }
        return "";
    };
    
});