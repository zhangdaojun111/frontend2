/**
 * @author zhaoyan
 * 视图保存组件
 */
import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './save-view.scss';
import template from './save-view.html';
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
                        that.data.favoriteList.push({'name':k, 'list':tempList[k]});
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
            let $parent = this.el.find('.view-list');
            $parent.empty();
            for(let k of this.data.favoriteList){
                let $container = $("<div class='list-item'>");
                let $span = $("<span class='list-name'>");
                $span.html(k.name);
                $span.attr("view_id",k.name);
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
            let favorlist = {};
            let list = [];
            let idList = [];
            let name = this.el.find('.view-name').val();

            for (let k in this.data.currentIframesList){
                list.push({ 'id':this.data.currentIframesList[k],                 //只需要存id
                            'table_id':"",
                            'ts_name':""});
                idList.push(this.data.currentIframesList[k]);
            }
            favorlist['name'] = name;
            favorlist['list'] = JSON.stringify(list);
            favorlist['query_type'] = 'save';

            let that = this;
            TabService.saveFavoriteItem(favorlist).done((result) => {
                if(result.success === 1){
                    msgbox.alert("保存成功");
                    _.remove(that.data.favoriteList,function (n) {
                        return n.name === name;
                    });
                    that.data.favoriteList.unshift({'name':name,'list':idList});
                    that.actions.initList();
                }
            })
        },
        displayView:function (event) {
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
                this.actions.findTabInfo(menu,tabIdList);  //查找各tab的url和name
                Mediator.emit('saveview:displayview',this.data.newHash);
                SaveView.hide();
            }
        },
        findTabInfo:function (nodes,targetList) {
            for( let i=0; i < nodes.length; i++){
                if(targetList.includes(nodes[i].id ) || targetList.includes(nodes[i].table_id )){
                    let item = {};
                    item.id = nodes[i].id;
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
        }
    },
    binds:[
        {
            event:'click',
            selector:'.save-btn',
            callback: _.debounce( function () {
                this.actions.saveFavorite();
            },500)
        },
        {
            event:'click',
            selector:'span.list-name',
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


class SaveViewController extends Component {
    constructor(data){
        super(config);
        this.data.currentIframesList = data;
    }
}

export const SaveView = {
    el:null,
    show: function (data) {
        let component = new SaveViewController(data);
        this.el = $('<div id="save-view">').appendTo(document.body);
        component.render(this.el);
        this.el.dialog({
            title: '保存视图',
            width: 280,
            modal:true,
            height: 380,
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