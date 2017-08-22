import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './system-setting.scss';
import template from './system-setting.html';
import msgbox from "../../../lib/msgbox";
import {UserInfoService} from "../../../services/main/userInfoService"


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
        },
        clearStorage:function () {
            window.localStorage.clear();
            $(window).attr("location","/login");
        },
        saveSetting:function () {
            let biflag = 0;
            let calendarflag = 0;
            let biValue = this.el.find('input.bi-Show').prop("checked");
            let calendarValue = this.el.find('input.calendar-Show').prop("checked");
            if(biValue === true){
                biflag = 1;
            }
            if(calendarValue === true){
                calendarflag = 1;
            }
            let json = {
                action:'save',
                pre_type:4,
                content:biflag
            };

            let json2 = {
                action:'save',
                pre_type:5,
                content:calendarflag
            };

            UserInfoService.saveUserConfig(json).done((result) => {
                if(result.success === 1){
                    console.log("json 保存成功")
                }else{
                    console.log("设置保存失败");
                }
            });
            UserInfoService.saveUserConfig(json2).done((result) => {
                if(result.success === 1){
                    msgbox.alert("设置保存成功");
                    //回写window.config


                    this.el.dialog.hide();
                }else{
                    msgbox.alert("设置保存失败");
                }
            })
        },
        changeFontSize:function () {
            let fontsize = this.el.find('input.font-range').val();
            this.el.find("span.font-size").html(fontsize);
            fontsize = fontsize + 'px';
            this.el.find("span.font-example").css("font-size",fontsize);
        }
    },

    afterRender:function () {
        this.el.on('click','.style-btn',() => {
            this.actions.showStyleSetting();
        }).on('click','.rapid-btn',() => {
            this.actions.showRapidSetting();
        }).on('click','.clear-storage',() => {
            this.actions.clearStorage();
        }).on('click','.rapid-save-btn', () => {
            this.actions.saveSetting();
        }).on('change','.font-range', () => {
            this.actions.changeFontSize();
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