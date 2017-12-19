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
import Mediator from "../../../lib/mediator";
import {ViewsService} from "../../../services/bisystem/views.service";
import {config as viewDialogConfig} from "../../../components/bisystem/views/dialog/edit/dialog.edit";
import {PMAPI} from '../../../lib/postmsg';
import {dragBar} from "./drag-bar/drag-bar";
import {TabService} from "../../../services/main/tabService";

let SettingPage = Component.extend({
    template:template,
    /**
     * 以两位数保存bi和日历的顺序及开关，第一位表示顺序，2在前面（面板的上方），1在后面，第二位表示开关，0为关闭，1为开启
     */
    data:{
        biSort:1,           //记录bi的顺序
        calendarSort:2,     //记录日历顺序
        homeStatus:0,       //记录快捷首页状态（0为不快捷打开首页）
        biStatus:0,         //记录快捷bi状态（0为不快捷打开bi）
        calendarStatus:0,   //记录快捷日历状态（0为不快捷打开日历）
        currentTheme:'default',
        bi_view:'',         //当前首页选中的bi视图id
    },
    actions:{
        /**
         * 打开样式设置页面
         */
        showStyleSetting:function () {
            this.el.find('.style-setting').show();
            this.el.find('.rapid-setting').hide();
            this.el.find('.home-page-setting').hide();
            this.el.find('.style-btn').addClass('active');
            this.el.find('.rapid-btn').removeClass('active');
            this.el.find('.home-page-btn').removeClass('active');
        },
        /**
         * 打开快捷设置页面
         */
        showRapidSetting:function () {
            this.el.find('.style-setting').hide();
            this.el.find('.rapid-setting').show();
            this.el.find('.home-page-setting').hide();
            this.el.find('.style-btn').removeClass('active');
            this.el.find('.rapid-btn').addClass('active');
            this.el.find('.home-page-btn').removeClass('active');
        },
        /**
         * 打开首页设置页面
         */
        showHomePageSetting:function () {
            this.el.find('.style-setting').hide();
            this.el.find('.rapid-setting').hide();
            this.el.find('.home-page-setting').show();
            this.el.find('.style-btn').removeClass('active');
            this.el.find('.rapid-btn').removeClass('active');
            this.el.find('.home-page-btn').addClass('active');
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
            let that = this;
            let homeStatus = window.config.sysConfig.logic_config.client_login_show_home || "000";
            this.data.bi_view = homeStatus.substring(0,homeStatus.length - 1);

            TabService.getOpeningTabs().then((result) => {
                console.log(result,'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
                //特殊标签（首页、日历、Bi）处理
                that.data.config = JSON.parse(result[1].data);
                // that.data.config = [         //默认快捷设置，用于兼容老用户或未设置快捷设置的用户
                //     {
                //         id: 'home',
                //         name: '首页',
                //         url: window.config.sysConfig.home_index,
                //         status:'000'
                //     },
                //     {
                //         id: 'bi',
                //         name: 'BI',
                //         url: window.config.sysConfig.bi_index,
                //         status:'1'
                //     },
                //     {
                //         id: 'calendar',
                //         name: '日历',
                //         url: window.config.sysConfig.calendar_index,
                //         status:'1'
                //     }
                // ];
                that.actions.addDragBar(that.data.config);
            });
        },
        /**
         * 根据用户设置的参数在bi前或后添加日历拖动框
         */
        addDragBar:function (specialTabs) {
            let parent = this.el.find('.sortable-box');
            for(let config of specialTabs){
                let comp = new dragBar({
                    data:{
                        name:config.name,
                        status:config.status,
                        id:config.id
                    }
                });
                let container = $(`<li class="sort-item" title="拖动调整顺序" item-id="${config.id}">`).appendTo(parent);
                comp.render(container);
            }
            this.actions.setBarsSortable();
        },

        /**
         * 获取用户首页bi视图列表
         */
        getHomePageData: function (fromDelete) {
            let displaySty = 'none';
            if(fromDelete){
                displaySty = 'inline-block'
            }
            UserInfoService.getHomePageList().then(res=>{
                let li = '';
                if(this.data.bi_view == "00"){
                    res.data.bi_view[0] && (this.data.bi_view = res.data.bi_view[0].id)
                }
                res.data.bi_view.forEach((item,index)=>{
                    let checked = this.data.bi_view == item.id?'checked':'';
                    li += `<li class="bi-view">
                                <label style="display: inline" class="custom-checkbox">
                                    <input type="checkbox" title="${item.id}" name="home-page-checkbox" class="check-box" ${checked}>
                                </label>
                                <span class="set-home-page" title="${item.id}">${item.name}</span>
                                <i class="home-page-delete" style="display: ${displaySty};" title="${item.id}">×</i>
                            </li>`;
                });
                $('#home-page-ul').html(li);
            })
        },
        /**
         * 编辑首页
         */
        editHomePage:function(cancle){
            this.el.find('.cover').show();
            this.el.find('.home-page-delete').show();
            this.el.find('.home-page-save-btn').html('保存');
        },
        /**
         * 保存
         * **/
        editHomePageSave: function(){
            if(this.el.find('.home-page-save-btn').html() == '关闭并刷新'){
                this.actions.saveSetting(true);
            }
            if(this.el.find('.home-page-save-btn').html() == '保存') {
                this.el.find('.cover').hide();
                this.el.find('.home-page-delete').hide();
                this.el.find('.home-page-save-btn').html('关闭并刷新');
            }
        },
        /**
         * 新建首页
         * **/
        async createHomePage() {
            viewDialogConfig.data.view = null;
            window.config.query_mark = 'home';
            window.config.folder_id = '';
            window.config.parent_table_id = '';
            window.config.id = '';
            window.config.operation_id = '';
            const res = await PMAPI.openDialogByComponent(viewDialogConfig, {
                width: 348,
                height: 217,
                title: '新建视图'
            });
            console.log(res);
            debugger;
            if (res['name']) {
                this.actions.updateViews(res);
            }
            return false;
        },
        updateViews:function (r) {
            ViewsService.update(r).then((res) => {
                if (res['success'] === 1) {
                    msgbox.showTips('添加成功');
                    this.actions.getHomePageData();
                } else {
                    msgbox.alert(res['error']);
                }
            })
        },
        /**
         * 选择首页
         * **/
        selectHomePage:function (e) {
            $("[name='home-page-checkbox']").not($(e)).prop("checked",false)
            $(e).prop("checked","checked");
            if(this.data.bi_view != e.title){
                this.data.bi_view = e.title;
                this.actions.saveHomePage()
            }
            //此处刷新首页tab
        },
        /**
         * 切换首页保存
         * */
        saveHomePage:function () {
            // saveUserConfig
            let homeValue = this.el.find('input.home-Show').prop("checked");
            let homeflag = this.data.bi_view + ((homeValue === true)? "1" : "0");

            for ( let config of this.data.config){
                if(config.id === 'home'){
                    config.status = homeflag;
                    break;
                }
            }

            let config = JSON.stringify(this.data.config);
            let json = {
                action:'save',
                pre_type:4,
                content:config
            };

            UserInfoService.saveUserConfig(json).then((res)=>{
                if(res.success === 1){
                    msgbox.showTips("设置成功");
                    window.config.sysConfig.home_index = '/bi/index/?single=true&query_mark=home#/canvas/' + this.data.bi_view;
                    window.config.sysConfig.logic_config.client_login_show_home = homeflag.toString();
                }else{
                    msgbox.showTips("服务器错误");
                }
            })
        },
        /**
         * 删除首页
         * **/
        deleteHomePage:function (e) {
            ViewsService.delData({view_id:e.title}).then(res=>{
                if(res['success']===1){
                    this.actions.getHomePageData(true);
                    msgbox.showTips('删除成功');
                }else{
                    msgbox.alert(res['error']);
                }
            });
        },
        /**
         * 编辑首页
         * **/
        setHomePage:function (e) {
            let iFrameUrl = '/bi/manager/?query_mark=home#/canvas/' + e.title;
            PMAPI.openDialogByIframe(
                iFrameUrl,
                {
                    title: '编辑模式',
                    modal: true,
                    customSize: true,

                }).then((data) => {

                }
            );
        },
        /**
         * 保存用户快捷设置状态
         */
        saveSetting:function (refresh) {
            this.showLoading();
            let flags = {
                bi: this.el.find('input.bi-Show').prop("checked") === true ? '1' : '0',
                calendar : this.el.find('input.calendar-Show').prop("checked") === true ? '1' : '0',
                home : this.actions._calFlag(this.data.bi_view,this.el.find('input.home-Show').prop("checked"))
            };

            //以两位数保存bi和日历的顺序及开关，第一位表示顺序，2在前面（面板的上方），1在后面，第二位表示开关，0为关闭，1为开启
            let newConfig = [];
            let that = this;
            //根据快捷设置界面的item顺序和checkbox设置新的config
            this.el.find('.sortable-box li').each(function () {
                let id = $(this)[0].attributes['item-id'].value;
                let temp = {};
                for (let config of that.data.config){
                    if(config.id === id){
                        temp = $.extend(true,{},config);
                        temp.status = flags[config.id];
                        newConfig.push(temp);
                        break;
                    }
                }
            });
            newConfig = JSON.stringify(newConfig);
            let json = {
                action:'save',
                pre_type:4,
                content:newConfig
            };

            this.actions.saveUserConfig(json,refresh);
            this.data.config = newConfig;
        },
        _calFlag:function(originVal,flag){
            return originVal + ((flag === true)?'1':'0');
        },
        saveUserConfig:function (json,refresh) {
            UserInfoService.saveUserConfig(json).then((result) => {
                this.hideLoading();
                if(result.succ === 1){
                    if(!refresh) {
                        msgbox.alert("设置保存成功");
                    }
                    SysSetting.hide();
                    if(refresh){
                        // _.debounce(()=>{
                        Mediator.emit('menu:homePageRefresh',{
                            id: 'home',
                            name: '首页',
                            url: window.config.sysConfig.home_index
                        })
                        // },200)
                    }
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
        setBarsSortable:function () {
            this.el.find('.sortable-box').sortable({
                containment:'.sortable-box',
            }).disableSelection();

            this.el.find('.sortable-box:first').droppable({
                accept:".sort-item",
            });
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
            let newTheme = event.currentTarget.attributes[0].value;
            $('body').attr('class',newTheme);
            $(target).addClass('active').siblings().removeClass('active');
            window.config.sysConfig.userInfo.theme = newTheme;
            UserInfoService.saveUserTheme(newTheme).done((res) => {
                if(res['success'] === 0){
                    console.log('save failed');
                }
            })
        },
        initThemeUl:function () {
            if(window.config.sysConfig.userInfo.hasOwnProperty('theme') && window.config.sysConfig.userInfo.theme !== ''){
                let theme = window.config.sysConfig.userInfo.theme || 'blue';
                this.el.find(`li[data-value = ${theme}]`).addClass('active').siblings().removeClass('active');
            }
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
            selector:'.home-page-btn',
            callback:function () {
                this.actions.showHomePageSetting();
            }
        },
        {
            event:'click',
            selector:'.home-page-save-btn',
            callback:function () {
                this.actions.editHomePageSave();
            }
        },
        {
            event:'click',
            selector:'.home-page-edit',
            callback:function () {
                this.actions.editHomePage(false);
            }
        },
        {
            event:'click',
            selector:"[name='home-page-checkbox']",
            callback:function (e) {
                this.actions.selectHomePage(e);
            }
        },
        {
            event:'click',
            selector:".home-page-delete",
            callback:function (e) {
                this.actions.deleteHomePage(e);
            }
        },
        {
            event:'click',
            selector:".home-page-add",
            callback:function (e) {
                this.actions.createHomePage(e);
            }
        },
        {
            event:'click',
            selector:".set-home-page",
            callback:function (e) {
                this.actions.setHomePage(e);
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
        this.actions.initThemeUl();
        this.actions.getItemData();
        this.actions.getHomePageData();
    },
    beforeDestory:function () {

    }
});

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