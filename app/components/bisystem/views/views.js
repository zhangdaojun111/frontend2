import {BiBaseComponent} from '../bi.base.component';

import {ViewItemComponent} from "./item/item";

import {ViewsService} from "../../../services/bisystem/views.service";
import {config as viewDialogConfig} from "./dialog/edit/dialog.edit";
import {PMAPI} from '../../../lib/postmsg';
import template from "./views.html";
import  './views.scss';
import Mediator from '../../../lib/mediator';

let config = {
    template:template,
    data:{
        views:window.config.bi_views,
        chart_id:"",
    },
    actions:{},
    afterRender(){
        //渲染列表数据
        this.data.views.forEach((val,index) => {
            let viewItemComponent = new ViewItemComponent(val);
            this.append(viewItemComponent,this.el.find('.view-list'));
        });
    },
    firstAfterRender() {
        Mediator.subscribe("bi:views:update", (res) => {
            let views = this.data.views;
            if (res.view === 'remove') {
                console.log('xxxxxxxxxxxxxxxxxxxxxxx');
                for(let [index,view] of views.entries()) {
                    if (res.data.id == view.id) {
                        views.splice(index,1);
                        break;
                    }
                };
            }
            window.config.bi_views = views;

        });

        //弹出框
        this.el.on('click','.create', async()=> {
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
                        this.reload();
                    }else{
                        alert(res['error']);
                    }
                });
            }
            return false;
        })
    }
};

export class ViewsEditComponent extends BiBaseComponent{
    constructor() {
        super(config)
    }
}

