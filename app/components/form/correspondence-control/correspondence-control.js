import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import DataTableAgGrid from '../../dataGrid/data-table-page/data-table-agGrid/data-table-agGrid';
import './correspondence-control.scss';
import template from './correspondence-control.html';

let config={
    template:template,
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
            if(res == _this.data.value){
                //待晓川那边提供刷新接口
                dataGrid.reload();
            }
        })
    },
    beforeDestory:function(){
        Mediator.removeAll('form:correspondenceDefaultData:'+this.data.tableId);
    }
}
export default class Correspondence extends Component{
    constructor(data){
        super(config,data);
    }
}