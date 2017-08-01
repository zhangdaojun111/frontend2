
import '../assets/scss/main.scss';

// import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {MenuComponent} from '../components/main/menu-full/menu.full';
import {IframeInstance} from '../components/main/iframes/iframes';
import {HeaderInstance} from '../components/main/header/header';
import {AsideInstance} from '../components/main/aside/aside';


_.defaultsDeep(AsideInstance.data, {
    systemName: window.config.sysConfig.logic_config.sap_login_system_name,
    avatar: window.config.sysConfig.userInfo.avatar,
    username: window.config.sysConfig.userInfo.username,
    role: window.config.sysConfig.userInfo.name,
})
AsideInstance.render($('#aside'));
IframeInstance.render($('#content'));
HeaderInstance.render($('#header'));

