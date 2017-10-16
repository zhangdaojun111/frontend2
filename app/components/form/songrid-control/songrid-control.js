/**
 *@author yudeping
 *子表控件
 */


import Component from '../../../lib/component'
import DataTableAgGrid from '../../dataGrid/data-table-page/data-table-agGrid/data-table-agGrid';
import './songridControl.scss'
import template from './songrid-control.html';
import Mediator from '../../../lib/mediator';

let config={
    template:template,
    actions:{
      songridDefault(res){
          if(res == _this.data.value){
              dataGrid.actions.getGridData();
          }
      }
    },
    binds:[
        {
            event: 'click',
            selector: '.ui-forms-a',
            callback: function(){
                this.events.openSongGrid(this.data)
            }
        },
        {
            event: 'click',
            selector: '.add-item',
            callback: function(){
                this.events.addItem(this.data)
            }
        }
    ],
    afterRender(){
        debugger;
        let config={
            tableId:this.data.value,
            parentTableId:this.data.parent_table_id,
            parentTempId:this.data.temp_id,
            rowId:this.data.parent_temp_id || '',
            recordId:this.data.parent_record_id || '',
            // tableType:'child',
            viewMode:this.data.is_view==0?'EditChild':'ViewChild',
        }
        let dataGrid=new DataTableAgGrid(config);
        this.append(dataGrid,this.el.find('.songGrid'));
        Mediator.subscribe('form:songGridRefresh:'+this.data["value"],(res)=>{
            if(res.tableId == this.data["value"]){
                this.data["total"] = res.total;
                if (this.data.total == 0) {
                    this.el.find('#requiredLogo').removeClass().addClass('required');
                }else {
                    this.el.find('#requiredLogo').removeClass().addClass('required2');
                }
                this.events.emitDataIfInline(this.data);
            }
        })


    },
    beforeDestory(){
        this.el.off();
    }
}
export default class Songrid extends Component{
    constructor(data,events){
        super(config,data,events);
    }
}