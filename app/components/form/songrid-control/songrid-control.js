/**
 *@author yudeping
 *子表控件
 */


import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import DataTableAgGrid from '../../dataGrid/data-table-page/data-table-agGrid/data-table-agGrid';
import './songridControl.scss'
import template from './songrid-control.html';

let config={
    template:template,
    afterRender(){
        let _this=this;
        _this.el.on('click','.ui-forms-a',_.debounce(function(){
            Mediator.publish('form:openSongGrid:'+_this.data.tableId,_this.data);
        },300));
        let config={
            tableId:this.data.value,
            parentTableId:this.data.tableId,
            parentTempId:this.data.temp_id,
            rowId:this.data.parent_temp_id || '',
            tableType:'child',
            viewMode:this.data.is_view==0?'EditChild':'ViewChild',
        }
        let dataGrid=new DataTableAgGrid(config);
        this.append(dataGrid,this.el.find('.songGrid'));
        Mediator.subscribe('form:songridDefaultData:'+this.data.tableId,(res)=>{
            if(res == _this.data.value){
                dataGrid.actions.getGridData();
            }
        })
    },
    beforeDestory(){
        Mediator.removeAll('form:openSongGrid:'+_this.data.tableId);
        Mediator.removeAll('form:songridDefaultData:'+_this.data.tableId);
    }
}
export default class Songrid extends Component{
    constructor(data){
        super(config,data);
    }
}