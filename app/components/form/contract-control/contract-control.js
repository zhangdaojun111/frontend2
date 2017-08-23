/**
 * Created by Yunxuan Yan on 2017/8/18.
 */
import Component from "../../../lib/component";
import template from './contract-control.html';
import ContractEditor from "./contract-editor/contract-editor";

let config = {
    template:template,
    data:{},
    actions:{
        openEditor:function(){
            let comp = new ContractEditor(this.data,{
                onChange:function () {
                    console.dir(this.data);
                }
            });
            comp.render(this.el.find('.contract-editor-anchor'));
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
