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

let config = {
    template:template,
    data:{
        favoriteList:[],
        currentIframesList:[],      //当前打开的iframe的列表
        newHash:[],                 //按配置打开iframes
    },
    actions:{
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
        saveFavorite:function () {
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
            //检查name是否已存在，存在则先删除该条记录，保证新加记录在最前面
            for(let k of this.data.favoriteList){
                if(k.name === name){
                    this.actions.deleteViewByName(name);
                    break;
                }
            }

            let that = this;
            TabService.saveFavoriteItem(favorlist).done((result) => {
                console.log(result);
                if(result.success === 1){
                    // msgbox.alert("保存成功");
                    msgbox.showTips("保存成功");
                    _.remove(that.data.favoriteList,function (n) {
                        return n.name === name;
                    });
                    that.data.favoriteList.unshift({'name':name,'list':idList});
                    that.actions.initList();
                }
            })
        },
        displayView:function (event) {
            if(event.target.className.includes('delete-icon')){
                this.actions.deleteView(event);
                return;
            }

            //获取被点击的视图名称
            let name = event.currentTarget.attributes.view_id.value;
            let tabIdList = [];
            for ( let k of this.data.favoriteList){
                if ( k.name === name){
                    tabIdList = k.list;
                    break;
                }
            }

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
                    this.data.newHash.push(item);
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
        deleteView:function (event) {
            let name = event.currentTarget.attributes.view_id.value;
            let favorlist = {};
            favorlist['name'] = name;
            favorlist['query_type'] = 'delete';

            let that = this;
            TabService.deleteFavoriteItem(favorlist).done((result) => {
                if(result.success === 1){
                    _.remove(this.data.favoriteList,function (n) {
                        return n.name === name;
                    });
                    that.actions.initList();
                }
            })
        },
        deleteViewByName:function(name){
            let favorlist = {};
            favorlist['name'] = name;
            favorlist['query_type'] = 'delete';

            TabService.deleteFavoriteItem(favorlist).done((result) => {
                if(result.success === 1){
                    _.remove(this.data.favoriteList,function (n) {
                        return n.name === name;
                    });
                }
            })
        },
        //进入编辑模式
        showEditModal:function () {
            this.el.find('.normal-modal').hide();
            this.el.find('.edit-modal').show();
            this.el.find('.delete-icon').show();
        },
        //进入正常模式
        showNormalModal:function () {
            this.el.find('.normal-modal').show();
            this.el.find('.edit-modal').hide();
            this.el.find('.delete-icon').hide();
            this.el.find('.save-view-name').val('');
        },
        //点击三角按钮关闭保存视图界面
        closeSaveViewImmediately:function () {
            this.actions.resetComponent();
            this.actions.closeSaveView();
        },
        //清空input，切换为正常模式
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
            },150)
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
};


class SaveView extends Component {
    constructor(data,callback){
        super(config);
        this.data.currentIframesList = data;
        this.actions.closeSaveView = callback;
    }
}

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