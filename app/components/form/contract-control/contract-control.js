/**
 * Created by Yunxuan Yan on 2017/8/18.
 */
import Component from "../../../lib/component";
import template from './contract-control.html';
import {contractEditorConfig} from "./contract-editor/contract-editor";
import {PMAPI} from "../../../lib/postmsg";

let config = {
    template:template,
    data:{},
    actions:{
        openEditor:function(){
            let contractConfig = _.defaultsDeep(contractEditorConfig,{data:this.data});
            PMAPI.openDialogByComponent(contractConfig,{
                width:900,
                height:600,
                title:'合同编辑'
            }).then(res=>{
                this.data.value = res;
            })

        }
    },
    afterRender:function () {
        if(this.data['is_view']){
            this.el.find('.contract-edit').css('display','none');
        }
        
        this.el.on('click','.contract-view',()=>{
            this.data['mode']='view';
            this.actions.openEditor();
        }).on('click','.contract-edit',()=>{
            this.data['mode']='edit';
            this.actions.openEditor();
        })
    }
}

export default class ContractControl extends Component{
    constructor(data){
        super(config,data);
    }
}
