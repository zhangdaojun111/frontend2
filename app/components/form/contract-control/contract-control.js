/**
 * Created by Yunxuan Yan on 2017/8/18.
 */
import Component from "../../../lib/component";
import template from './contract-control.html';
import {contractEditorConfig} from "./contract-editor/contract-editor";
import {PMAPI} from "../../../lib/postmsg";
import './contract-control.scss'

let config = {
    template:template,
    binds:[
        {
            event:'click',
            selector:'.contract-view',
            callback:function () {
                this.data['mode']='view';
                this.actions.openEditor();
            }
        },{
            event:'click',
            selector:'.contract-edit',
            callback:function () {
                this.data['mode']='edit';
                this.actions.openEditor();
            }
        }
    ],
    actions:{
        openEditor:function(){
            let contractConfig = _.defaultsDeep(contractEditorConfig,{data:this.data});
            PMAPI.openDialogByComponent(contractConfig,{
                width:900,
                height:600,
                title:'合同编辑'
            }).then(res=>{
                if(res.onlyclose){
                    return;
                }
                this.data.value = res;
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

export default class ContractControl extends Component{
    constructor(data,events){
        super(config,data,events);
    }
}
