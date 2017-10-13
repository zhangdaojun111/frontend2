import Component from '../../../../lib/component';

import template from "./item.html";
import {ViewsService} from "../../../../services/bisystem/views.service";
import {config as viewDialogConfig} from "../dialog/edit/dialog.edit";
import msgbox from "../../../../lib/msgbox";
import Mediator from '../../../../lib/mediator';

import {PMAPI} from "../../../../lib/postmsg";
import './item.scss';

let config = {
    template:template,
    data:{},
    actions:{

        /**
         * 删除视图
         * @returns {Promise.<void>}
         */
        async delConfirm(){
            const ok = await msgbox.confirm("是否删除？");
            let data = {
                view_id:''
            };
            if(ok){
                data.view_id = this.data.id;
                ViewsService.delData(data).then((res)=>{
                    if(res['success']===1){
                        this.trigger('onDelete',this.data);
                        msgbox.showTips('删除成功');
                        window.location.reload();
                    }else{
                        msgbox.alert(res['error']);
                    }
                });
            }
        },
        /**
         * 编辑视图
         * @returns {Promise.<boolean>}
         */
        async editViews(){
            viewDialogConfig.data.view = this.data;
            const res = await PMAPI.openDialogByComponent(viewDialogConfig,{
                width: 348,
                height: 217,
                title: '编辑视图'
            });
            if (res['name']) {
                ViewsService.update(res).then((val) => {
                    if(val['success']===1){
                        this.data = val.data;
                        this.trigger('onUpdate',this.data);
                        this.reload();
                    }else{
                        alert(val['error'])
                    }
                });
            }
            return false;
        }

    },
    binds:[
        {
            event:'click',
            selector:'.btn-del',
            callback:function () {
                this.actions.delConfirm();
            }
        },
        {
            event:'click',
            selector:'.btn-edit',
            callback:function () {
                this.actions.editViews();
            }
        }
    ],
    afterRender(){
        this.el.prop('id', this.data.name)
    },
    firstAfterRender(){}
};


export class ViewItemComponent extends Component{
    constructor(data,events) {
        super(config,data,events);
    }
}