/**
 * Created by Yunxuan Yan on 2017/8/18.
 */
import Component from "../../../lib/component";
import template from './contract-control.html';
import {contractEditorConfig} from "./contract-editor/contract-editor";
import {PMAPI} from "../../../lib/postmsg";
import './contract-control.scss'
import {Storage} from '../../../lib/storage';

let config = {
    template:template,
    binds:[
        {
            event:'click',
            selector:'.contract-view',
            callback:function () {
                this.data['mode']='view';
                this.actions.openEditor('合同模板预览');
            }
        },{
            event:'click',
            selector:'.contract-edit',
            callback:function () {
                this.data['mode']='edit';
                this.actions.openEditor('合同编辑');
            }
        }
    ],
    actions:{
        openEditor:function(title){
            let contractConfig = _.defaultsDeep({data:this.data},contractEditorConfig);
            PMAPI.openDialogByComponent(contractConfig,{
                width:900,
                height:600,
                title:title
            }).then(res=>{
                if(res.onlyclose){
                    if((new URL(document.URL)).searchParams!=undefined){
                        Storage.init((new URL(document.URL)).searchParams.get('key'));
                    } else {
                        let params = (new URL(document.URL)).search.split("&");
                        params.forEach((param)=>{
                            if(param.indexOf('key')!=-1){
                                Storage.init(param.replace('key=',''));
                            }
                        })
                    }
                    let obj = Storage.getItem('contractCache-'+this.data.id,Storage.SECTION.FORM);
                    if(obj == undefined){
                        return;
                    }
                    for (let data of obj) {
                        delete data['content'];
                        delete data['mode'];
                    }
                    this.data.value = obj;
                } else {
                    this.data.value = res;
                }
                this.trigger('changeValue',this.data);
            })
        }
    },
    afterRender:function () {
        if(this.data['is_view']){
            this.el.find('.contract-edit').css('display','none');
        }
    }
}
let ContractControl = Component.extend(config)
export default ContractControl