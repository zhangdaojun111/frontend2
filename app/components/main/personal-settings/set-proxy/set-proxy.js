import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './set-proxy.scss';
import template from './set-proxy.html';
import {UserInfoService} from "../../../../services/main/userInfoService"
// import msgbox from '../../../../lib/msgbox';

let config = {
    template:template,
    data:{},
    actions:{

    },
    afterRender:function () {

    },
    beforeDestory:function () {

    }
};

class SetProxy extends Component{
    constructor(){
        super(config);
    }
}

export default {
    show: function() {
        let component = new SetProxy();
        component.dataService = UserInfoService;
        let el = $('<div id="set-proxy-page">').appendTo(document.body);
        component.render(el);
        el.dialog({
            title: '设置代理',
            width: 920,
            height: 620,
            close: function() {
                component.destroySelf();
            }
        });
    }
}