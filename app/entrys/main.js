
// import 'jquery-ui/themes/base/base.css';
// import 'jquery-ui/themes/base/theme.css';
import '../assets/scss/main.scss';
import '../services/main/socket';

import {IframeInstance} from '../components/main/iframes/iframes';
import {HeaderInstance} from '../components/main/header/header';
import {AsideInstance} from '../components/main/aside/aside';

_.defaultsDeep(AsideInstance.data, {
    systemName: window.config.sysConfig.logic_config.sap_login_system_name,
    avatar: window.config.sysConfig.userInfo.avatar,
    username: window.config.sysConfig.userInfo.username,
    role: window.config.sysConfig.userInfo.is_superuser === 1 ? '管理员' : '普通用户'
});

AsideInstance.render($('#aside'));
IframeInstance.render($('#content'));
HeaderInstance.render($('#header'));



// window.setTimeout(function () {
//     socket.close()
// }, 1000)

// socket.close()

