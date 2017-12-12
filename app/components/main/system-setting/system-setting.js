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
            let biStatus = window.config.sysConfig.logic_config.client_login_show_bi || "10";
            this.data.biSort = biStatus.split('')[0];
            this.data.biStatus = biStatus.split('')[1];

            let calendarStatus = window.config.sysConfig.logic_config.client_login_show_calendar || "20";
            this.data.calendarSort = calendarStatus.split('')[0];
            this.data.calendarStatus = calendarStatus.split('')[1];

            let homeStatus = window.config.sysConfig.logic_config.client_login_show_home || "000";
            this.data.bi_view = homeStatus.substring(0,homeStatus.length - 1);
            this.data.homeStatus = homeStatus.substring(homeStatus.length - 1);

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

            let home = $(`
                <li class="isShow-home" title="不可拖动" draggable="false">
                    <label class="custom-checkbox" style="display: inline">
                        <input class="home-Show" title="点击设置此功能" type="checkbox" >
                    </label>
                    <span>登录时自动开启首页</span>
                    <i class="drag-icon icon-framework-drag" style="display: none"></i>
                </li>`);

            $parent.prepend(home);
            this.actions.setCheckboxStatus();
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
                console.log(res)
                let li = '';
                if(this.data.bi_view == "00"){
                    res.data.bi_view[0] && (this.data.bi_view = res.data.bi_view[0].id)
                }
                res.data.bi_view.forEach((item,index)=>{
                    if(this.data.bi_view == item.id) {
                        li += `
                            <li class="bi-view">
                                <label style="display: inline" class="custom-checkbox">
                                    <input type="checkbox" title="${item.id}" name="home-page-checkbox" class="check-box" checked>
                                </label>
                                <span class="set-home-page" title="${item.id}">${item.name}</span>
                                <i class="home-page-delete" style="display: ${displaySty};" title="${item.id}">×</i>
                            </li>`
                    }else{
                        li += `
                            <li class="bi-view">
                                <label style="display: inline" class="custom-checkbox">
                                    <input type="checkbox" title="${item.id}" name="home-page-checkbox" class="check-box">
                                </label>
                                <span class="set-home-page" title="${item.id}">${item.name}</span>
                                <i class="home-page-delete" style="display: ${displaySty};" title="${item.id}">×</i>
                            </li>`
                    }
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
            if (res['name']) {
                ViewsService.update(res).then((res) => {
                    if (res['success'] === 1) {
                        msgbox.showTips('添加成功');
                        this.actions.getHomePageData();
                    } else {
                        msgbox.alert(res['error']);
                    }
                })
            }
            return false;
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
            let homeflag = '';
            let homeValue = this.el.find('input.home-Show').prop("checked");
            if(homeValue === true){
                homeflag = this.data.bi_view + "1";
            }else{
                homeflag = this.data.bi_view + "0";
            }
            let json3 = {
                action:'save',
                pre_type:10,
                content:homeflag
            };
            UserInfoService.saveHomePageConfig(json3).then((res)=>{
                if(res.success === 1){
                    msgbox.showTips("设置成功")
                    window.config.sysConfig.home_index = '/bi/index/?single=true&query_mark=home#/canvas/' + this.data.bi_view;
                    window.config.sysConfig.logic_config.client_login_show_home = res.data.toString();
                }else{
                    msgbox.showTips("服务器错误")
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
            let biflag = 10;
            let calendarflag = 20;
            let homeflag = '';
            let biValue = this.el.find('input.bi-Show').prop("checked");
            let calendarValue = this.el.find('input.calendar-Show').prop("checked");
            let homeValue = this.el.find('input.home-Show').prop("checked");
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
            if(homeValue === true){
                homeflag = this.data.bi_view + "1";
            }else{
                homeflag = this.data.bi_view + "0";
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

            let json3 = {
                action:'save',
                pre_type:10,
                content:homeflag
            };

            let that = this;
            UserInfoService.saveUserConfig(json,json2,json3).then((result) => {
                that.hideLoading();
                if(result[0].succ === 1 && result[1].succ === 1 && result[2].succ === 1){
                    window.config.sysConfig.logic_config.client_login_show_bi = result[0].data.toString();
                    window.config.sysConfig.logic_config.client_login_show_calendar = result[1].data.toString();
                    window.config.sysConfig.logic_config.client_login_show_home = result[2].data.toString();
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
            if(this.data.homeStatus === '1'){
                this.el.find('input.home-Show').attr("checked",true);
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