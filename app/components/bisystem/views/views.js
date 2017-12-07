import Component from '../../../lib/component';

import {ViewItemComponent} from "./item/item";

import {ViewsService} from "../../../services/bisystem/views.service";
import {config as viewDialogConfig} from "./dialog/edit/dialog.edit";
import {config as carouselConfig} from "./dialog/carousel/carousel";
import {PMAPI} from '../../../lib/postmsg';
import template from "./views.html";
import msgbox from "../../../lib/msgbox";
import  './views.scss';
import Mediator from '../../../lib/mediator';
import 'jquery-ui/ui/widgets/sortable.js';
import {UserInfoService} from "../../../services/main/userInfoService";


let config = {
    template:template,
    data:{
        views:[],
        chart_id:"",
    },

    actions:{
        /**
         * 保存视图排序
         */
        saveView() {
            let views = window.config.bi_views.map(item => JSON.stringify(item));
            ViewsService.saveData({data: views}).then((res)=>{
                if(res['success']===1){
                    msgbox.alert('保存成功');
                }else{
                    msgbox.alert(res['error']);
                }
            });
            return false;
        },
        /**
         * 新建视图
         */
        async createView() {
            viewDialogConfig.data.view = null;
            const res = await PMAPI.openDialogByComponent(viewDialogConfig, {
                width: 348,
                height: 217,
                title: '新建视图'
            });
            if (res['name']) {
                ViewsService.update(res).then((res) => {
                    if (res['success'] === 1) {
                        this.data.views.push(res.data);
                        window.config.bi_views = this.data.views;
                        this.reload();
                    } else {
                        msgbox.alert(res['error']);
                    }
                })
            }
            return false;
        },
        /**
         * 设置轮播
         */
        async setCarousel() {
            const data = await this.actions.getCarouselSetting();
            carouselConfig.data.carousel = data.carousel_time || 0;
            carouselConfig.data.operate = data.stop_time || 0;

            const res = await PMAPI.openDialogByComponent(carouselConfig,{
                width: 348,
                height: 280,
                title: '设置轮播'
            });

            if(res){
                // 设置轮播
                ViewsService.saveCarouselSetting(res);
            }
        }
    },
    binds:[
        {
            event:'click',
            selector:'.save-view',
            callback: function () {
                this.actions.saveView();
            }
        },
        {
            event:'click',
            selector:'.create',
            callback: function () {
                this.actions.createView();
            }

        },
        {
            event:'click',
            selector:'.carousel',
            callback: function () {
                this.actions.setCarousel();
            }

        },

    ],
    afterRender(){
        this.data.views = window.config.bi_views;

        // 视图排序
        let sortable_list = this.el.find('.view-list')
        sortable_list.sortable({
            'update': function(event,ui) {
                let view_sort_list = sortable_list.sortable( "toArray");
                let views = [];
                view_sort_list.forEach((sortView,index) => {
                    for (let view of window.config.bi_views) {
                        if (view.name == sortView) {
                            view.index = index;
                            views.push(view);
                            break;
                        }
                    }
                });
               window.config.bi_views = views;
            }
        });

        //渲染列表数据
        this.data.views.forEach((val,index) => {
            let viewItemComponent = new ViewItemComponent(val,{
                onDelete: (res)=>{
                    let views = this.data.views;
                    _.remove(views,function (val) {
                        return res.id === val.id;
                    });
                    window.config.bi_views = views;
                },
                onUpdate: (res)=>{
                    let views = this.data.views;
                    _.filter(views,function (val){
                        if(res.id === val.id){
                            return val.name = res.name;
                        }
                    });
                    window.config.bi_views = views;

                },
            });
            this.append(viewItemComponent,this.el.find('.view-list'));
        });
    },
    firstAfterRender() {

    },
    beforeDestory() {

    }
};

export class ViewsEditComponent extends Component{
    constructor(data,events,extendConfig) {
        super($.extend(true,{},config,extendConfig),data,events)
    }
}

