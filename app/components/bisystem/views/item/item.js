import {BiBaseComponent} from '../../bi.base.component';

import template from "./item.html";
import "./item.scss";
import {ViewsService} from "../../../../services/bisystem/views.service";
import {config as viewDialogConfig} from "../dialog/edit/dialog.edit";
import msgbox from "../../../../lib/msgbox";

import {PMAPI} from "../../../../lib/postmsg";

let config = {
    template:template,
    data:{},
    afterRender(){
        this.el.on('click','.create', async()=> {
            // dialogCreateSetting.show();
            PMAPI.openDialogByComponent(viewDialogConfig,{
                width: 348,
                height: 217,
                title: '新建页面'
            });


        }).on('click','.btn-edit', async ()=> {
            // dialogEditSetting.show();

            // console.log(viewDialogConfig);
            // PMAPI.openDialogByComponent(viewDialogConfig,{
            //     width: 348,
            //     height: 217,
            //     title: '编辑页面'
            // });
            // console.log('////////////////////////////');
            // console.log(this.data.name);

        }).on('click','.btn-del', async()=> {
           const ok = await msgbox.confirm("是否删除？");
           if(ok){
               this.destroySelf();
           }
        }).on('click','.save', ()=> {
            msgbox.alert("保存成功");
        });
    }
};


export class ViewItemComponent extends BiBaseComponent{
    constructor(item) {
        config.data = item? item : null;
        super(config);
    }
}