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
import {PasswordInput} from "../components/util/passwordInput/password-input"

function getLoginController() {
    let loginController = {
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
        // $passwordInput:$('input[name=password]'),   //密码输入框
        $whitePanel:$('.white-panel'),              //正面面板
        $oppositePanel:$('.opposite-panel'),        //反面面板
        $submitFindPw:$('.submit-find-account'),    //查找密码提交按钮
        $mobileDownload:$('.mobile-download-btn'),  //移动下载按钮
        $selfServiceUpdate:$('.self-service-update'),   //自助更新按钮

        /**
         * 检测浏览器是否可用
         */
        browser_check: function (){
            return LoginService.support();    //检测浏览器
        },
        /**
         * 初始化登录表单控件
         */
        formInit:function () {
            //初始化密码输入框组件
            let $wrap = $('.password-component');
            this.passwordInputComp = new PasswordInput({checkChar:false},this.setPasswordValue);
            this.passwordInputComp.render($wrap);
            $('.login-content').show();

            //系统名称改变
            this.$loginMainTitle.on('change', () => {
                this.systemName = this.$loginMainTitle.val();
                this.resetSysName(this.systemName);
            });

            //记住密码和忘记密码
            this.$rememberPwCheck.on('click', (event) => {
                this.isRememberKey = event.target.checked;
                //是否启用checkbox的勾选清除缓存（启用则取消下面代码的屏蔽）
                // if(this.isRememberKey === false){
                //     if(this.username_value !== ''){
                //         //缓存中查找并清除当前用户密码
                //         // window.localStorage.removeItem(this.username_value);
                //         let info = window.localStorage.getItem('password_info');
                //         delete info[this.username_value];
                //         window.localStorage.setItem('password_info',info);
                //     }
                // }
            });

            /**
             * 展示或关闭版本信息
             */
            this.$updateGroup.on('click', () => {
                this.$versionTable.toggle();
            });

            /**
             * 登录按钮
             */
            this.$loginBtn.on('click', () => {
                // console.log(this.username_value,this.password_value,);
                // this.password_value = this.passwordInputComp.data.password_value;
                this.userLogin(this.username_value,this.password_value);   //根据用户名和密码登录
            });

            /**
             * 注册按钮
             */
            this.$registerBtn.on('click', () => {
                $(window).attr('location','/register_index');
            });

            /**
             * 忘记密码，找回密码入口
             */
            this.$findPwBtn.on('click', () => {
                this.$whitePanel.hide();
                this.$oppositePanel.fadeIn();
                this.isOpposite = true;
            });

            /**
             * 反面面板关闭返回正面面板
             */
            this.$closeIcon.on('click', () => {
                this.$whitePanel.fadeIn();
                this.$oppositePanel.hide();
                this.isOpposite = false;
            });

            /**
             * 监听用户名输出框
             */
            this.$usernameInput.on('input',_.debounce(() => {
                this.username_value = this.$usernameInput.val();
                this.findPasswordByInput();
            },100));

            /**
             * 密码找回页面提交按钮
             */
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

            /**
             * 自助更新
             */
            this.$selfServiceUpdate.on('click',function () {
                console.log('打开自助更新页面');
            });

            /**
             * 移动下载
             */
            this.$mobileDownload.on('click',function () {
                console.log('打开移动下载页面');
            });

            /**
             * 键盘绑定
             */
            $(document).keypress((event) => {
                if(event.keyCode === 13){
                    if(this.isOpposite === false){
                        this.userLogin(this.username_value,this.password_value);   //根据用户名和密码登录
                    }else{
                        this.$submitFindPw.click();
                    }
                }
            })
        },

        /**
         * 根据用户名输入动态查找缓存记录的用户密码
         */
        findPasswordByInput(){
            let info = window.localStorage.getItem('password_info');
            if(info !== null){
                info = JSON.parse(info);
            }else{
                info = {};
            }

            let password = '';
            if(info.hasOwnProperty(this.username_value)){
                password = info[this.username_value];
                if(password !== undefined && password !== ''){
                    this.isRememberKey = true;
                    this.passwordInputComp.actions.setPswByParent(password);
                    this.$rememberPwCheck.prop('checked',true);
                    this.password_value = password;
                }
            }else{
                this.isRememberKey = false;
                this.passwordInputComp.actions.setPswByParent('');
                this.$rememberPwCheck.prop('checked',false);
                this.password_value = '';
            }
        },

        /**
         * 初始化公司名称
         */
        sysNameInit:function () {
           this.systemName = this.versionInfo.sap_login_system_name;
           this.resetSysName(this.systemName);
        },

        /**
         * 初始化表格中的版本信息
         */
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
        /**
         * 根据缓存数据初始化用户名称和密码框
         */
        infoInit:function () {
            let storage = window.localStorage;
            let info = storage.getItem("password_info");
            if(info !== null){
                info = JSON.parse(info);
            }else{
                info = {};
            }
            let username = '';
            if (info.hasOwnProperty('former_username')){
                username = info.former_username;
            }

            if(username !== '' && username !== undefined){
                this.username_value = username;
                this.$usernameInput.val(this.username_value);
                let password = undefined;
                if(info[this.username_value]){
                    password = info[this.username_value];
                }
                if(password !== undefined && password !== ''){
                    this.password_value = password;
                    this.isRememberKey = true;
                    this.passwordInputComp.actions.setPswByParent(password);
                    this.$rememberPwCheck.prop("checked",true);
                }
            }
        },

        /**
         * 自适应调整系统名称字体大小
         */
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

        /**
         * 用户登录
         */
        userLogin:function (username,password) {
            // console.log(username,password);
            if(password === ''){
                $(".warn-info").html('密码不能为空');
                return;
            }
            let data = {
                username:username,
                password:md5(password)
            };

            let replyMsg = LoginService.userLoginVerification(data);
            let that = this;
            replyMsg.done((result) => {
                if(result.success === 1){
                    //登录成功，设置缓存信息，跳转至index页面
                    let info = JSON.parse(window.localStorage.getItem('password_info')) || {};
                    info['former_username'] = that.username_value;
                    if(this.$rememberPwCheck.prop("checked") === true){
                        info[that.username_value] = that.password_value;
                    }else{
                        delete info[that.username_value];
                    }
                    info = JSON.stringify(info);
                    window.localStorage.setItem('password_info',info);
                    $(window).attr('location','/index');
                }else if(result.success === 0){
                    $(".warn-info").html(result['error']).show();
                }
            }).fail((err) => {
                console.log("登录失败",err.statusText);
            })
        },
        setPasswordValue:function (value) {
            loginController.password_value = value;
        }
    };
    return loginController;
}

/**
 * 检查是否是在子窗口中打开，如果是则父窗口跳转至登录页面
 */
if(window.hasOwnProperty("parent") && window.parent !== window){
    $(window.parent).attr('location','/login');
}

let controller = getLoginController();
let isNeedDownload = controller.browser_check();
if( isNeedDownload === false){      //正常显示登录表单
    controller.formInit();  //初始化表单控件
    controller.infoInit();  //初始化最近访问用户和密码
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
}else{
    //显示浏览器下载提示,隐藏其余部分
    $(".need-download").show();
}
