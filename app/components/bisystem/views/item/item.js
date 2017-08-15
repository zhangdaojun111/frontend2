import {BiBaseComponent} from '../../bi.base.component';

import template from "./item.html";
import "./item.scss";
import {ViewsService} from "../../../../services/bisystem/views.service";
import {ViewsDelService} from "../../../../services/bisystem/views.del.service";
import {config as viewDialogConfig} from "../dialog/edit/dialog.edit";
import msgbox from "../../../../lib/msgbox";
import Mediator from '../../../../lib/mediator';

import {PMAPI} from "../../../../lib/postmsg";

let config = {
    template:template,
    data:{},
    afterRender(){},
    firstAfterRender(){
        this.el.on('click','.btn-edit', async ()=> {
            viewDialogConfig.data.view = this.data;
            const res = await PMAPI.openDialogByComponent(viewDialogConfig,{
                width: 348,
                height: 217,
                title: '编辑视图'
            });
            if (res['name']) {
                ViewsService.update(res).then((val) => {
                    if(val['success']===1){
                        this.data = res;
                        Mediator.publish("bi:views:update", this.data);
                        this.reload();
                    }else{
                        alert(val['error'])
                    }
                });
            }
            return false;
        }).on('click','.btn-del', async()=> {
            const ok = await msgbox.confirm("是否删除？");
            let data = {
                view_id:''
            };
            if(ok){
                data.view_id = this.data.id;
                ViewsDelService.delData(data).then((res)=>{
                    if(res['success']===1){
                        Mediator.publish('bi:views:update', {'view': 'remove', data: this.data});
                        this.destroySelf();
                    }else{
                        alert(res['error']);
                    }
                });
            }

        })
    }
};


export class ViewItemComponent extends BiBaseComponent{
    constructor(item) {
        // console.log(config.data);
        config.data = item? item : null;
        super(config);
    }
}