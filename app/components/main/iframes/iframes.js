/**
 * Created by xiongxiaotao on 2017/7/29.
 */
import Component from '../../../lib/component';
import template from './iframe.html';
import Mediator from '../../../lib/mediator';
import './iframe.scss';
import {PMAPI, PMENUM} from '../../../lib/postmsg';
import {SaveView} from "./save-view/save-view"
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
        tempList:[],        //记录未关闭的tabs的id
        timeList:{},        //记录tabs的时间戳
        biCalendarList:[],  //记录日历BI是否开启，tabs排序完成后，与autoOpenList合并
        autoOpenList:[],        //记录根据id找到的iframes的所有信息url、id、name用于打开iframes
        isLoginShowBI:"",
        isLoginShowCalendar:"",
        isAutoOpenTabs:true,    //标记是否为首次加载tabs
        tabsTotalWidth:"",           //tabs可用总长度 = div.tabs - 200;
        tabWidth:140,           //单个tabs长度，默认140（需和scss同步修改），空间不足以后自适应宽度
        minTabWidth:100,        //用于估算小屏设备最大tabs数量
    },
    actions: {
        openIframe: function (id, url, name) {
            id = id.toString();
            if (this.data.hash[id] === undefined) {
                this.actions.sendOpenRequest(id);       //确认iframe未被打开才发送请求，避免重复更新时间，扰乱排序
                let tab = $(`<div class="item" iframeid="${id}" title="${name}">${name}<a class="close" iframeid="${id}"></a></div>`)
                    .prependTo(this.data.tabs);
                let iframe = $(`<div class="item"><iframe id="${id}" src="${url}"></iframe></div>`).appendTo(this.data.iframes);
                let originIframe = iframe.find('iframe');

                originIframe.on('load', function () {
                    PMAPI.sendToChild(originIframe[0], {
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
            if (this.data.isAutoOpenTabs === false && id !== 'search-result' && id !== 'bi' && id !== 'calendar'){      //不对搜索、bi、日历标签进行记录
                //向后台发送请求记录
                TabService.onOpenTab(id).done((result) => {
                    if(result.success === 1){
                        // console.log("post open record success");
                    }else{
                        console.log("post open record failed",result);
                    }
                });
            }
        },
        sendCloseRequest:function (id) {
            TabService.onCloseTab(id,this.data.focus.id).done((result) => {
                if(result.success === 1){
                    // console.log("post close record success")
                }else{
                    console.log("post close record failed",result);
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
        focusIframe: function (id) {
            if (this.data.focus) {
                this.data.focus.tab.removeClass('focus');
                this.data.focus.iframe.hide();

                PMAPI.sendToChild(this.data.focus.iframe.find('iframe')[0], {
                    type: PMENUM.iframe_silent
                })
            }
            this.data.focus = this.data.hash[id];
            this.data.focus.iframe.show();
            this.data.focus.tab.addClass('focus');

            PMAPI.sendToChild(this.data.focus.iframe.find('iframe')[0], {
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
            this.actions.initTabList(this.data.sort);
            this.el.find('.tab-list').show();
            this.el.find('.popup-icon').addClass('mouse-enter-icon');
            window.clearTimeout(this.data.timer)
        },
        resetIcon:function () {
            this.el.find('.popup-icon').removeClass('mouse-enter-icon');
        },
        clearTimeOut:function () {
            window.clearTimeout(this.data.timer);
        },
        hideTabsPopup(){
            this.data.timer = window.setTimeout(() => {
                this.el.find('.tab-list').hide();
            }, 500);
        },
        initTabList:function (data) {
            let names = [];
            for(let k of data){
                let temp = this.actions.getTabNameById(k,this.data.hash);
                names.unshift(temp);
            }

            let $parent = this.el.find('.tabs-ul');
            $parent.empty();
            for(let j of names){
                let $li = $("<li class='tab-item'>");
                $li.html(j);
                $parent.append($li);
            }
            // let $li = $('<li><i class="drop-down-icon"></i></li>');
            // $parent.append($li);
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
                this.actions.initTabList(this.data.sort);
            }else if(name === '关闭全部标签'){
                this.actions.closeAllIframes();
                this.actions.initTabList(this.data.sort);
            }else if(name === '关闭其他标签'){
                this.actions.closeOtherIframes();
                this.actions.initTabList(this.data.sort);
            }else{
                //选中标签获得焦点
                let id = this.actions.getTabIdByName(name,this.data.hash);
                if(id){
                    this.actions.focusIframe(id);
                }
            }
        },
        getTabIdByName:function (name,nodes) {
            let id = false;
            if(!nodes){
                return id;
            }
            for (let k in nodes){
                if(nodes[k].name === name){
                    id = nodes[k].id;
                }
            }
            return id;
        },
        getTabNameById:function (id,nodes) {
            let name = false;
            if(!nodes){
                return name;
            }
            for (let k in nodes){
                if(nodes[k].id === id){
                    name = nodes[k].name;
                }
            }
            return name;
        },
        readyOpenTabs:function () {
            //自动打开的标签由系统设置的bi/日历 和 最后一次系统关闭时未关闭的标签两部分组成
            //第一部分：获取系统关闭时未关闭的tabs
            let that = this;
            TabService.getOpeningTabs().then((result) => {
                let tabs = {};
                //将未关闭的标签id加入tempList
                if(result[0].succ === 1){
                    tabs = result[0].tabs;
                    that.data.timeList = tabs;
                    delete tabs["0"];
                    if(tabs){
                        for(let k in tabs){
                            that.data.tempList.push(k);
                        }
                    }
                }else{
                    console.log("get tabs failed",result[0].err);
                }

                if(result[1].succ === 1){
                    let biConfig = result[1];
                    if((biConfig.data && biConfig.data === "1")){
                        that.data.biCalendarList.push({
                            id: 'bi',
                            name: 'BI',
                            url: window.config.sysConfig.bi_index
                        });
                        window.config.sysConfig.logic_config.login_show_bi = "1";
                    }
                }else{
                    console.log("get tabs failed",result[1].err);
                }

                if(result[2].succ === 1){
                    let calendarConfig = result[2];
                    if((calendarConfig.data && calendarConfig.data === "1")){
                        that.data.biCalendarList.push({
                            id: 'calendar',
                            name: '日历',
                            url: window.config.sysConfig.calendar_index
                        });
                        window.config.sysConfig.logic_config.login_show_calendar = "1";
                    }
                }
                that.actions.autoOpenTabs();
            });
        },
        autoOpenTabs:function () {
            let tempList = this.data.tempList;
            let menu = window.config.menu;
            this.actions.findTabInfo(menu,tempList);
            this.actions.sortTabs(this.data.autoOpenList,this.data.timeList);
            this.data.autoOpenList =  this.data.autoOpenList.concat(this.data.biCalendarList);
            //依次打开各标签
            for(let k of this.data.autoOpenList){
                this.actions.openIframe(k.id,k.url,k.name);
            }
            this.data.isAutoOpenTabs = false;   //首次自动打开的页面无需向后台发送请求，以后打开页面需要向后台发送请求
        },
        sortTabs:function (tabsList,timeList) {
            for(let k of tabsList){
                k.time = timeList[k.id];
            }
            tabsList.sort((a,b) => {
                return a.time - b.time;
            })
        },
        findTabInfo:function (nodes,targetList) {
            for( let i=0; i < nodes.length; i++){
                if(targetList.includes(nodes[i].id ) || targetList.includes(nodes[i].table_id )){
                    let item = {};
                    item.id = nodes[i].id;
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
        setTabsCount:function () {
            this.data.tabsTotalWidth = parseInt(this.el.find('div.tabs').width()) - 100;   //标签可用宽度
            maxIframeCount = Math.round(this.data.tabsTotalWidth / this.data.minTabWidth);  //自适应最大tabs数量
            // let count = Math.round(this.data.tabsTotalWidth / this.data.minTabWidth);
            // maxIframeCount =  count>15 ? 15:count;      //最多不超过15个启用这一行
        },
        //自适应宽度
        adaptTabWidth:function () {
            let singleWidth = this.data.tabsTotalWidth/this.data.count ;
            if(singleWidth  > this.data.tabWidth){              //空间有剩余
                this.el.find('.tabs div.item').css("width","104px");      //有25px padding-right,总长140px
            }else{
                let width = singleWidth - 35 + "px";            // -25 padding
                this.el.find('.tabs div.item').css("width",width);
            }
        },
        sendMsgToIframes: function (info) {
            PMAPI.sendToAllChildren({
                type: PMENUM[info.typeName],
                data: info
            });
        }
    },
    afterRender: function () {
        let that = this;
        this.data.tabs = this.el.find('.tabs');
        this.data.iframes = this.el.find('.iframes');
        this.actions.setTabsCount();
        this.actions.readyOpenTabs();
        $(window).resize(() => {            //监听浏览器窗口变化，重置参数及自适应窗口大小
            that.actions.setTabsCount();
            that.actions.adaptTabWidth();
        });

        this.el.on('click', '.tabs .item .close', function () {
            let id = $(this).attr('iframeid');
            that.actions.closeIframe(id);
            return false;
        });

        this.el.on('click', '.tabs .item', function () {
            let id = $(this).attr('iframeid');
            that.actions.focusIframe(id);
        });

        this.el.on('click','.view-save',function () {
            let temp_arr = _.defaultsDeep([],that.data.sort);
            SaveView.show(temp_arr);
        }).on('mouseenter','.popup-icon',() => {
            this.actions.showTabsPopup();
        }).on('mouseleave','.popup-icon',() => {
            this.actions.resetIcon();
        }).on('mouseenter','.view-popup',() => {
            this.actions.clearTimeOut();
        }).on('click','.tab-list',(event) => {
            this.actions.controlTabs(event);
        }).on('mouseleave','.view-popup',() => {
            this.actions.hideTabsPopup();
        })
    },

    firstAfterRender: function () {
        Mediator.on('menu:item:openiframe', (data) => {
            this.actions.openIframe(data.id, data.url, data.name)
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
        Mediator.on('socket:on_the_way_invalid', this.actions.sendMsgToIframes);

        Mediator.on('saveview:displayview', (data) => {
            this.actions.closeAllIframes();  //先关闭所有标签，再打开view中的标签
            console.log(data);
            for(let k of data){
                this.actions.openIframe(k.id,k.url,k.name);
            }
        })
    },

    beforeDestory: function () {
        Mediator.removeAll('menu');
    }
});
