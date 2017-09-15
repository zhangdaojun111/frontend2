/**
 * Created by xiongxiaotao on 2017/7/29.
 */
import Component from '../../../lib/component';
import template from './iframe.html';
import Mediator from '../../../lib/mediator';
import './iframe.scss';
import {PMAPI, PMENUM} from '../../../lib/postmsg';
import {SaveView} from "./new-save-view/new-save-view"
import {TabService} from "../../../services/main/tabService"

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

export const IframeInstance = new Component({
    template: template,
    data: {
        hash: {},
        count: 0,
        sort: [],
        focus: null,
        hideFlag:false,
        openingTabsList:[],      //记录未关闭的tabs的id
        timeList:{},             //记录tabs的时间戳
        biCalendarList:[],       //记录日历BI是否开启，tabs排序完成后，与autoOpenList合并
        autoOpenList:[],         //记录根据id找到的iframes的所有信息url、id、name用于打开iframes
        // isAutoOpenTabs:true,     //标记是否为首次加载tabs
        tabsTotalWidth:"",       //tabs可用总长度 = div.tabs - 85;
        tabWidth:150,            //单个tabs长度，默认150（需和scss同步修改），空间不足以后自适应宽度
        minTabWidth:100,         //用于估算小屏设备最大tabs数量
        closeHistory:[],         //用于保存历史关闭记录，记录最近5个
        tabsControlOpen:false,   //标签控制界面标记
        saveViewOpen:false       //保存视图界面标记
    },
    actions: {
        openIframe: function (id, url, name) {
            this.actions.sendOpenRequest(id);
            id = id.toString();
            if (this.data.hash[id] === undefined) {
                let tab = $(`<div class="item" iframeid="${id}" title="${name}">${name}<a class="close icon-framework-close" iframeid="${id}"></a></div>`)
                    .prependTo(this.data.tabs);
                let iframe = $(`<div class="item"><iframe id="${id}" src="${url}"></iframe></div>`).appendTo(this.data.iframes);
                let originIframe = iframe.find('iframe');

                // this.showLoading(this.data.iframes);
                // window.clearTimeout(this.data.loadingTimer);
                // this.data.loadingTimer = window.setTimeout(() => {
                //     this.hideLoading();
                // }, 500);

                originIframe.on('load', function () {
                    PMAPI.sendToIframe(originIframe[0], {
                        type: PMENUM.open_iframe_data,
                        data: {
                            iframe: 'load'
                        }
                    });
                });

                this.data.hash[id] = {id, url, name, tab, iframe};
                this.data.sort.push(id);
                this.data.count++;
            }
            this.actions.focusIframe(id);
            if (this.data.count > maxIframeCount) {
                this.actions.closeFirstIframe();
            }
            this.actions.adaptTabWidth();
        },
        sendOpenRequest:function (id) {
            if (id !== 'search-result'){
                //向后台发送请求记录
                TabService.onOpenTab(id).done((result) => {
                    if(result.success === 1){
                        // console.log("post open record success");
                    }else{
                        console.log("post open record failed")
                    }
                });
            }
        },
        sendCloseRequest:function (id) {
            TabService.onCloseTab(id,this.data.focus.id).done((result) => {
                if(result.success === 1){
                    // console.log("post close record success")
                }else{
                    console.log("post close record failed")
                }
            });
        },
        closeFirstIframe: function () {
            let firstId = this.data.sort.shift();
            this.actions.closeIframe(firstId);
        },
        closeIframe: function (id) {
            if ( id === undefined) {
                return;
            }

            this.actions.sendCloseRequest(id);
            let item = this.data.hash[id];
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
        setCloseHistory:function (item) {
            if(item.name !== 'BI' && item.name !== '日历'&& item.name !== '搜索结果'){    //不保存搜索/BI/日历
                _.remove(this.data.closeHistory,function (n) {      //去重和重新插入，确保最后关闭的在记录最前面
                    return n.name === item.name;
                });
                this.data.closeHistory.unshift(item);
                if(this.data.closeHistory.length > 5){
                    this.data.closeHistory.pop();
                }
            }
        },
        focusIframe: function (id) {
            if (this.data.focus) {
                this.data.focus.tab.removeClass('focus');
                this.data.focus.iframe.hide();

                PMAPI.sendToIframe(this.data.focus.iframe.find('iframe')[0], {
                    type: PMENUM.iframe_silent
                })
            }
            this.data.focus = this.data.hash[id];
            this.data.focus.iframe.show();
            this.data.focus.tab.addClass('focus');

            PMAPI.sendToIframe(this.data.focus.iframe.find('iframe')[0], {
                type: PMENUM.iframe_active
            })
        },
        setSizeToFull: function () {
            this.el.removeClass('mini');
        },
        setSizeToMini: function () {
            this.el.addClass('mini');
        },
        closeAllIframes:function () {
            let temp_arr = _.defaultsDeep([],this.data.sort);
            for(let k of temp_arr){
                this.actions.closeIframe(k);
            }
        },
        closeOtherIframes:function () {
            let temp_arr = _.defaultsDeep([],this.data.sort);
            for (let k of temp_arr){
                if( k !== this.data.focus.id){
                    this.actions.closeIframe(k);
                }
            }
        },
        showTabsPopup:function () {
            if(this.data.tabsControlOpen === false){
                this.actions.initTabList(this.data.closeHistory);
                this.el.find('.tab-list').show();
                this.el.find('.popup-icon').addClass('mouse-enter-icon');
                //保证tabs控制面板和保存视图面板互斥打开
                this.el.find('.view-save-component').hide();
                this.data.tabsControlOpen = true;
            }else{
                this.el.find('.tab-list').hide();
                this.el.find('.popup-icon').removeClass('mouse-enter-icon');
                this.data.tabsControlOpen = false;
            }
        },
        removeTimeOut:function () {
            window.clearTimeout(this.data.timer);
        },
        // resetIcon:function () {
        //     this.el.find('.popup-icon').removeClass('mouse-enter-icon');
        // },
        hideTabsPopup(){
            this.data.timer = window.setTimeout(() => {
                this.el.find('.tab-list').hide();
                this.el.find('.popup-icon').removeClass('mouse-enter-icon');
                this.data.tabsControlOpen = false;
            }, 500);
        },
        hideTabsPopupImmediately(){
            this.el.find('.tab-list').hide();
            this.el.find('.popup-icon').removeClass('mouse-enter-icon');
            this.data.tabsControlOpen = false;
        },
        initTabList:function (data) {
            let $parent = this.el.find('.tabs-ul');
            $parent.empty();
            if(data.length > 0){
                for(let j of data){
                    let $li = $(`<li class='tab-item' item_name = ${j.name} item_url = ${j.url} item_id = ${j.id}>`);
                    $li.html(j.name);
                    $parent.append($li);
                }
                let $prompt = $('<li class="item-prompt">').html("最近关闭");
                $parent.prepend($prompt);
            }
        },
        closeFocusTab:function () {
            if(this.data.focus){
                this.actions.closeIframe(this.data.focus.id);
            }
        },
        controlTabs:function (event) {
            let name = event.target.textContent;
            if(name === '关闭标签'){
                this.actions.closeFocusTab();
                this.actions.initTabList(this.data.closeHistory);
            }else if(name === '关闭全部标签'){
                this.actions.closeAllIframes();
                this.actions.initTabList(this.data.closeHistory);
            }else if(name === '关闭其他标签'){
                this.actions.closeOtherIframes();
                this.actions.initTabList(this.data.closeHistory);
            }else{
                //打开历史记录标签
                let name = event.target.attributes.item_name.value;
                let id = event.target.attributes.item_id.value;
                let url = event.target.attributes.item_url.value;
                this.actions.openIframe(id,url,name);
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
        readyOpenTabs:function () {
            //自动打开的标签由系统设置的bi/日历 和 最后一次系统关闭时未关闭的标签两部分组成
            //第一部分：获取系统关闭时未关闭的tabs
            let that = this;
            TabService.getOpeningTabs().then((result) => {
                let tabs = {};
                //将未关闭的标签id加入openingTabsList
                if(result[0].succ === 1){
                    tabs = result[0].tabs;
                    that.data.timeList = tabs;
                    delete tabs["0"];
                    if(tabs){
                        for(let k in tabs){
                            that.data.openingTabsList.push(k);
                        }
                    }
                }else{
                    console.log("get tabs failed",result[0].err);
                }

                if(result[1].succ === 1){
                    let biConfig = result[1];
                    //检测数据biConfig.data是否为两位数，如果不是，给用户设置默认值10
                    if(biConfig.data !== "10" && biConfig.data !== "11" && biConfig.data !== "20" && biConfig.data !== "21"){
                        biConfig.data = "10";
                    }
                    if((biConfig.data && biConfig.data.toString() !== "10" && biConfig.data.toString() !== "20")){
                        that.data.biCalendarList.push({
                            id: 'bi',
                            name: 'BI',
                            url: window.config.sysConfig.bi_index
                        });
                    }
                    window.config.sysConfig.logic_config.login_show_bi = biConfig.data.toString();
                }else{
                    console.log("get tabs failed",result[1].err);
                }

                if(result[2].succ === 1){
                    let calendarConfig = result[2];
                    //检测数据calendarConfig.data是否为两位数，如果不是，给用户设置默认值20
                    if(calendarConfig.data !== "10" && calendarConfig.data !== "11" && calendarConfig.data !== "20" && calendarConfig.data !== "21"){
                        calendarConfig.data = "20";
                    }
                    window.config.sysConfig.logic_config.login_show_calendar = calendarConfig.data.toString();
                    if((calendarConfig.data && calendarConfig.data.toString() === "11")){
                        that.data.biCalendarList.unshift({
                            id: 'calendar',
                            name: '日历',
                            url: window.config.sysConfig.calendar_index
                        });
                    }else if((calendarConfig.data && calendarConfig.data.toString() === "21")){
                        that.data.biCalendarList.push({
                            id: 'calendar',
                            name: '日历',
                            url: window.config.sysConfig.calendar_index
                        });
                    }
                }
                that.actions.autoOpenTabs();
            });
        },
        autoOpenTabs:function () {
            let menu = window.config.menu;
            this.actions.findTabInfo(menu,this.data.openingTabsList);
            this.actions.sortTabs(this.data.autoOpenList,this.data.timeList);
            this.data.autoOpenList =  this.data.autoOpenList.concat(this.data.biCalendarList);
            //依次打开各标签
            for(let k of this.data.autoOpenList){
                this.actions.openIframe(k.id,k.url,k.name);
            }
            // this.data.isAutoOpenTabs = false;   //首次自动打开的页面无需向后台发送请求，以后打开页面需要向后台发送请求
        },
        sortTabs:function (tabsList,timeList) {     //使用id取time值，再根据time排序
            for(let k of tabsList){
                k.time = timeList[k.id];
            }
            tabsList.sort((a,b) => {
                return a.time - b.time;
            })
        },
        findTabInfo:function (nodes,targetList) {
            for( let i=0; i < nodes.length; i++){
                if(targetList.includes(nodes[i].ts_name ) || targetList.includes(nodes[i].table_id )){
                    let item = {};
                    if(nodes[i].table_id && nodes[i].table_id !== ''&& nodes[i].table_id !== '0'){
                        item.id = nodes[i].table_id;
                    }else{
                        item.id = nodes[i].ts_name || '0';
                    }

                    item.url = nodes[i].url;
                    item.name = nodes[i].label;
                    this.data.autoOpenList.push(item);
                    _.remove(targetList,function (n) {
                        return n.id === nodes[i].id;
                    });
                    if(targetList.length === 0){        //找到所有目标
                        return;
                    }
                }
                if(nodes[i].items && nodes[i].items.length > 0){
                    this.actions.findTabInfo(nodes[i].items,targetList);
                }
            }
        },
        sendMsgToIframes: function (info) {
            PMAPI.sendToAllChildren({
                type: PMENUM[info.typeName],
                data: info
            });
        },
        setTabsCount:function () {
            this.data.tabsTotalWidth = parseInt(this.el.find('div.tabs').width()) - 85;   //标签可用总宽度
            maxIframeCount = Math.round(this.data.tabsTotalWidth / this.data.minTabWidth);  //自适应最大tabs数量
            // let count = Math.round(this.data.tabsTotalWidth / this.data.minTabWidth);
            // maxIframeCount =  count>15 ? 15:count;      //最多不超过15个
        },
        //自适应宽度
        adaptTabWidth:function () {
            let singleWidth = this.data.tabsTotalWidth/this.data.count ;
            if(singleWidth  > this.data.tabWidth){              //空间有剩余
                this.el.find('.tabs div.item').css("width","150px");      //有40px padding和1px border,总长150px
            }else{
                this.el.find('.tabs div.item').css("width",singleWidth);
            }
        },
        sendMsgToIframes: function (info) {
            PMAPI.sendToAllChildren({
                type: PMENUM[info.typeName],
                data: info
            });
        },
        displaySearchResult:function (data) {
            let content = data.content;
            let formerContent = data.formerContent;
            //判断搜索结果iframe是否已打开，打开则重置src
            //此处全局搜索div.iframes
            let resultIframe;
            let iframes =  this.el.find("div.iframes iframe");
            let str = "searchContent=" + formerContent;
            str = encodeURI(str);
            for(let k of iframes){
                let src = k.src;
                if(src.indexOf(str) > 0){
                    resultIframe = k;
                }
            }

            if(resultIframe){
                let newSrc = '/search_result?searchContent=' + content;
                $(resultIframe).attr("src",newSrc);
                this.actions.focusIframe("search-result");
            }else{
                //搜索结果展示窗口未打开
                let id = "search-result";
                let url = "/search_result?searchContent=" + content;
                let name = "搜索结果";
                this.actions.openIframe(id,url,name);
            }
        },
        showViewSave:function () {
            if(this.data.saveViewOpen === false){
                this.el.find('.view-save-component').show();
                this.data.saveViewOpen = true;
                //保证保存视图页面和标签控制页面互斥打开
                this.el.find('.tab-list').hide();
            }else{
                this.el.find('.view-save-component').hide();
                this.data.saveViewOpen = false;
                //调用子组件方法，清空input，切换至普通模式
                this.saveView.actions.resetComponent();
            }

        },
        closeSaveViewPage:function () {
            this.el.find('.view-save-component').hide();
            this.data.saveViewOpen = false;
        },
        hideSaveViewPage:function () {
            this.data.timer = window.setTimeout(() => {
                this.el.find('.view-save-component').hide();
                //调用子组件方法，清空input，切换为正常模式
                this.saveView.actions.resetComponent();
                this.data.saveViewOpen = false;
            }, 500);
        }
    },
    binds:[
        {
            event:'click',
            selector:'.tabs .item',
            callback:function (target) {
                let id = $(target).attr('iframeid');
                this.actions.focusIframe(id);
            }
        },
        {
            event:'click',
            selector:'.tabs .item .close',
            callback:function (target) {
                let id = $(target).attr('iframeid');
                this.actions.closeIframe(id);
                return false;
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
            event:'click',
            selector:'.popup-icon',
            callback:function () {
                this.actions.showTabsPopup();       //打开标签控制页面
            }
        },
        {
            event:'mouseenter',
            selector:'.view-popup',
            callback:function () {
                this.actions.removeTimeOut();       //取消隐藏标签控制页面
            }
        },
        {
            event:'click',
            selector:'.tab-list',
            callback:function (target,event) {
                this.actions.controlTabs(event);
            }
        },
        {
            event:'mouseleave',
            selector:'.view-popup',
            callback:function () {
                this.actions.hideTabsPopup();       //鼠标离开延迟隐藏标签控制页面
            }
        },
        {
            event:'click',
            selector:'.drop-up-icon',
            callback:function (target,event) {
                this.actions.hideTabsPopupImmediately();        //点击三角立刻关闭标签控制页面
                event.stopPropagation();
            }
        },
        {
            event:'click',
            selector:'.view-save',
            callback:function (target,event) {
                this.actions.showViewSave();            //打开保存视图页面
            }
        },
        {
            event:'mouseenter',
            selector:'.view-save-group',
            callback:function () {
                this.actions.removeTimeOut();       //取消隐藏视图保存页面
            }
        },
        {
            event:'mouseleave',
            selector:'.view-save-group',
            callback:function () {
                this.actions.hideSaveViewPage();       //鼠标离开延迟隐藏视图保存页面
            }
        },
    ],
    afterRender: function () {
        this.data.tabs = this.el.find('.tabs');
        this.data.iframes = this.el.find('.iframes');
        this.actions.setTabsCount();
        this.actions.readyOpenTabs();

        let that = this;
        $(window).resize(function () {          //监听浏览器大小变化
            that.actions.setTabsCount();
            that.actions.adaptTabWidth();
        });

        //初始化保存视图组件
        this.saveView = new SaveView(this.data.sort,this.actions.closeSaveViewPage);
        this.saveView.render(this.el.find('.view-save-component'));

        // this.el.on('click', '.tabs .item .close', function () {
        //     let id = $(this).attr('iframeid');
        //     console.log(id);
        //     that.actions.closeIframe(id);
        //     return false;
        // });

        // this.el.on('click', '.tabs .item', function () {
        //     let id = $(this).attr('iframeid');
        //     that.actions.focusIframe(id);
        // });
    },

    firstAfterRender: function () {
        Mediator.on('menu:item:openiframe', (data) => {
            this.actions.openIframe(data.id, data.url, data.name)
        });
        Mediator.on('search:displayreuslt',(data) => {
            this.actions.displaySearchResult(data);
        });
        Mediator.on('aside:size', (order) => {
            if (order === 'full') {
                this.actions.setSizeToFull();
            } else {
                this.actions.setSizeToMini();
            }
        });

        Mediator.on('socket:table_invalid', this.actions.sendMsgToIframes);
        Mediator.on('socket:data_invalid', this.actions.sendMsgToIframes);
        Mediator.on('socket:one_the_way_invalid', this.actions.sendMsgToIframes);
        Mediator.on('socket:workflow_approve_msg', this.actions.sendMsgToIframes);

        Mediator.on('saveview:displayview', (data) => {
            this.actions.closeAllIframes();  //先关闭所有标签，再打开view中的标签
            for(let k of data){
                this.actions.openIframe(k.id,k.url,k.name);
            }
        })
    },

    beforeDestory: function () {
        Mediator.removeAll('menu');
    }
});
