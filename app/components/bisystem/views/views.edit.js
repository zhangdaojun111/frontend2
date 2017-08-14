import {BiBaseComponent} from '../bi.base.component';

import {ViewListComponent} from "./list/view.list";
import {dialogCreateSetting} from "././dialog/create/dialog.create";
import {dialogEditSetting} from "././dialog/edit/dialog.edit";
import msgbox from "../../../lib/msgbox";
import {ViewsEditService} from "../../../services/bisystem/views.edit.service";
import template from "./views.edit.html";
import "./views.edit.scss";

let config = {
    template:template,
    data:{
        views:window.config.bi_views,
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

        //弹出框
        this.el.on('click','.create',function () {
            dialogCreateSetting.show();
        }).on('click','.btn-edit',function () {
            dialogEditSetting.show();
        }).on('click','.btn-del',function () {
            msgbox.confirm("是否删除？");
        }).on('click','.save',function () {
            msgbox.alert("保存成功");
        });


    }
};

export class ViewsEditComponent extends BiBaseComponent{
    constructor() {
        super(config)
    }
}

