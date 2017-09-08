/**
 * @author zhaoyan
 * 打开登录界面
 */
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import '../assets/scss/login.scss';
import 'jquery-ui/ui/widgets/dialog.js';
import {LoginService} from '../services/login/loginService';
import {md5} from '../services/login/md5';
import msgBox from '../lib/msgbox';

function getLoginController() {
    return {
        systemName:'',      //公司名称
        // loginSize:"26px",
        versionInfo:{},     //后台获取的公司名称和版本信息
        isRememberKey:false,    //记录是否记住密码，点击登陆后根据其状态进行处理
        username_value:'',      //记录用户名称
        password_value:'',      //记录密码
        isOpposite:false,       //记录页面状态
        versionBtnOpen:1,       //是否可以查看更新信息
        registerBtnOpen:1,      //是否可以使用注册功能

        $loginMainTitle:$('.login-main-title'),     //系统名称显示
        $companyInfo:$('.company-info'),            //公司名称显示
        $rememberPwCheck:$('.remember-pw-check'),   //记住密码
        $updateGroup:$('.update-btn'),              //显示更新信息logo
        $versionTable:$('.version-view'),          //版本信息显示表格
        $loginBtn:$('button.login-btn'),            //登录按钮
        $registerBtn:$('div.register-btn'),         //注册按钮
        $findPwBtn:$('.find-pw-group'),             //忘记密码
        $closeIcon:$('.close-icon'),                //找回密码面板关闭按钮
        $usernameInput:$('input[name=username]'),   //用户名输入框
        $passwordInput:$('input[name=password]'),   //密码输入框
        $whitePanel:$('.white-panel'),              //正面面板
        $oppositePanel:$('.opposite-panel'),        //反面面板
        $submitFindPw:$('.submit-find-account'),    //查找密码提交按钮
        $mobileDownload:$('.mobile-download-btn'),  //移动下载按钮
        $selfServiceUpdate:$('.self-service-update'),   //自助更新按钮


        //检测浏览器是否可用
        browser_check: function (){
            return LoginService.support();    //检测浏览器
        },
        //初始化登录表单控件
        formInit:function () {
            //系统名称改变
            this.$loginMainTitle.on('change', () => {
                this.systemName = this.$loginMainTitle.val();
                this.resetSysName(this.systemName);
            });

            //记住密码和忘记密码
            this.$rememberPwCheck.on('click', (event) => {
                this.isRememberKey = event.target.checked;
                if(this.isRememberKey === false){
                    if(this.username_value !== ''){
                        //缓存中查找并清除当前用户密码
                        window.localStorage.removeItem(this.username_value);
                    }
                }
            });

            //展示或关闭版本信息
            this.$updateGroup.on('click', () => {
                this.$versionTable.toggle();
            });

            //登录按钮
            this.$loginBtn.on('click', () => {
                console.log('click');
                // this.username = this.$usernameInput.val();
                // this.password = this.$passwordInput.val();
                this.userLogin(this.username_value,this.password_value);   //根据用户名和密码登录
            });
            //注册按钮
            this.$registerBtn.on('click', () => {
                $(window).attr('location','/register_index');
            });
            //忘记密码，找回密码入口
            this.$findPwBtn.on('click', () => {
                this.$whitePanel.hide();
                this.$oppositePanel.fadeIn();
                this.isOpposite = true;
            });

            //反面面板关闭返回正面面板
            this.$closeIcon.on('click', () => {
                this.$whitePanel.fadeIn();
                this.$oppositePanel.hide();
                this.isOpposite = false;
            });

            //监听用户名输出框
            this.$usernameInput.on('input',() => {
                this.username_value = this.$usernameInput.val();
            });

            //监听密码输入框
            this.$passwordInput.on('input',() => {
                this.password_value = this.$passwordInput.val();
            }).on('focus',() => {
                //查找缓存中是否有当前用户密码
                if(this.username_value !== ''){
                    let password = window.localStorage.getItem(this.username_value);
                    if(password !== undefined && password !== null){
                        this.isRememberKey = true;
                        this.$passwordInput.val(password);
                        this.$rememberPwCheck.prop('checked',true);
                    }
                }
            });

            //密码找回页面提交按钮
            this.$submitFindPw.on('click', _.throttle(() => {
                let userName = $('.account-input').val();
                let result = LoginService.findPassword(userName);
                result.done((result) => {
                    if(result.success === 1){
                        msgBox.alert('提交成功！我们已发送邮件至您的邮箱中，请注意查收！');
                    }else{
                        msgBox.alert(result.error)
                    }
                }).fail((err) => {
                    console.log('提交失败',err)
                })
            },4000));

            //自助更新
            this.$selfServiceUpdate.on('click',function () {
                console.log('打开自助更新页面');
            });

            //移动下载
            this.$mobileDownload.on('click',function () {
                console.log('打开移动下载页面');
                // $(window).attr('location','/find_pwd');  测试密码找回页面
            });

            //键盘绑定
            let that = this;
            $(document).keypress((event) => {
                if(event.keyCode === 13){
                    if(that.isOpposite === false){
                        that.userLogin(that.username_value,that.password_value);   //根据用户名和密码登录
                    }else{
                        that.$submitFindPw.click();
                    }
                }
            })
            //根据权限处理versionBtn和registerBtn
        },
        //初始化公司名称
        sysNameInit:function () {
           this.systemName = this.versionInfo.sap_login_system_name;
           this.resetSysName(this.systemName);
        },
        //初始化版本信息
        versionInit:function () {
            let info = this.versionInfo.rows;
            let $table = $('.version-table');

            for (let obj of info){
                let $row = $('<tr></tr>');

                let $module = $('<td></td>');
                $module.html(obj["module"] || '-');
                $row.append($module);

                let $codeTime = $('<td></td>');
                $codeTime.html(obj["last_change_time"] || '-');
                $row.append($codeTime);

                let $updateTime = $('<td></td>');
                $updateTime.html(obj["update_time"] || '-');
                $row.append($updateTime);

                let $runStats = $('<td class="run-btn"></td>');
                $runStats.html(obj["run_stats"] || '-');
                $row.append($runStats);

                let $branch = $("<td class='default-hide'></td>");
                $branch.html(obj['branch'] || '-');
                $row.append($branch);

                let $revision = $("<td class='default-hide'></td>");
                $revision.html(obj["revision"] || '-');
                $row.append($revision);

                let $message = $("<td class='default-hide'></td>");
                $message.html(obj["run_message"] || '-');
                $row.append($message);

                $table.append($row);
            }
            $(".run-btn").on("click", () => {
                $(".default-hide").toggle();
            })
        },
        infoInit:function () {
            let storage = window.localStorage;
            let username = storage.getItem("former_username");  //获取最后一个登陆用户名
            if(username !== undefined){
                this.username_value = username;
                this.$usernameInput.val(this.username_value);
                let password = storage.getItem(this.username_value);    //根据用户名查找是否保存密码
                if(password !== undefined && password !== null){
                    this.password_value = password;
                    this.isRememberKey = true;
                    this.$passwordInput.val(password);
                    this.$rememberPwCheck.prop("checked",true);
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
            this.$companyInfo.html(systemName);
            $(document).find("title").html(systemName);
        },
        //用户登录
        userLogin:function (username,password) {
            let data = {
                username:username,
                password:md5(password)
            };
            let replyMsg = LoginService.userLoginVerification(data);
            replyMsg.done((result) => {
                if(result.success === 1){
                    //登录成功，设置缓存信息，跳转至index页面
                    window.localStorage.setItem("former_username",this.username_value);
                    if(this.$rememberPwCheck.prop("checked") === true){
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

//检查是否是在子窗口中打开，如果是则父窗口跳转至登录页面
if(window.hasOwnProperty("parent") && window.parent !== window){
    $(window.parent).attr('location','/login');
}

let controller = getLoginController();
let isNeedDownload = controller.browser_check();
if( isNeedDownload === false){      //正常显示登录表单
    LoginService.getVersionInfo().done((result) => {
        if(result.success === 1){
            if(result.use_register && result.use_register.toString() === "0"){
                $('.register-btn').hide();
            }
            if(result.sap_login_system_version && result.sap_login_system_version.toString() === "0"){
                $('.update-btn').hide();
            }
            if(result.show_publish_link && result.show_publish_link.toString() === "0"){
                $('.self-service-update').hide();
            }

            controller.versionInfo = result;
            controller.sysNameInit();   //初始化公司名称
            controller.versionInit();   //初始化版本table
        }else{
            console.log("版本数据获取失败");
        }
    }).fail((err) => {
        console.log("get version info fail", err.statusText);
    });
    controller.formInit();  //初始化表单控件
    controller.infoInit();  //初始化最近访问用户和密码
}else{
    //显示浏览器下载提示,隐藏其余部分
    $(".login-content").hide();
    $(".need-download").show();
}
