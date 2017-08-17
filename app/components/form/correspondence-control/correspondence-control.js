import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import DataTableAgGrid from '../../dataGrid/data-table-page/data-table-agGrid/data-table-agGrid';
import './correspondence-control.scss';
import template from './correspondence-control.html';

let config={
    template:template,
    firstAfterRender(){
        let _this=this;
        this.el.on('click','.ui-forms-a',_.debounce(function(){
            Mediator.publish('form:openCorrespondence:'+_this.data.tableId,_this.data);
        },300));
        Mediator.subscribe('form:correspondenceDefaultData:'+this.data.tableId,()=>{
            if(res == _this.data.value){
                //待晓川那边提供刷新接口
                this.data.dataGrid.actions.getGridData();
            }
        })
        Mediator.subscribe('correspondenceSaved:' + this.data.dfield + ':' + this.data.value,(res)=>{
            if(res == true){
                //待晓川那边提供刷新接口
                _this.data.dataGrid.actions.getGridData();
            }
        })
    },
    afterRender(){
        let config={
            tableId:this.data.value,
            parentTableId:this.data.tableId,
            parentTempId:this.data.temp_id,
            rowId:this.data.parent_temp_id,
            viewMode:'viewFromCorrespondence',
            recordId:this.data.recordId,
            correspondenceField:this.data.dfield,
        }
        let dataGrid=new DataTableAgGrid(config);
        this.data.dataGrid=dataGrid;
        this.append(dataGrid,this.el.find('.correspondence-box'));
    },

    beforeDestory(){
        Mediator.removeAll('form:correspondenceDefaultData:'+this.data.tableId);
        Mediator.removeAll('form:openCorrespondence:'+this.data.tableId);
    }
}
export default class Correspondence extends Component{
    constructor(data){
        super(config,data);
    }
}