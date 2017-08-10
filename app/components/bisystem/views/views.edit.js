import {BiBaseComponent} from '../bi.base.component';

import {ViewListComponent} from "./list/view.list";
import template from "./views.edit.html";
import "./views.edit.scss";

let config = {
    template:template,
    data:{
        views:window.config.bi_views,
    },
    afterRender(){
        //渲染数据
        this.data.views.forEach((val,index) => {
            let viewListComponent = new ViewListComponent(val);
            this.append(viewListComponent,this.el.find('.view-list'));
        });

        
    }
};

export class ViewsEditComponent extends BiBaseComponent{
    constructor() {
        super(config)
    }
}

