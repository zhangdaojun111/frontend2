import {BiBaseComponent} from '../bi.base.component';

import {ViewListComponent} from "./list/view.list";
import {ViewsEditService} from "../../../services/bisystem/views.edit.service";
import template from "./views.edit.html";
import "./views.edit.scss";

let config = {
    template:template,
    data:{
        views:window.config.bi_views,
        chart_id:"",
    },
    afterRender(){
        //渲染列表数据
        this.data.views.forEach((val,index) => {
            let viewListComponent = new ViewListComponent(val);
            this.append(viewListComponent,this.el.find('.view-list'));
        });

        //获取新建数图数据
        ViewsEditService.getCharts().then(res => {
            // console.log(res);
        });

        console.log(this.data.views);
        //弹出框
    }
};

export class ViewsEditComponent extends BiBaseComponent{
    constructor() {
        super(config)
    }
}

