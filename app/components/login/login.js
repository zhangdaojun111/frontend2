import Component from '../../lib/component';
import 'jquery-ui/ui/widgets/dialog.js';

import './login.scss';
import template from './login.html';

import msgbox from '../../lib/msgbox';

let config = {
    template: template,
    data: {
        defaultName: 'tom',
        defaultPwd: '123123'
    },
    actions: {
        submit: function() {
            let form = {
                username: this.el.find('input[name=username]').val(),
                password: this.el.find('input[name=password]').val()
            }
        }
    },
    afterRender: function() {
        this.el.on('click', 'input[type=submit]', () => {
            this.actions.submit();
        });
    },
    beforeDestory: function(){
        msgbox.alert('组件要被销毁了');
    }
}

class Login extends Component {
    constructor(newConfig){
        super($.extend(true,{},config,newConfig));
    }
}

export default {
    show: function() {
        let component = new Login();
        let el = $('<div>').appendTo(document.body);
        component.render(el);
        el.dialog({
            title: '主框架弹出',
            width: 400,
            height: 300,
            close: function() {
                $(this).dialog('destroy');
                component.destroySelf();
            }
        });
    }
}
