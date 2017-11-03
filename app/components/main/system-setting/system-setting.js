/**
 * @author zhaoyan
 * 系统设置界面
 */
import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-ui/ui/widgets/droppable';
import './system-setting.scss';
import template from './system-setting.html';
import msgbox from "../../../lib/msgbox";
import {UserInfoService} from "../../../services/main/userInfoService"

let config = {
    template:template,
    /**
     * 以两位数保存bi和日历的顺序及开关，第一位表示顺序，2在前面（面板的上方），1在后面，第二位表示开关，0为关闭，1为开启
     */
    data:{
        biSort:1,           //记录bi的顺序
        calendarSort:2,     //记录日历顺序
        biStatus:0,         //记录快捷bi状态（0为不快捷打开bi）
        calendarStatus:0,   //记录快捷bi状态（0为不快捷打开日历）
        currentTheme:'default',
    },
    actions:{
        /**
         * 打开样式设置页面
         */
        showStyleSetting:function () {
            this.el.find('.style-setting').show();
            this.el.find('.rapid-setting').hide();
            this.el.find('.style-btn').addClass('active');
            this.el.find('.rapid-btn').removeClass('active');
        },
        /**
         * 打开快捷设置页面
         */
        showRapidSetting:function () {
            this.el.find('.style-setting').hide();
            this.el.find('.rapid-setting').show();
            this.el.find('.style-btn').removeClass('active');
            this.el.find('.rapid-btn').addClass('active');
        },
        /**
         * 清理缓存
         */
        clearStorage:function () {
            msgbox.confirm('确定要清除缓存，并退出到登录页面吗？').then((result) => {
                if(result === true){
                    window.localStorage.clear();
                    $(window).attr("location","/login");
                }
            })
        },
        /**
         * 获取用户快捷设置参数并解析
         */
        getItemData:function () {
            let biStatus = window.config.sysConfig.logic_config.client_login_show_bi || "10";
            this.data.biSort = biStatus.split('')[0];
            this.data.biStatus = biStatus.split('')[1];

            let calendarStatus = window.config.sysConfig.logic_config.client_login_show_calendar || "20";
            this.data.calendarSort = calendarStatus.split('')[0];
            this.data.calendarStatus = calendarStatus.split('')[1];

            this.actions.addCheckbox();
        },
        /**
         * 根据用户设置的参数在bi前或后添加日历拖动框
         */
        addCheckbox:function () {
            let $parent = this.el.find('.sortable-box');
            let $ul = $(`
                <li class='isShow-calendar sort-item' title='拖动调整顺序'>
                    <label class='custom-checkbox' style='display: inline'>
                        <input class='calendar-Show' title='点击设置此功能' type='checkbox'>
                    </label>
                    <span>登录时自动开启日历</span>
                    <i class='drag-icon icon-framework-drag'></i>
                </li>`);
            if(this.data.calendarSort === "1"){
                $parent.append($ul);
            }else{
                $parent.prepend($ul);
            }
            this.actions.setCheckboxStatus();
        },
        /**
         * 保存用户快捷设置状态
         */
        saveSetting:function () {
            this.showLoading();
            let biflag = 10;
            let calendarflag = 20;
            let biValue = this.el.find('input.bi-Show').prop("checked");
            let calendarValue = this.el.find('input.calendar-Show').prop("checked");
            if(biValue === true){
                biflag = this.data.biSort + "1";
            }else{
                biflag = this.data.biSort + "0";
            }
            if(calendarValue === true){
                calendarflag = this.data.calendarSort + "1";
            }else{
                calendarflag = this.data.calendarSort + "0";
            }
            //以两位数保存bi和日历的顺序及开关，第一位表示顺序，2在前面（面板的上方），1在后面，第二位表示开关，0为关闭，1为开启
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

            let that = this;
            UserInfoService.saveUserConfig(json,json2).then((result) => {
                that.hideLoading();
                if(result[0].succ === 1 && result[1].succ === 1){
                    window.config.sysConfig.logic_config.client_login_show_bi = result[0].data.toString();
                    window.config.sysConfig.logic_config.client_login_show_calendar = result[1].data.toString();
                    msgbox.alert("设置保存成功");
                    SysSetting.hide();
                }else{
                    msgbox.alert("设置保存失败");
                }
            });
        },
        /**
         * 改变字体大小（目前仅有示例效果，实际效果未完成）
         */
        changeFontSize:function () {
            let fontsize = this.el.find('input.font-range').val();
            this.el.find("span.font-size").html(fontsize);
            fontsize = fontsize + 'px';
            this.el.find("span.font-example").css("font-size",fontsize);
            //添加对aggrid的影响
        },
        /**
         * 设置bi/日历li可拖动以及checkbox初始状态
         */
        setCheckboxStatus:function () {
            let that = this;
            this.el.find('.sortable-box').sortable({
                containment:'.sortable-box',
                update:function (event,ui) {
                    that.actions.saveSortResult();
                }
            }).disableSelection();

            this.el.find('.sortable-box:first').droppable({
                accept:".sort-item",
            });

            if(this.data.biStatus === '1'){
                this.el.find('input.bi-Show').attr("checked",true);
            }
            if(this.data.calendarStatus === '1'){
                this.el.find('input.calendar-Show').attr("checked",true);
            }
        },
        /**
         * 仅当dom位置发生变化（即bi/日历顺序有变化）才会触发，原地拖动不会触发
         * @param event
         * @param ui
         */
        saveSortResult(event,ui){
            let temp = this.data.biSort;
            this.data.biSort = this.data.calendarSort;
            this.data.calendarSort = temp;
        },
        /**
         * 根据点击li的class改变主题
         */
        changeTheme:function (target,event) {
            console.log(event);
            let newTheme = event.currentTarget.attributes[0].value;
            $('body').attr('class',newTheme);
        }
    },
    binds:[ 
        {
            event:'click',
            selector:'.style-btn',
            callback:function () {
                this.actions.showStyleSetting();
            }
        },
        {
            event:'click',
            selector:'.rapid-btn',
            callback:function () {
                this.actions.showRapidSetting();
            }
        },
        {
            event:'click',
            selector:'.clear-storage',
            callback:function () {
                this.actions.clearStorage();
            }
        },
        {
            event:'click',
            selector:'.rapid-save-btn',
            callback:_.debounce(function() {
                this.actions.saveSetting();
            },300)
        },
        {
            event:'change',
            selector:'.font-range',
            callback:function () {
                this.actions.changeFontSize();
            }
        },
        {
            event:'click',
            selector:'.theme-set-group ul li',
            callback:function (target,event) {
                this.actions.changeTheme(target,event);
            }
        }
    ],
    afterRender:function () {
        this.actions.getItemData();
    },
    beforeDestory:function () {

    }
};

class SettingPage extends Component{
    constructor(newConfig){
        super($.extend(true,{},config,newConfig));
    }
}

export const SysSetting = {
    el:null,
    show:function () {
        let component = new SettingPage();
        this.el = $('<div id="sys-setting-page">').appendTo(document.body);
        component.render(this.el);
        this.el.erdsDialog({
            title: '系统设置',
            width: 540,
            modal:true,
            height: 600,
            close: function() {
                $(this).erdsDialog('destroy');
                component.destroySelf();
            }
        });
    },
    hide:function () {
        this.el.erdsDialog('close');
    }
};