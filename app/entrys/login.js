import 'jquery-ui/ui/widgets/dialog.js';
import '../assets/scss/login.scss';

//记住密码
$(".remember-pw-logo").on("click", () => {
    console.log("rem psw");
});

//展示或关闭版本信息
$("i.update-logo").on("click", () => {
    console.log("display version inf");
});

//登录按钮
$("button.login-btn").on('click', () => {
    console.log("login!");
});

//忘记密码，找回密码入口
$('.find-pw-btn').on("click", () => {
    console.log("find psw");
})