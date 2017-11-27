
// import 'jquery-ui/themes/base/base.css';
// import 'jquery-ui/themes/base/theme.css';
import '../assets/scss/main.scss';
import '../assets/scss/framework/framework-base.scss';
import {SocketMgr} from '../lib/socket';
import {IframeComponent} from '../components/main/iframes/iframes';
import {HeaderComponent} from '../components/main/header/header';
import {AsideComponent} from '../components/main/aside/aside';
import '../assets/scss/dataGrid/dataGrid-icon.scss';
import '../assets/scss/theme/blue.scss';
import '../assets/scss/theme/ink-blue.scss';
import '../assets/scss/theme/orange.scss';
import {Storage} from "../lib/storage";
import {UserInfoService} from "../services/main/userInfoService"
import {PMENUM,PMAPI} from "../lib/postmsg";
SocketMgr.connect();

let AsideInstance = new AsideComponent();
let HeaderInstance = new HeaderComponent();
let IframeInstance = new IframeComponent();

_.defaultsDeep(AsideInstance.data, {
    systemName: window.config.sysConfig.logic_config.sap_login_system_name,
    avatar: window.config.sysConfig.userInfo.avatar,
    avatar_content:window.config.sysConfig.userInfo.avatar_content,
    username: window.config.sysConfig.userInfo.username,
    role: window.config.sysConfig.userInfo.is_superuser === 1 ? '管理员' : '普通用户'
});

IframeInstance.render($('#content'));
HeaderInstance.render($('#header'));
AsideInstance.render($('#aside'));
Storage.clearAll();
const clickEvent = ()=>{
  PMAPI.sendToAllChildren({
      type:PMENUM.send_event,
      data:'click'
  });
};
document.addEventListener('click',clickEvent);

let body = $('body');
//加载用户偏好样式
UserInfoService.getUserTheme().done((res) => {
    if(res.success === 1){
        body.attr('class',res.data);
        window.config.sysConfig.userInfo.theme = res.data;
    }else{
        body.attr('class','blue');
        window.config.sysConfig.userInfo.theme = 'blue';
    }
});

body.find('.component-loading-cover').remove();
body.find('.component-loading-box').remove();
body.removeClass('component-loading-effect');

let head = $('head');
head.find('title').html(window.config.sysConfig.logic_config.sap_login_system_name);



