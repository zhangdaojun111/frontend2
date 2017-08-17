/**
 * Created by xiongxiaotao on 2017/7/29.
 */
import Component from '../../../lib/component';
import template from './iframe.html';
import Mediator from '../../../lib/mediator';
import './iframe.scss';
import {PMAPI, PMENUM} from '../../../lib/postmsg';
import {SaveView} from "./save-view/save-view"

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

let maxIframeCount = 10;

export const IframeInstance = new Component({
    template: template,
    data: {
        hash: {},
        count: 0,
        sort: [],
        focus: null,
        hideFlag:false,
    },
    actions: {
        openIframe: function (id, url, name) {
            console.log(id, url, name);
            id = id.toString();
            if (this.data.hash[id] === undefined) {
                let tab = $(`<div class="item" iframeid="${id}">${name}<a class="close" iframeid="${id}"></a></div>`)
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
        },
        closeFirstIframe: function () {
            let firstId = this.data.sort.shift();
            this.actions.closeIframe(firstId);
        },
        closeIframe: function (id) {
            if ( id === undefined) {
                return;
            }
            let item = this.data.hash[id];
            // IframeOnClick.retrack(item.iframe.find('iframe')[0]);
            item.tab.remove();
            item.iframe.remove();
            _.remove(this.data.sort, (v) => {
                return v === id;
            })
            delete this.data.hash[id];
            this.data.count--;
            if (this.data.focus && this.data.focus.id === id) {
                let lastId = _.last(this.data.sort);
                if (lastId) {
                    this.actions.focusIframe(lastId);
                }
            }
        },
        focusIframe: function (id) {
            console.log("focus",id);
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
            this.hideFlag = false;
        },
        hideTabsPopup(){
            let that = this;
            this.hideFlag = true;
            setTimeout(function () {
                if(that.hideFlag){
                    that.el.find('.tab-list').hide();
                }
            },1000);
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
                console.log(name,id);
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
        }
    },
    afterRender: function () {
        let that = this;
        this.data.tabs = this.el.find('.tabs');
        this.data.iframes = this.el.find('.iframes');

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
            SaveView.show(that.data.sort);
        }).on('mouseenter','.view-popup',() => {
            console.log("enter");
            this.actions.showTabsPopup();
        // }).on('click','.view-popup',(event) => {
        //     event.stopPropagation();
        // }).on('click','.drop-up-icon',() => {
        //     this.el.find('.tab-list').hideTabsPopup();
        // }).on('click','.drop-down-icon',() => {
        //     this.el.find('.tab-list').hideTabsPopup();
        }).on('click','.tab-list',(event) => {
            this.actions.controlTabs(event);
        }).on('mouseleave','.view-popup',() => {
            console.log("leave");
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

        Mediator.on('socket:table_invalid', (info) => {
            let item = this.data.hash[info.table_id];
            if (!_.isUndefined(item)) {
                let iframe = item.iframe[0];
                PMAPI.sendToChild(iframe, {
                    type: PMENUM.table_invalid,
                    data: info
                });
            }
        });

        Mediator.on('saveview:displayview', (data) => {
            this.actions.closeAllIframes();  //先关闭所有标签，再打开view中的标签
            for(let k of data){
                console.log(k);
                this.actions.openIframe(k.id,k.url,k.name);
            }
        })
    },

    beforeDestory: function () {
        Mediator.removeAll('menu');
    }
});
