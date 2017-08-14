import {BiBaseComponent} from '../../bi.base.component';

import template from "./view.list.html";
import "./view.list.scss";

// import {config as viewDialogConfig} from "../dialog/create/dialog.create";
import {config as viewDialogConfig} from "../dialog/edit/dialog.edit";
import msgbox from "../../../../lib/msgbox";

import {PMAPI} from "../../../../lib/postmsg";

let config = {
    template:template,
    data:{

    },
    afterRender(){
        this.el.on('click','.create', ()=> {
            // dialogCreateSetting.show();
        }).on('click','.btn-edit', async ()=> {
            let val = this.data.name;
            // console.log(this.el.find('h4 span').html());
            // console.log(this.data.name);
            // $('.inp-val').val(val);
            // console.log($('.inp-val').val());

            // dialogEditSetting.show();
            console.log(viewDialogConfig);
            PMAPI.openDialogByComponent(viewDialogConfig,{
                width: 500,
                height: 200,
                title: '组件页面'
            });
            console.log(a);

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


export class ViewListComponent extends BiBaseComponent{
    constructor(item) {
        config.data = item? item : null;
        super(config);
    }
}