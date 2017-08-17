import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import DataTableAgGrid from '../../dataGrid/data-table-page/data-table-agGrid/data-table-agGrid';

let config={
    template:`   <div class="clearfix">
                    {{#if unvisible}}
                        <p class="info">权限受限</p>
                    {{else if be_control_condition}}
                        <p class="info">被修改条件限制</p>
                    {{else}}
                        <a href="javascript:void(0);" (click)="click(data)" class="ui-forms-a">对应关系</a>
                        <input type="hidden" [formControlName]="data.dfield" [value]="data.value">
                        <div class="ui-correspondence-box" style="position: relative;height: 450px;width: 1000px;">
                            <div class="correspondence-box" style="width: 100%; height: 100%;">
                            </div>
                        </div>
                     {{/if}}       
               </div>`,
    data:{
        isShow:true,
    },
    actions:{

    },
    firstAfterRender:function(){
        let _this=this;
        _this.el.on('click','.ui-forms-a',_.debounce(function(){
            Mediator.publish('form:openCorrespondence:'+_this.data.tableId,_this.data);
        },300));
        let config={
            tableId:this.data.value,
            parentTableId:this.data.parent_table_id,
            parentTempId:this.data.parent_temp_id,
            rowId:this.data.parent_temp_id,
            showCorrespondenceSelect:true,
            viewMode:'viewFromCorrespondence',
            recordId:this.data.recordId,
        }
        let dataGrid=new DataTableAgGrid(config);
        this.append(dataGrid,this.el.find('.correspondence-box'));
        Mediator.subscribe('form:correspondenceDefaultData:'+this.data.tableId,()=>{
            if(res == this.data.value){
                dataGrid.reload();
            }
        })
    },
    beforeDestory:function(){
    }
}
export default class Correspondence extends Component{
    constructor(data){
        super(config,data);
    }
}