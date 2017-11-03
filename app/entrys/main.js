
// import 'jquery-ui/themes/base/base.css';
// import 'jquery-ui/themes/base/theme.css';
import '../assets/scss/main.scss';
import '../assets/scss/framework/framework-base.scss';
import {SocketMgr} from '../lib/socket';
import '../assets/scss/framework/framework-base.scss'
import {IframeComponent} from '../components/main/iframes/iframes';
import {HeaderComponent} from '../components/main/header/header';
import {AsideComponent} from '../components/main/aside/aside';
import '../assets/scss/dataGrid/dataGrid-icon.scss';
import '../assets/scss/theme/blue.scss';
import {Storage} from "../lib/storage";
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

let body = $('body');
body.find('.component-loading-cover').remove();
body.find('.component-loading-box').remove();
body.removeClass('component-loading-effect');

let head = $('head');
head.find('title').html(window.config.sysConfig.logic_config.sap_login_system_name);

