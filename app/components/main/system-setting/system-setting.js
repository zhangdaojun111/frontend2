import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './system-setting.scss';
import template from './system-setting.html';
import msgbox from "../../../lib/msgbox";


let config = {
    template:template,
    data:{},
    actions:{
        showStyleSetting:function () {
            this.el.find('.style-setting').show();
            this.el.find('.rapid-setting').hide();
            this.el.find('.style-btn').addClass('active');
            this.el.find('.rapid-btn').removeClass('active');
        },
        showRapidSetting:function () {
            this.el.find('.style-setting').hide();
            this.el.find('.rapid-setting').show();
            this.el.find('.style-btn').removeClass('active');
            this.el.find('.rapid-btn').addClass('active');
        }
    },
    afterRender:function () {
        this.el.on('click','.style-btn',() => {
            this.actions.showStyleSetting();
        }).on('click','.rapid-btn',() => {
            this.actions.showRapidSetting();
        })
    },
    beforeDestory:function () {

    }
};

class SettingPage extends Component{
    constructor(){
        super(config)
    }
}

export const SysSetting = {
    el:null,
    show:function () {
        let component = new SettingPage();
        this.el = $('<div id="sys-setting-page">').appendTo(document.body);
        component.render(this.el);
        this.el.dialog({
            title: '系统设置',
            width: 540,
            modal:true,
            height: 600,
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