//用于登录界面初始化与流程控制
import 'jquery-ui/ui/widgets/dialog.js';
import '../assets/scss/login.scss';
import {LoginService} from '../services/login/loginService';
import {md5} from '../services/login/md5';
import msgBox from '../lib/msgbox';

function getLoginController() {
    return {
        loginService:LoginService,
        md5:md5,
        systemName:'',      //公司名称
        loginSize:"26px",
        url:'',
        versionInfo:{},     //后台获取的公司名称和版本信息
        isRememberKey:false,    //记录是否记住密码，点击登陆后根据其状态进行处理
        username_value:'',      //记录用户名称
        password_value:'',      //记录密码
        isOpposite:false,

        //第一步，检测浏览器是否可用
        browser_check: function (){
            return this.loginService.support();    //检测浏览器
        },
        //初始化登录表单控件
        formInit:function () {
            //系统名称改变
            $(".login-main-title").on("change", () => {
                this.systemName = $(".login-main-title").val();
                this.resetSysName(this.systemName);
            });

            //记住密码
            $(".remember-pw-check").on("click", (event) => {
                this.isRememberKey = event.target.checked;
            });

            //展示或关闭版本信息
            $("i.update-logo").on("click", () => {
                $(".version-table").toggle();
            });

            //登录按钮
            $("button.login-btn").on('click', () => {
                // this.username = $("input[name=username]").val();
                // this.password = $("input[name=password]").val();
                this.userLogin(this.username_value,this.password_value);   //根据用户名和密码登录
            });

            //忘记密码，找回密码入口
            $(".find-pw-btn").on("click", () => {
                setTimeout(() => {
                    $(".white-panel").hide();
                    $(".opposite_panel").show();
                    this.isOpposite = true;
                },200);
            });
            //反面面板关闭返回正面面板
            $(".close-icon").on("click", () => {
                $(".white-panel").show();
                $(".opposite_panel").hide();
                this.isOpposite = false;
            });
            //监听用户名输出框
            $("input[name=username]").on("input",() => {
                this.username_value = $("input[name=username]").val();
            });
            //监听密码输入框
            $("input[name=password]").on("input",() => {
                this.password_value = $("input[name=password]").val();
            }).on("focus",() => {
                //查找缓存中是否有当前用户密码
                if(this.username_value !== ''){
                    let password = window.localStorage.getItem(this.username_value);
                    if(password !== undefined && password !== null){
                        this.isRememberKey = true;
                        $(".input[name=password]").val(password);
                        $(".remember-pw-check").prop("checked",true);
                    }
                }
            });
            //密码找回页面提交按钮
            $(".submit-find-account").on("click", () => {
                let userName = $(".account-input").val();
                let result = LoginService.findPassword(userName);
                result.done((result) => {
                    console.log(result);
                    if(result.success === 1){
                        msgBox.alert("提交成功！我们已发送邮件至您的邮箱中，请注意查收！");
                    }else{
                        msgBox.alert(result.error)
                    }
                }).fail((err) => {
                    console.log("提交失败",err)
                })
            });
            $(document).keypress((event) => {
                if(event.keyCode === 13){
                    if(this.isOpposite === false){
                        $("button.login-btn").click();
                    }else{
                        console.log("do opposite");
                        $(".submit-find-account").click();
                    }
                }
            })
        },
        sysNameInit:function () {
           this.systemName = this.versionInfo.sap_login_system_name;
           this.resetSysName(this.systemName);
        },
        versionInit:function () {
            let info = this.versionInfo.rows;
            let $table = $(".version-table");
            let version = this.testVersionData;

            for (let obj of info){
                let $row = $("<tr></tr>");

                let $module = $("<td></td>");
                $module.html(obj["module"]);
                $row.append($module);

                let $codeTime = $("<td></td>");
                $codeTime.html(obj["last_change_time"]);
                $row.append($codeTime);

                let $updateTime = $("<td></td>");
                $updateTime.html(obj["update_time"]);
                $row.append($updateTime);

                let $runStats = $("<td></td>");
                $runStats.html(obj["run_stats"]);
                $row.append($runStats);

                $table.append($row);
            }
            // $table.hide();
        },
        infoInit:function () {
            let storage = window.localStorage;
            let username = storage.getItem("former_username");  //获取最后一个登陆用户名
            if(username !== undefined){
                this.username_value = username;
                $("input[name=username]").val(this.username_value);
                let password = storage.getItem(this.username_value);    //根据用户名查找是否保存密码
                if(password !== undefined && password !== null){
                    this.password_value = password;
                    this.isRememberKey = true;
                    $("input[name=password]").val(password);
                    $(".remember-pw-check").prop("checked",true);
                }
            }
        },
        //自适应调整系统名称字体大小
        resetSysName:function (systemName) {
            // if(systemName !== undefined){
            //     //如果系统名大于10个字(需换行)后字体自适应
            //     let arr = this.systemName.split("\n");
            //     if(arr[0].length>10){
            //         let str = arr[0];
            //         let num = Math.floor(300/str.length);
            //         if( num>26 ){
            //             num = 26;
            //         }
            //         this.loginSize = num + 'px';
            //     }else {
            //         this.loginSize = '26px';
            //     }
            // }
            //设置系统名
            $('.company-info').html(systemName);
        },
        userLogin:function (username,password) {
            let data = {
                username:username,
                password:this.md5(password)
            };
            let replyMsg = this.loginService.userLogin(data);
            replyMsg.done((result) => {
                // console.log(result);
                if(result.success === 1){
                    //登录成功，设置缓存信息，跳转至index页面
                    window.localStorage.setItem("former_username",this.username_value);
                    if($(".remember-pw-check").prop("checked") === true){
                        window.localStorage.setItem(this.username_value,this.password_value);
                    }else{
                        window.localStorage.removeItem(this.username_value);
                    }
                    $(window).attr('location','/index');
                }else if(result.success === 0){
                    $(".warn-info").html(result['error']).show();
                }
            }).fail((err) => {
                console.log("登录失败",err.statusText);
            })
        },
    };
}

let controller = getLoginController();
let isNeedDownload = controller.browser_check();
if( isNeedDownload === false){
    //正常显示登录表单
    LoginService.getVersionInfo()
    .done((result) => {
        controller.versionInfo = result;
        controller.sysNameInit();//初始化公司名称
        controller.versionInit();//初始化版本table
    }).fail((err) => {
        $(".version-table").hide();
        console.log("get version info fail", err.statusText);
    });
    controller.formInit();  //初始化表单控件
    controller.infoInit();  //初始化最近访问用户和密码
}else{
    //显示浏览器下载提示
}






