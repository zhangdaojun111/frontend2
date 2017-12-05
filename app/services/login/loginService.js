//具体实现登录与后台交互
import {HTTP} from "../../lib/http"
import {Utils} from "./utils"

export const LoginService = {
    http:HTTP,
    utils:Utils,
    needDownload:false,
    username_value:'',
    password_value:'',
    userName:'',
    downLoadLink:'',
    prompt:'',
    currentSystem:'',
    /**
     * 检查当前浏览器是否为chrome
     * @returns {boolean}
     */
    support:function () {
        let browser = this.currentBrowser();
        console.log(browser);
        let system=this.CurrentSystem().system;
        // let currentSystem;

        for(let key in system){
            if(system[key] != false){
                this.currentSystem = key;
            }
        }

        if(!browser['chrome']){
            if(this.currentSystem== 'android' || this.currentSystem== 'ios' || this.currentSystem== 'iphone' || this.currentSystem== 'ipad'){
                this.prompt = "为了保证更好的使用体验, 请切换到chrome浏览器访问";
                this.downLoadLink = 'False';
            }else{
                this.prompt = "为了保证更好的使用体验，请您使用我们为您推荐的浏览器";
            }
            this.needDownload = true;
        }

       else if(browser['chrome']){
           if((browser['chrome'].slice(0,2)<62 && this.currentSystem== 'win') || (browser['chrome'].slice(0,2)<62 && this.currentSystem == 'mac')){
               this.prompt="您的浏览器版本过低，为了您的正常使用请下载新版本";
               this.needDownload=true;
            }
        }
        //优先保证win和mac
        if(this.needDownload  && this.downLoadLink != 'False'){
            switch (this.currentSystem){
                case 'win':
                    this.downLoadLink='http://sw.bos.baidu.com/sw-search-sp/software/e80aba170ee7c/ChromeStandalone_62.0.3202.94_Setup.exe';
                    break;
                case 'mac':
                    this.downLoadLink='http://sw.bos.baidu.com/sw-search-sp/software/286b666135022/googlechrome_mac_62.0.3202.89.dmg';
                    break;
                // case 'iphone':
                //     this.downLoadLink='https://appsto.re/cn/NVp8F.i';
                //     break;
                default :
                    this.downLoadLink='';
                    this.prompt='暂不支持windows，mac外的操作系统';
                    break;
            }
        }
        // if(currentSystem == 'android'){
        //     this.needDownLoad=true;
        //     this.prompt="Android用户请下载本公司APP";
        //     this.downLoadLink='https://wxtest.erdstest.com:8088/android/ERDS_2017.03.23_Android_V1.2.24.apk';
        // }
        return this.needDownload;
    },
    /**
     * 获取浏览器信息
     * @returns {{}}
     */
    currentBrowser:function(){
        let Browser = {
        };
        let ua = navigator.userAgent.toLowerCase();
        console.log(ua);
        let s;
        (s = ua.match(/msie ([\d.]+)/)) ? Browser['ie'] = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Browser['firefox'] = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Browser['chrome'] = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Browser['opera'] = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Browser['safari'] = s[1] : 0;
        return Browser;
    },
    /**
     * 获取设备信息
     * @returns {{}}
     */
    CurrentSystem:function() {
        let system = {
            win: false,
            mac: false,
            xll: false,
            iphone: false,
            ipoad: false,
            ipad: false,
            ios: false,
            android: false,
            nokiaN: false,
            winMobile: false,
            wii: false,
            ps: false
        };
        let ua = navigator.userAgent;
        // 检测平台
        let p = navigator.platform;
        system.win = p.indexOf('Win') == 0;
        system.mac = p.indexOf('Mac') == 0;
        // system.xll = (p.indexOf('Xll') == 0 || p.indexOf('Linux') == 0);
        system.xll =  p.indexOf('Linux') == 0;
        // 移动设备
        system.iphone = ua.indexOf('iPhone') > -1;
        system.ipoad = ua.indexOf('iPod') > -1;
        system.ipad = ua.indexOf('iPad') > -1;
        system.nokiaN = ua.indexOf('nokiaN') > -1;
        // 检测IOS版本
        if (system.mac && ua.indexOf('Mobile') > -1) {
            if (/CPU (?:iPhone )?OS (\d+_\d+)/i.test(ua)) {
                system.ios = true;
            }
        }
        // 检测Android版本
        if (/Android (\d+\.\d+)/i.test(ua)) {
            system.android = parseFloat(RegExp['$1'])?true:false;
        }
        // 游戏系统
        system.wii = ua.indexOf('Wii') > -1;
        system.ps = /PlayStation/i.test(ua);
        return {
            system: system
        }
    },

    /**
     * 获取版本信息
     * @returns {*|Deffered}
     */
    getVersionInfo:function () {
        return this.http.postImmediately({
            type:'post',
            url:'/get_revision_info/',
        })
    },
    /**
     * 向后台发送账号、密码请求登录
     * @param data
     * @returns {*|Deffered}
     */
    userLoginVerification:function (data) {
        //登录
        let body = this.utils.formatParams(data);
        return this.http.postImmediately({
            type:'post',
            url:'/login/',
            data:body
        });
    },
    /**
     * 根据用户名找回密码
     * @param username
     * @returns {*|Deffered}
     */
    findPassword:function (username) {
        //找回密码
        let url = '/validate_username/';
        let body = this.utils.formatParams({username:username});
        return this.http.postImmediately({
            type:'post',
            url:url,
            data:body
        })
    }
};