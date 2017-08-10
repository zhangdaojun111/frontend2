import Component from '../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './register.scss';
import template from './register.html';
import {UserInfoService} from '../../services/login/loginService';
import msgbox from '../../lib/msgbox';


let config ={
    template:template,
    data:{},
    actions:{

    },
    afterRender:function () {

    },
    beforeDestory:function () {

    }


};


class Register extends  Component{
    constructor(){
        super(config);
    }
}

export const RegisterComponent = {
    el:null,
    show:function () {
        let component = new Register();
        this.el = $('<div id="register-page">').appendTo(document.body);
        component.render(this.el);
        this.el.dialog({
            title: '用户注册',
            width: 540,
            height: 600,
            modal: true,
            close: function() {
                $(this).dialog('destroy');
                component.destroySelf();
            }
        });
    },
    hide:function () {
        this.el.dialog('close');
    }
};