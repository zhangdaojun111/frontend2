import {BiBaseComponent} from '../bi.base.component';

import {ViewItemComponent} from "./item/item";
import {ViewsEditService} from "../../../services/bisystem/views.edit.service";
import {ViewsService} from "../../../services/bisystem/views.service";
import {config as viewDialogConfig} from "./dialog/edit/dialog.edit";
import {PMAPI} from "../../../lib/postmsg";
import template from "./views.html";
import "./views.scss";
import Mediator from '../../../lib/mediator';

let config = {
    template:template,
    data:{
        views:window.config.bi_views,
        chart_id:"",
    },
    actions:{
      reload(){
          this.reload();
      }
    },
    afterRender(){
        // Mediator.subscribe
        // Mediator.subscribe('bi:views:add',(data) => {
        //     console.log(data);
        // });


        //渲染列表数据
        this.data.views.forEach((val,index) => {
            let viewItemComponent = new ViewItemComponent(val);
            this.append(viewItemComponent,this.el.find('.view-list'));
        });

        //获取新建数图数据
        ViewsEditService.getCharts().then(res => {
            // console.log(res);
        });

        // console.log(this.data.views);
        //弹出框
        this.el.on('click','.create', async()=> {
            const res = await PMAPI.openDialogByComponent(viewDialogConfig,{
                width: 348,
                height: 217,
                title: '新建页面'
            });
            console.log(res);
        })
    }
};

export class ViewsEditComponent extends BiBaseComponent{
    constructor() {
        super(config)
    }
}

