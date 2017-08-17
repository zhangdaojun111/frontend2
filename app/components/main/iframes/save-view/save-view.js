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
        testData:{"data": {"test2": ["8172_nrtpynET2yiXENNA5hQBAX", "5613_CHEUbzmZMsjDFT3AiwPB46", "home-page", "9707_FWguSFCnnmcbVfyPnP8vd6", "9458_PcVT5cWJJ35xP3x6kCrPhT"], "test-save-1": ["5613_CHEUbzmZMsjDFT3AiwPB46", "home-page", "8462_Zcer5GV7egyKF2TCGUfkn9", "8505_72GHqJDiGPd8rvowdmKbvX", "1557_ZNpp8ZqJEbBSYeivE32CDi"], "test5": ["home-page", "9707_FWguSFCnnmcbVfyPnP8vd6", "9458_PcVT5cWJJ35xP3x6kCrPhT", "4584_NWqiZxJzbcdvL6bFG6BZtc"]}, "success": 1, "error": ""},
        testList:["6141_DkPExf4MCQJ75gicwKcxdS", "3017_reykKkkYHNBQwqxXoFQpYA", "approve-workflow", "create-workflow", "approving-workflow"],
        currentIframesList:[],
        newHash:[],
    },
    actions:{
        getUserViewList:function () {
            let that = this;
            TabService.getFavoriteList().done((result) => {
                console.log(result);
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
                let $deleteIcon = $("<i class='delete-icon'>");
                $deleteIcon.attr("view_id",k.name);
                $container.append($span);
                $container.append($deleteIcon);
                $parent.append($container);
            }
        },
        saveFavorite:function () {
            if(Object.keys(this.data.currentIframesList).length === 0){
                msgbox.alert("视图配置不能为空");
                return;
            }
            let favorlist = {};
            let list = [];
            let name = this.el.find('.view-name').val();

            for (let k in this.data.currentIframesList){
                list.push({ 'id':this.data.currentIframesList[k],                 //只需要id
                            'table_id':"",
                            'ts_name':""})
            }
            favorlist['name'] = name;
            favorlist['list'] = JSON.stringify(list);
            favorlist['query_type'] = 'save';

            let that = this;
            TabService.saveFavoriteItem(favorlist).done((result) => {
                if(result.success === 1){
                    msgbox.alert("保存成功");
                    that.data.favoriteList.unshift({'name':name,'list':list});
                    that.actions.initList();
                }
            })
        },
        displayView:function (event) {
            //获取被点击的视图名称
            let name = event.currentTarget.attributes.view_id.value;
            let tabIdList = [];
            for ( let k of this.data.favoriteList){
                console.log(k);
                if ( k.name === name){
                    tabIdList = k.list;
                    break;
                }
            }

            if(tabIdList && tabIdList.length > 0){

                let menu = window.config.menu;
                //特殊处理bi和日历
                if(tabIdList.includes('bi')){
                    this.data.newHash.push({
                        id: 'bi',
                        name: 'BI',
                        url: window.config.sysConfig.bi_index
                    });
                    _.remove(tabIdList,function (n) {
                        return n === 'bi'
                    })
                }

                if(tabIdList.includes('calendar')){
                    this.data.newHash.push({
                        id: 'calendar',
                        name: '日历',
                        url: window.config.sysConfig.calendar_index
                    });

                    _.remove(tabIdList,function (n) {
                        return n === 'calendar'
                    })
                }

                this.actions.findTabInfo(menu,tabIdList);  //查找各tab的url和name

                Mediator.emit('saveview:displayview',this.data.newHash);
                //依次打开tabs
                // for(let i=0; i<this.data.newHash.length; i++){
                //     Mediator.emit('menu:item:openiframe',this.data.newHash[i]);
                // }
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
    afterRender:function () {
        this.actions.getUserViewList();
        this.el.on("click",".save-btn",() => {
           this.actions.saveFavorite();
        }).on("click","span.list-name",(event) => {
            this.actions.displayView(event);
        }).on("click","i.delete-icon",(event) => {
            this.actions.deleteView(event);
        })

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