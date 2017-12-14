/**
 * @author zhaoyan
 * 视图保存组件
 */
import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './new-save-view.scss';
import template from './new-save-view.html';
import {TabService} from "../../../../services/main/tabService"
import Mediator from "../../../../lib/mediator"
import msgbox from "../../../../lib/msgbox";

let SaveView = Component.extend({
    template:template,
    data:{
        favoriteList:[],
        currentIframesList:[],      //当前打开的iframe的列表
        newHash:[],                 //按配置打开iframes
    },
    actions:{
        /**
         * 获取用户保存的视图（tabs组合）数据
         */
        getUserViewList:function () {
            let that = this;
            TabService.getFavoriteList().done((result) => {
                if(result.success === 1 ){
                    let tempList = result.data;
                    for (let k in tempList){
                        that.data.favoriteList.unshift({'name':tempList[k].name, 'list':tempList[k].info});
                    }
                }else{
                    console.log("get favorite list failed");
                }
            }).fail((err) => {
                console.log("get favorite list failed",err);
            }).done(() => {
                that.actions.initList();
            })
        },
        /**
         * 根据当前视图数据渲染视图列表
         */
        initList:function () {
            let $parent = this.el.find('.save-view-list');
            $parent.find('.list-item').remove();
            for(let k of this.data.favoriteList){
                let $container = $("<li class='list-item'>");
                let $span = $(`<span class='list-name' title='${k.name}'>`);
                $span.html(k.name);
                $container.attr("view_id",k.name);
                let $deleteIcon = $("<i class='delete-icon icon-framework-delete'>");
                $deleteIcon.attr("view_id",k.name);
                $container.append($span);
                $container.append($deleteIcon);
                $parent.append($container);
            }
        },
        /**
         * 将当前打开的标签组合保存为视图（不保存bi和日历）
         * @returns {Promise.<void>}
         */
        saveFavorite:function () {
            this.data.currentIframesList = this.data.iframesComponent.data.sort;

            //过滤List中的bi和日历
            _.remove(this.data.currentIframesList,function (n) {
                return (n === "bi" || n === 'calendar');
            });

            if(Object.keys(this.data.currentIframesList).length === 0){
                msgbox.alert("视图配置不能为空");
                return;
            }

            let name = this.el.find('.save-view-name').val();
            if(name === ''){
                msgbox.alert("视图名称不能为空");
                return;
            }
            this.actions._sendFavorite(name);
        },
        _sendFavorite:async function(name){
            let favorlist = {};
            let list = [];
            let idList = [];

            for (let k in this.data.currentIframesList){
                list.push({ 'id':this.data.currentIframesList[k],
                    'table_id':this.data.currentIframesList[k],
                    'ts_name':""});
                idList.push(this.data.currentIframesList[k]);
            }
            favorlist['name'] = name;
            favorlist['list'] = JSON.stringify(list);
            favorlist['query_type'] = 'save';

            //为保证重名覆盖的视图在列表最上方，先删除已存在视图，重新保存
            let temp = this.data.favoriteList.find(function (n) {
                return n.name === name;
            });

            if(temp){
                await this.actions.deleteViewByName(name);
            }

            TabService.saveFavoriteItem(favorlist).done((result) => {
                if(result.success === 1){
                    msgbox.showTips("保存成功");
                    _.remove(this.data.favoriteList,function (n) {
                        return n.name === name;
                    });
                    this.data.favoriteList.unshift({'name':name,'list':idList});
                    this.actions.initList();
                }
            })
        },
        /**
         * 点击某个视图后展示该视图包含的tabs
         * @param event
         */
        displayView:function (event) {
            if(event.target.className.includes('delete-icon')){
                this.actions.deleteView(event);
                return;
            }

            //获取被点击的视图名称
            let tabIdList = this.actions._getFavoriteView();

            if(tabIdList && tabIdList.length > 0){
                let menu = window.config.menu;
                //特殊处理bi和日历
                // if(tabIdList.includes('bi')){
                //     this.data.newHash.push({
                //         id: 'bi',
                //         name: 'BI',
                //         url: window.config.sysConfig.bi_index
                //     });
                //     _.remove(tabIdList,function (n) {
                //         return n === 'bi'
                //     })
                // }
                //
                // if(tabIdList.includes('calendar')){
                //     this.data.newHash.push({
                //         id: 'calendar',
                //         name: '日历',
                //         url: window.config.sysConfig.calendar_index
                //     });
                //
                //     _.remove(tabIdList,function (n) {
                //         return n === 'calendar'
                //     })
                // }
                this.data.newHash.length = 0;
                this.actions.findTabInfo(menu,tabIdList);  //查找各tab的url和name
                Mediator.emit('saveview:displayview',this.data.newHash);
            }
        },
        _getFavoriteView:function () {
            let name = event.currentTarget.attributes.view_id.value;
            let tabIdList = [];
            for ( let k of this.data.favoriteList){
                if ( k.name === name){
                    tabIdList = k.list;
                    break;
                }
            }
            return tabIdList;
        },
        /**
         * 根据id查找tabs的url和name
         * @param nodes
         * @param targetList
         */
        findTabInfo:function (nodes,targetList) {
            for( let i=0; i < nodes.length; i++){
                if(targetList.includes(nodes[i].ts_name ) || targetList.includes(nodes[i].table_id )){
                    this.actions._calNewHash(nodes[i]);
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
        _calNewHash:function (node) {
            let item = {};
            if(node.table_id && node.table_id !== ''&& node.table_id !== '0'){
                item.id = node.table_id;
            }else{
                item.id = node.ts_name || '0';
            }
            item.url = node.url;
            item.name = node.label;
            this.data.newHash.push(item);
        },
        /**
         * 根据点击事件删除视图
         * @param event
         */
        deleteView:function (event) {
            let name = event.currentTarget.attributes.view_id.value;
            let favorlist = {};
            favorlist['name'] = name;
            favorlist['query_type'] = 'delete';

            TabService.deleteFavoriteItem(favorlist).done((result) => {
                if(result.success === 1){
                    _.remove(this.data.favoriteList,function (n) {
                        return n.name === name;
                    });
                    this.actions.initList();
                }
            })
        },
        /**
         * 用于删除重复名字的视图
         * @param name
         */
         deleteViewByName:function(name){
            let favorlist = {};
            favorlist['name'] = name;
            favorlist['query_type'] = 'delete';
            let res;
            let promise = new Promise((resolve, reject) => {
                res = resolve;
            });
            TabService.deleteFavoriteItem(favorlist).done((result) => {
                if(result.success === 1){
                    _.remove(this.data.favoriteList,function (n) {
                        return n.name === name;
                    });
                    res(true);
                }
            });
            return promise;
        },
        /**
         * 进入编辑模式
         */
        showEditModal:function () {
            this.el.find('.normal-modal').hide();
            this.el.find('.edit-modal').show();
            this.el.find('.delete-icon').show();
        },
        /**
         * 进入正常模式
         */
        showNormalModal:function () {
            this.el.find('.normal-modal').show();
            this.el.find('.edit-modal').hide();
            this.el.find('.delete-icon').hide();
            this.el.find('.save-view-name').val('');
        },
        /**
         * 点击三角按钮关闭保存视图界面
         */
        closeSaveViewImmediately:function () {
            this.actions.resetComponent();
            this.actions.closeSaveView();
        },
        /**
         * 清空input，切换为正常模式
         */
        resetComponent:function () {
            this.el.find('.save-view-name').val('');
            this.actions.showNormalModal();
        }
    },
    binds:[
        {
            event:'click',
            selector:'.save-view-btn',
            callback: _.debounce( function () {
                this.actions.saveFavorite();
            },500)
        },
        {
            event:'click',
            selector:'.list-item',
            callback:function (target,event) {
                this.actions.displayView(event);
            }
        },
        {
            event:'click',
            selector:'i.delete-icon',
            callback:function (target,event) {
                this.actions.deleteView(event);
            }
        },
        {
            event:'click',
            selector:'.edit-icon',
            callback:function () {
                this.actions.showEditModal();
            }
        },
        {
            event:'click',
            selector:'.cancel-edit-modal',
            callback:function () {
                this.actions.showNormalModal();
            }
        },
        {
            event:'click',
            selector:'.drop-up-view-icon',
            callback:function () {
                this.actions.closeSaveViewImmediately();
            }
        }
    ],
    afterRender:function () {
        console.log('new save view');
        this.actions.getUserViewList();
        // this.el.on("click",".save-btn",_.debounce(() => {
        //     this.actions.saveFavorite();
        // },1000)).on("click","span.list-name",(event) => {
        //     this.actions.displayView(event);
        // }).on("click","i.delete-icon",(event) => {
        //     this.actions.deleteView(event);
        // })
    },
    beforeDestory:function () {

    }
});

export {SaveView};
// export const SaveView = {
//     el:null,
//     show: function (data) {
//         let component = new SaveViewController(data);
//         this.el = $('<div id="save-view">').appendTo(document.body);
//         component.render(this.el);
//         this.el.erdsDialog({
//             title: '保存视图',
//             width: 280,
//             modal:true,
//             height: 380,
//             close: function() {
//                 $(this).erdsDialog('destroy');
//                 component.destroySelf();
//             }
//         });
//     },
//     hide:function () {
//         this.el.erdsDialog('close');
//     }
// };