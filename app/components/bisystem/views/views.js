import Component from '../../../lib/component';

import {ViewItemComponent} from "./item/item";

import {ViewsService} from "../../../services/bisystem/views.service";
import {config as viewDialogConfig} from "./dialog/edit/dialog.edit";
import {PMAPI} from '../../../lib/postmsg';
import template from "./views.html";
import msgbox from "../../../lib/msgbox";
import  './views.scss';
import Mediator from '../../../lib/mediator';

let config = {
    template:template,
    data:{
        views:window.config.bi_views,
        chart_id:"",
    },
    actions:{
        /**
         * 保存视图排序
         */
        saveView() {
            let views = this.data.views;
            ViewsService.saveData({data:views}).then((res)=>{
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
            const res = await PMAPI.openDialogByComponent(viewDialogConfig,{
                width: 348,
                height: 217,
                title: '新建视图'
            });
            if (res['name']) {
                ViewsService.update(res).then((res) => {
                    if(res['success']===1){
                        this.data.views.push(res.data);
                        window.config.bi_views = this.data.views;
                        this.reload();
                    }else{
                        msgbox.alert(res['error']);
                    }
                })
            }
            return false;
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

    ],
    afterRender(){
        //渲染列表数据
        this.data.views.forEach((val,index) => {
            let viewItemComponent = new ViewItemComponent(val,{
                onChange: (res)=>{
                    let views = this.data.views;
                    if (res.type === 'remove') {
                        for(let [index,view] of views.entries()) {
                            if (res.value.id === view.id) {
                                views.splice(index,1);
                                break;
                            }
                        }
                    } else {
                        for(let [index,view] of views.entries()) {
                            if (res.id === view.id) {
                                view.name = res.name;
                                break;
                            }
                        }
                    }
                    window.config.bi_views = views;

                }
            });
            this.append(viewItemComponent,this.el.find('.view-list'));
        });
    },
    firstAfterRender() {}
};

export class ViewsEditComponent extends Component{
    constructor(data,events) {
        super(config,data,events)
    }
}

