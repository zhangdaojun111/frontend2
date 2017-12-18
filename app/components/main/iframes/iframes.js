/**
 * Created by xiongxiaotao on 2017/7/29.
 */
import Component from '../../../lib/component';
import template from './iframe.html';
import Mediator from '../../../lib/mediator';
import './iframe.scss';
import {PMAPI, PMENUM} from '../../../lib/postmsg';
import {SaveView} from "./new-save-view/new-save-view";
import {TabService} from "../../../services/main/tabService";
// import {IframesManager} from "../../../lib/iframes-manager";
import msgbox from '../../../lib/msgbox';
import {UserInfoService} from "../../../services/main/userInfoService";

// let IframeOnClick = {
//     resolution: 200,
//     iframes: [],
//     interval: null,
//     Iframe: function() {
//         this.element = arguments[0];
//         this.cb = arguments[1];
//         this.hasTracked = false;
//     },
//     track: function(element, cb) {
//         this.iframes.push(new this.Iframe(element, cb));
//         console.log(this.iframes.length);
//         if (!this.interval) {
//             var _this = this;
//             this.interval = setInterval(function() { _this.checkClick(); }, this.resolution);
//         }
//     },
//     retrack: function (element) {
//         this.iframes = _.remove(this.iframes, function (data) {
//             return data.element = element;
//         });
//     },
//     checkClick: function() {
//         if (document.activeElement) {
//             var activeElement = document.activeElement;
//             // let index = _.findIndex(this.iframes, 'element', activeElement)
//             // if (index === -1) {
//             //     this.iframes.forEach()
//             // }
//             for (var i in this.iframes) {
//                 if (activeElement === this.iframes[i].element) { // user is in this Iframe
//                     if (this.iframes[i].hasTracked == false) {
//                         this.iframes[i].cb.apply(window, []);
//                         this.iframes[i].hasTracked = true;
//                         console.log(this.iframes.length);
//                     }
//                 } else {
//                     this.iframes[i].hasTracked = false;
//                 }
//             }
//         }
//     }
// };

let maxIframeCount = 15;

// export const IframeInstance = new Component({
let IframeComponent = Component.extend({
    template: template,
    data: {
        hash: {},                //实时保存当前打开的iframes的相关信息
        count: 0,                //iframes的数量
        sort: [],                //经排序后的iframs的id
        focus: null,             //当前焦点iframe
        hideFlag: false,
        openingTabsList: [],      //记录未关闭的tabs的id
        timeList: {},             //记录tabs的时间戳
        biCalendarList: [],       //记录日历BI是否开启，tabs排序完成后，与autoOpenList合并
        autoOpenList: [],         //记录根据id找到的iframes的所有信息url、id、name用于打开iframes
        tabsTotalWidth: "",       //tabs可用总长度 = div.tabs - 85;
        tabWidth: 150,            //单个tabs长度，默认150（需和scss同步修改），空间不足以后自适应宽度
        minTabWidth: 100,         //用于估算小屏设备最大tabs数量
        closeHistory: [],         //用于保存历史关闭记录，记录最近5个
        tabsControlOpen: false,   //标签控制界面标记
        saveViewOpen: false,       //保存视图界面标记
        commonUseList: [],          //保存常用iframes，用于预加载
        defaultUserConfig:[         //默认快捷设置，用于兼容老用户或未设置快捷设置的用户
            {
                id: 'home',
                name: '首页',
                url: window.config.sysConfig.home_index,
                status:'001'
            },
            {
                id: 'bi',
                name: 'BI',
                url: window.config.sysConfig.bi_index,
                status:'1'
            },
            {
                id: 'calendar',
                name: '日历',
                url: window.config.sysConfig.calendar_index,
                status:'1'
            }
        ]
    },
    actions: {

        /**
         * 根据id、url、name打开iframe
         * @param id
         * @param url
         * @param name
         */
        _openIframe: function (id, url, name) {
            // this.actions.sendOpenRequest(id);
            id = id.toString();
            if (this.data.hash[id] === undefined) {
                let tab = $(`<div class="item" iframeid="${id}" title="${name}">${name}<a class="close icon-framework-close" iframeid="${id}"></a></div>`)
                    .prependTo(this.data.tabs);
                //根据id查询该iframe是否已经预加载，如果已经预加载直接取用iframe
                // let dom = IframesManager.getIframe(id),iframe;
                // if(dom !== undefined && dom.length > 0){
                //     iframe = $('<div class="item">').append(dom[0]).appendTo(this.data.iframes);
                // }else{
                //
                // }
                let iframe = $(`<div class="item"><iframe id="${id}" _src="${url}"></iframe></div>`).appendTo(this.data.iframes);
                let originIframe = iframe.find('iframe');
                iframe.hide();
                // this.showLoading(this.data.iframes);
                // window.clearTimeout(this.data.loadingTimer);
                // this.data.loadingTimer = window.setTimeout(() => {
                //     this.hideLoading();
                // }, 500);

                // originIframe.on('load', function () {
                //     PMAPI.sendToIframe(originIframe[0], {
                //         type: PMENUM.open_iframe_data,
                //         data: {
                //             iframe: 'load'
                //         }
                //     });
                // });

                this.data.hash[id] = {id, url, name, tab, iframe};
                this.data.sort.push(id);
                this.data.count++;
            }
            // this.actions.focusIframe(id);
            if (this.data.count > maxIframeCount) {
                this.actions.closeFirstIframe();
            }
            this.actions.adaptTabWidth();
        },

        /**
         * 方法同上，新增与后台同步tab信息的功能
         */
        openIframe: function (id, url, name, flag) {
            this.actions._openIframe(id, url, name);
            if (flag !== false) {
                this.actions.sendOpenRequest(id);
            }
        },
        /**
         * 打开iframe时向后台发送请求，后台记录未关闭的iframe
         * @param id
         */
        sendOpenRequest: function (id) {
            if (id !== 'search-result') {
                // 向后台发送请求记录
                TabService.onOpenTab(id).done((result) => {
                    if (result.success === 1) {
                        // console.log("post open record success");
                    } else {
                        console.log("post open record failed")
                    }
                });
            }
        },
        /**
         * 关闭iframe时向后台发送请求，后台记录未关闭的iframe
         * @param id
         */
        sendCloseRequest: function (id) {
            TabService.onCloseTab(id, this.data.focus.id).done((result) => {
                if (result.success === 1) {
                    // console.log("post close record success")
                } else {
                    console.log("post close record failed")
                }
            });
        },
        /**
         * 关闭第一个iframe
         */
        closeFirstIframe: function () {
            let firstId = this.data.sort.shift();
            this.actions.closeIframe(firstId);
        },
        /**
         * 根据id关闭iframe
         * @param id
         */
        closeIframe: function (id) {
            if (id === undefined) {
                return;
            }
            this.actions.sendCloseRequest(id);
            let item = this.data.hash[id];
            if(item == undefined){
                return;
            }
            //关闭的item放入关闭历史数组，数组大于5则清除最后一项
            this.actions.setCloseHistory(item);
            // IframeOnClick.retrack(item.iframe.find('iframe')[0]);
            item.tab.remove();
            item.iframe.remove();
            _.remove(this.data.sort, (v) => {
                return v === id;
            });
            delete this.data.hash[id];
            this.data.count--;
            if (this.data.focus && this.data.focus.id === id) {
                let lastId = _.last(this.data.sort);
                if (lastId) {
                    this.actions.focusIframe(lastId);
                }
            }
            this.actions.adaptTabWidth();
        },
        /**
         * 记录最近关闭的5个iframe历史记录
         * @param item
         */
        setCloseHistory: function (item) {
            if (item.name !== 'BI' && item.name !== '日历' && item.name !== '搜索结果') {    //不保存搜索/BI/日历
                _.remove(this.data.closeHistory, function (n) {      //去重和重新插入，确保最后关闭的在记录最前面
                    return n.name === item.name;
                });
                this.data.closeHistory.unshift(item);
                if (this.data.closeHistory.length > 5) {
                    this.data.closeHistory.pop();
                }
            }
        },
        /**
         * 根据id将iframe设为焦点
         * @param id
         */
        focusIframe: function (id) {
            let that = this;

            if (this.data.focus) {
                this.data.focus.tab.removeClass('focus');
                this.data.focus.iframe.hide();
                this.actions.iframeHideLoading(this.data.focus.iframe);
                // PMAPI.sendToIframe(this.data.focus.iframe.find('iframe')[0], {
                //     type: PMENUM.iframe_silent
                // })
            }

            this.data.focus = this.data.hash[id];
            let iframe = this.data.focus.iframe.find('iframe');
            let src = iframe.attr('src');
            let complete = that.data.focus.iframe.attr('load') === 'complete';
            if (!src) {
                this.actions.iframeShowLoading(this.data.focus.iframe);
                iframe.on('load', function () {
                    let item = $(this).parent();
                    item.attr('load', 'complete');
                    setTimeout(() => {
                        that.actions.iframeHideLoading(item);
                    }, 0)
                });
                iframe.attr('src', iframe.attr('_src'));
                iframe.removeAttr('_src');
            } else if (!complete) {
                this.actions.iframeShowLoading(this.data.focus.iframe);
            }
            this.data.focus.iframe.show();
            this.data.focus.tab.addClass('focus');

            // PMAPI.sendToIframe(this.data.focus.iframe.find('iframe')[0], {
            //     type: PMENUM.iframe_active
            // })
        },
        setSizeToFull: function () {
            this.el.removeClass('mini');
        },
        setSizeToMini: function () {
            this.el.addClass('mini');
        },
        /**
         * 关闭所有iframes
         */
        closeAllIframes: function () {
            let temp_arr = _.defaultsDeep([], this.data.sort);
            for (let k of temp_arr) {
                this.actions.closeIframe(k);
            }
        },
        /**
         * 关闭除焦点iframe以外的其它iframe
         */
        closeOtherIframes: function () {
            let temp_arr = _.defaultsDeep([], this.data.sort);
            for (let k of temp_arr) {
                if (k !== this.data.focus.id) {
                    this.actions.closeIframe(k);
                }
            }
        },
        /**
         * 打开标签管理界面（与视图保存界面互斥）
         */
        showTabsPopup: function () {
            if (this.data.tabsControlOpen === false) {
                this.actions.initTabList(this.data.closeHistory);
                this.el.find('.tab-list').show();
                this.el.find('.popup-icon').addClass('mouse-enter-icon');
                this.data.tabsControlOpen = true;
                //保证tabs控制面板和保存视图面板互斥打开
                this.el.find('.view-save-component').hide();
                this.data.saveViewOpen = false;
            } else {
                this.el.find('.tab-list').hide();
                this.el.find('.popup-icon').removeClass('mouse-enter-icon');
                this.data.tabsControlOpen = false;
            }
        },
        /**
         * 取消面板延迟隐藏
         */
        removeTimeOut: function () {
            window.clearTimeout(this.data.timer);
        },
        /**
         * 延时隐藏标签管理界面
         */
        hideTabsPopup() {
            this.data.timer = window.setTimeout(() => {
                this.el.find('.tab-list').hide();
                this.el.find('.popup-icon').removeClass('mouse-enter-icon');
                this.data.tabsControlOpen = false;
            }, 500);
        },
        /**
         * 直接隐藏标签管理界面
         */
        hideTabsPopupImmediately() {
            this.el.find('.tab-list').hide();
            this.el.find('.popup-icon').removeClass('mouse-enter-icon');
            this.data.tabsControlOpen = false;
        },
        /**
         * 更新标签管理界面
         * @param data
         */
        initTabList: function (data) {
            let $parent = this.el.find('.tabs-ul');
            $parent.empty();
            if (data.length > 0) {
                for (let j of data) {
                    let $li = $(`<li class='tab-item' item_name = ${j.name} item_url = ${j.url} item_id = ${j.id}>`);
                    $li.html(j.name);
                    $parent.append($li);
                }
                let $prompt = $('<li class="item-prompt">').html("最近关闭");
                $parent.prepend($prompt);
            }
        },
        /**
         * 关闭当前tabs
         */
        closeFocusTab: function () {
            if (this.data.focus && this.data.count > 0) {
                this.actions.closeIframe(this.data.focus.id);
            }
        },
        /**
         * 冒泡方式监听标签控制界面的点击
         * @param event
         */
        controlTabs: function (event) {
            let name = event.target.textContent;
            if (name === '关闭标签') {
                this.actions.closeFocusTab();
                this.actions.initTabList(this.data.closeHistory);
            } else if (name === '关闭全部标签') {
                this.actions.closeAllIframes();
                this.actions.initTabList(this.data.closeHistory);
            } else if (name === '关闭其他标签') {
                this.actions.closeOtherIframes();
                this.actions.initTabList(this.data.closeHistory);
            } else if (event.target.className.includes('tab-item')) {
                //打开历史记录标签
                let name = event.target.attributes.item_name.value;
                let id = event.target.attributes.item_id.value;
                let url = event.target.attributes.item_url.value;
                this.actions.openIframe(id, url, name);
                this.actions.focusIframe(id);
            }
        },
        // getTabIdByName:function (name,nodes) {
        //     let id = false;
        //     if(!nodes){
        //         return id;
        //     }
        //     for (let k in nodes){
        //         if(nodes[k].name === name){
        //             id = nodes[k].id;
        //         }
        //     }
        //     return id;
        // },
        // getTabNameById:function (id,nodes) {
        //     let name = false;
        //     if(!nodes){
        //         return name;
        //     }
        //     for (let k in nodes){
        //         if(nodes[k].id === id){
        //             name = nodes[k].name;
        //         }
        //     }
        //     return name;
        // },
        /**
         * 获取最后一次退出系统时未关闭的标签数据以及快捷设置中bi/日历的设置记录
         */
        readyOpenTabs: function () {
            //自动打开的标签由系统关闭时未关闭的普通标签和系统快捷设置的特殊标签bi/日历/首页 两部分组成
            TabService.getOpeningTabs().then((result) => {
                //普通标签处理
                let commonTabs = result[0];
                this.actions._getOpenTabList(commonTabs);
                //特殊标签（首页、日历、Bi）处理
                let specialTabs = result[1];
                specialTabs = this.data.defaultUserConfig;
                this.actions._addSpecialTabs(specialTabs);

                //如果bi、calendar均未勾选，则参考后台bi、calendar自动开启设置
                this.actions._getBiCalendarFromConfig();

                //根据config处理结果自动打开tabs
                this.actions.autoOpenTabs();
            });
        },
        _getOpenTabList(result){
            let tabs = {};
            //将未关闭的标签id加入openingTabsList
            if (result.succ === 1) {
                tabs = result.tabs;
                this.data.timeList = tabs;
                delete tabs["0"];
                if (tabs) {
                    for (let k in tabs) {
                        this.data.openingTabsList.push(k);
                    }
                }
            } else {
                console.log("get tabs failed", result.err);
            }
        },
        /**
         * 根据用户快捷设置结果添加特殊标签
         * @param specialConfig  传入数组
         * @private
         */
        _addSpecialTabs(specialConfig){
            //若非数组则设置默认值
            if(!$.isArray(specialConfig)){
                let json = {
                    action:'save',
                    pre_type:4,
                    content:this.data.defaultUserConfig
                };
                UserInfoService.saveUserConfig(json);
            }else{
                for ( let config of specialConfig){
                    if(config['id'] === 'home'){
                        this.actions._getHomeConfig(config);
                    }else{
                        this.actions._dealConfig(config);
                    }
                }
            }
        },
        _dealConfig(config){
            if(config.status.toString() === '1'){
                let temp = {};
                temp['name'] = config['name'];
                temp['id'] = config['id'];
                temp['url'] = config['url'];
                this.data.biCalendarList.push(temp);
            }
            //获取结果存入window.config，初始化用户快捷设置界面时使用
            window.config.sysConfig.logic_config['client_login_show_' + config['id']] = config.status.toString;
        },
        _getHomeConfig(config){
            let homeConfig = config;
            //status为多位数字字符串，最后一位表示开关，前面几位表示首页打开的viewId
            homeConfig.status = homeConfig.status.toString();
            let homeFlag = homeConfig.status.substring(homeConfig.status.length - 1, homeConfig.status.length);
            let canvasNum = homeConfig.status.substring(0,homeConfig.status.length - 1);

            window.config.sysConfig.logic_config.client_login_show_home = homeConfig.status.toString();
            window.config.sysConfig.home_index = '/bi/index/?single=true&query_mark=home#/canvas/' + canvasNum;

            if (homeFlag === '1') {
                this.data.biCalendarList.push({
                    id: 'home',
                    name: '首页',
                    url: window.config.sysConfig.home_index
                });
            }
        },
        /**
         * 用户快捷设置bi和日历均为关闭，则参考manage设置是否打开bi或日历
         * @private
         */
        _getBiCalendarFromConfig(){
            if (window.config.sysConfig.logic_config.client_login_show_bi === '0' && window.config.sysConfig.logic_config.client_login_show_calendar === '0') {
                if (window.config.sysConfig.logic_config.login_show_bi === "1") {
                    this.data.biCalendarList.push({
                        id: 'bi',
                        name: 'BI',
                        url: window.config.sysConfig.bi_index
                    });
                }
                if (window.config.sysConfig.logic_config.login_show_calendar === "1") {
                    this.data.biCalendarList.push({
                        id: 'calendar',
                        name: '日历',
                        url: window.config.sysConfig.calendar_index
                    });
                }
            }
        },
        /**
         * 根据设置准备的数据结果打开iframes
         */
        autoOpenTabs: function () {
            let menu = window.config.menu;
            this.actions.findTabInfo(menu, this.data.openingTabsList, this.data.autoOpenList);
            this.actions.sortTabs(this.data.autoOpenList, this.data.timeList);
            this.data.autoOpenList = this.data.autoOpenList.concat(this.data.biCalendarList);

            //依次打开各标签
            if (this.data.autoOpenList.length) {
                for (let k of this.data.autoOpenList) {
                    this.actions._openIframe(k.id, k.url, k.name);
                }
                this.actions.focusIframe(this.data.autoOpenList[this.data.autoOpenList.length - 1].id);
            }
        },
        /**
         * 使用id取time值，再根据time排序
         * @param tabsList
         * @param timeList
         */
        sortTabs: function (tabsList, timeList) {
            for (let k of tabsList) {
                k.time = timeList[k.id];
            }
            tabsList.sort((a, b) => {
                return a.time - b.time;
            })
        },
        /**
         * 根据id在config中的menu数据中获取iframes的相关数据（url，key）
         * @param nodes
         * @param targetList
         */
        findTabInfo: function (nodes, targetList, resultList) {
            for (let i = 0; i < nodes.length; i++) {
                if (targetList.includes(nodes[i].ts_name) || targetList.includes(nodes[i].table_id)) {
                    resultList.push(this.actions._createItem(nodes[i]));
                    _.remove(targetList, function (n) {
                        return n.id === nodes[i].id;
                    });
                    if (targetList.length === 0) {        //找到所有目标
                        return;
                    }
                }
                if (nodes[i].items && nodes[i].items.length > 0) {
                    this.actions.findTabInfo(nodes[i].items, targetList, resultList);
                }
            }
        },
        _createItem(node){
            let item = {};
            if (node.table_id && node.table_id !== '' && node.table_id !== '0') {
                item.id = node.table_id;
            } else {
                item.id = node.ts_name || '0';
            }
            item.url = node.url;
            item.name = node.label;
            return item;
        },
        /**
         * 根据标签条总宽度tabsTotalWidth计算标签数量
         */
        setTabsCount: function () {
            this.data.tabsTotalWidth = parseInt(this.el.find('div.tabs').width()) - 85;   //标签可用总宽度
            maxIframeCount = Math.round(this.data.tabsTotalWidth / this.data.minTabWidth);  //自适应最大tabs数量
            // let count = Math.round(this.data.tabsTotalWidth / this.data.minTabWidth);
            // maxIframeCount =  count>15 ? 15:count;      //最多不超过15个
        },
        /**
         * 自适应宽度
         */
        adaptTabWidth: function () {
            let singleWidth = this.data.tabsTotalWidth / this.data.count;
            if (singleWidth > this.data.tabWidth) {              //空间有剩余
                this.el.find('.tabs div.item').css("width", "150px");      //有40px padding和1px border,总长150px
            } else {
                this.el.find('.tabs div.item').css("width", singleWidth);
            }
        },
        /**
         * 打开全局搜索界面或通过变更url更新全局搜索界面的内容
         * @param data
         */
        displaySearchResult: function (data) {
            let content = data.content;
            let resultIframe = this.actions._getSearchResultIframe(data);
            if (resultIframe) {
                let newSrc = '/search_result?searchContent=' + content;
                $(resultIframe).attr("src", newSrc);
                this.actions.focusIframe("search-result");
            } else {
                //搜索结果展示窗口未打开
                let id = "search-result";
                let url = "/search_result?searchContent=" + content;
                let name = "搜索结果";
                this.actions.openIframe(id, url, name);
                this.actions.focusIframe(id);
            }
        },
        _getSearchResultIframe(data){
            let formerContent = data.formerContent;
            //判断搜索结果iframe是否已打开，打开则重置src
            //此处全局搜索div.iframes
            let iframes = this.el.find("div.iframes iframe");
            let str = "searchContent=" + formerContent;
            str = encodeURI(str);
            for (let k of iframes) {
                if (k.src.indexOf(str) > 0) {
                    return k;
                }
            }
        },
        /**
         * 打开视图保存界面（与标签控制界面互斥打开）
         */
        showViewSave: function () {
            if (this.data.saveViewOpen === false) {
                this.el.find('.view-save-component').show();
                this.data.saveViewOpen = true;
                //保证保存视图页面和标签控制页面互斥打开
                this.el.find('.tab-list').hide();
                this.data.tabsControlOpen = false;
            } else {
                this.el.find('.view-save-component').hide();
                this.data.saveViewOpen = false;
                //调用子组件方法，清空input，切换至普通模式
                this.saveView.actions.resetComponent();
            }
        },
        /**
         * 直接关闭保存视图页面
         */
        closeSaveViewPage: function () {
            this.el.find('.view-save-component').hide();
            this.data.saveViewOpen = false;
        },
        /**
         * 延迟关闭保存视图页面
         */
        hideSaveViewPage: function () {
            this.data.timer = window.setTimeout(() => {
                this.el.find('.view-save-component').hide();
                //调用子组件方法，清空input，切换为正常模式
                this.saveView.actions.resetComponent();
                this.data.saveViewOpen = false;
            }, 500);
        },
        /**
         * 预加载常用iframes
         */
        preLoadIframes: function () {
            // let menu = window.config.menu;
            // let tempList = window.config.commonUse.data;
            // this.actions.findTabInfo(menu,tempList,this.data.commonUseList);
            // IframesManager.initIframes(this.data.commonUseList, this.data.iframes);
        },

        loadHidingIframes: function () {
            console.log('loading');
            setTimeout(() => {
                this.actions._startLoadingIframe();
            }, 3000);
        },
        _startLoadingIframe:function () {
            let iframe = this.data.iframes.find('iframe[_src]:last');
            if (iframe.length) {
                this.actions._loadIframe(iframe);
            }
        },
        _loadIframe:function(iframe){
            iframe.attr('src', iframe.attr('_src'));
            iframe.removeAttr('_src');
            let that = this;
            iframe.on('load', function(){
                that.actions._startLoadingIframe();
                let item = $(this).parent();
                item.attr('load', 'complete');
                that.actions.iframeHideLoading(item);
            });
        },
        iframeShowLoading: function (root) {
            let size = 50;
            root.addClass('component-loading-effect');
            $('<div class="component-loading-cover">').appendTo(root);
            let loadingHtml = `<div class='component-loading-box'><div class ="dot1"></div><div class ="dot2"></div><div class ="dot3"></div><div class ="dot4"></div><div class ="dot5"></div></div>`;
            this.loadingEffectBox = $(loadingHtml).appendTo(root);

            this.loadingEffectBox.css({
                "width": size,
                "height": size,
                marginLeft: -size / 2,
                marginTop: -size / 2
            });
        },
        /**
         * 隐藏iframeloading
         * @param root
         */
        iframeHideLoading: function (root) {
            root.find('.component-loading-cover').remove();
            root.find('.component-loading-box').remove();
            root.removeClass('component-loading-effect');
        },
        /**
         * 通过id打开iframe
         * @param id id以数组方式传入,适用一次打开多个tabs
         */
        openIframeById: function (id, flag) {
            let res = [];
            let menu = window.config.menu;
            this.actions.findTabInfo(menu, id, res);

            if (res.length) {
                for (let k of res) {
                    this.actions.openIframe(k.id, k.url, k.name, flag);
                }
                this.actions.focusIframe(res[res.length - 1].id);
            }
        },
        _turnOnMediators:function () {
            Mediator.on('menu:item:openiframe', (data) => {
                this.actions.openIframe(data.id, data.url, data.name, data.flag);
                this.actions.focusIframe(data.id);
            });
            Mediator.on('search:displayreuslt', (data) => {
                this.actions.displaySearchResult(data);
            });
            Mediator.on('aside:size', (order) => {
                if (order === 'full') {
                    this.actions.setSizeToFull();
                } else {
                    this.actions.setSizeToMini();
                }
            });
            // Mediator.on('socket:table_invalid', this.actions.sendMsgToIframes);
            // Mediator.on('socket:data_invalid', this.actions.sendMsgToIframes);
            // Mediator.on('socket:one_the_way_invalid', this.actions.sendMsgToIframes);
            // Mediator.on('socket:workflow_approve_msg', this.actions.sendMsgToIframes);

            Mediator.on('saveview:displayview', (data) => {
                this.actions.closeAllIframes();  //先关闭所有标签，再打开view中的标签
                if (data.length) {
                    for (let k of data) {
                        this.actions.openIframe(k.id, k.url, k.name);
                    }
                    this.actions.focusIframe(data[data.length - 1].id);
                    this.actions.loadHidingIframes();
                }
            });
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.tabs .item',
            callback: function (target) {
                let id = $(target).attr('iframeid');
                this.actions.focusIframe(id);
                window.top.miniFormValTableId = id;
            }
        },
        {
            event: 'click',
            selector: '.tabs .item .close',
            callback: function (target) {
                let bool = false;
                if (window.top.miniFormVal) {
                    if (Object.keys(window.top.miniFormVal).indexOf($(target).attr('iframeid')) != -1 && window.top.miniFormVal[$(target).attr('iframeid')] != '') {
                        msgbox.alert('本表中有未提交的表单，请先完成提交或关闭表单');
                    } else {
                        delete window.top.miniFormVal[$(target).attr('iframeid')];
                        bool = true;
                    }
                } else {
                    bool = true;
                }
                if (bool) {
                    let id = $(target).attr('iframeid');
                    this.actions.closeIframe(id);
                    return false;
                }
            },
        },
        // {
        //     event:'click',
        //     selector:'.view-save',
        //     callback:function () {
        //         let temp_arr = _.defaultsDeep([],this.data.sort);
        //         SaveView.show(temp_arr);
        //     }
        // },
        // {
        //     event:'mouseleave',
        //     selector:'.popup-icon',
        //     callback:function () {
        //         this.actions.resetIcon();
        //     }
        // },
        {
            event: 'click',
            selector: '.popup-icon',
            callback: function () {
                this.actions.showTabsPopup();       //打开标签控制页面
            }
        },
        {
            event: 'mouseenter',
            selector: '.view-popup',
            callback: function () {
                this.actions.removeTimeOut();       //取消隐藏标签控制页面
            }
        },
        {
            event: 'click',
            selector: '.tab-list',
            callback: function (target, event) {
                this.actions.controlTabs(event);
            }
        },
        {
            event: 'mouseleave',
            selector: '.view-popup',
            callback: function () {
                this.actions.hideTabsPopup();       //鼠标离开延迟隐藏标签控制页面
            }
        },
        {
            event: 'click',
            selector: '.drop-up-icon',
            callback: function (target, event) {
                this.actions.hideTabsPopupImmediately();        //点击三角立刻关闭标签控制页面
                event.stopPropagation();
            }
        },
        {
            event: 'click',
            selector: '.view-save',
            callback: function (target, event) {
                this.actions.showViewSave();            //打开保存视图页面
            }
        },
        {
            event: 'mouseenter',
            selector: '.view-save-group',
            callback: function () {
                this.actions.removeTimeOut();       //取消隐藏视图保存页面
            }
        },
        {
            event: 'mouseleave',
            selector: '.view-save-group',
            callback: function () {
                this.actions.hideSaveViewPage();       //鼠标离开延迟隐藏视图保存页面
            }
        },
    ],
    afterRender: function () {
        this.data.tabs = this.el.find('.tabs');
        this.data.iframes = this.el.find('.iframes');
        this.actions.setTabsCount();
        this.actions.readyOpenTabs();
        // this.actions.preLoadIframes();

        $(window).resize(()=> {          //监听浏览器大小变化，自适应标签宽度
            this.actions.setTabsCount();
            this.actions.adaptTabWidth();
        });

        //初始化保存视图组件
        this.saveView = new SaveView({
            data: {
                iframesComponent: this
            },
            actions: {closeSaveView: this.actions.closeSaveViewPage}
        });
        this.saveView.render(this.el.find('.view-save-component'));
    },

    firstAfterRender: function () {
        this.actions._turnOnMediators();
        //订阅bi的画布块点击title，打开数据源的tab
        PMAPI.subscribe(PMENUM.open_iframe_by_id, (data) => {
            this.actions.openIframeById(data.id, false);
        });

        Mediator.subscribe('menu:homePageRefresh', (data) => {
            if(this.data.hash['home'] === undefined){
                return;
            }
            this.actions.closeIframe('home');
            this.actions.openIframe(data.id, data.url, data.name, data.flag);
            this.actions.focusIframe(data.id);
        });

        this.actions.loadHidingIframes();

    },

    beforeDestory: function () {
        Mediator.removeAll('menu');
    }
});

export {IframeComponent};


