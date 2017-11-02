/**
 *@author yudeping
 *对应关系控件
 */

import Component from '../../../lib/component'
import DataTableAgGrid from '../../dataGrid/data-table-page/data-table-agGrid/data-table-agGrid';
import './correspondence-control.scss';
import template from './correspondence-control.html';
import {CreateFormServer} from "../../../services/formService/CreateFormServer";

let config={
    template:template,
    actions:{
      correspondenceDefault(res){
          if(res == this.data.value){
              this.data.dataGrid.actions.getGridData();
          }
      }
    },
    binds:[
        {
            event: 'click',
            selector: '.ui-forms-a',
            callback: function(){
                this.events.openCorrespondence(this.data);
            }
        },
    ],
    afterRender(){
        let config={
            tableId:this.data.value,
            parentTableId:this.data.parent_table_id,
            parentTempId:this.data.temp_id,
	        parentRealId:this.data.parent_real_id,
            rowId:this.data.parent_temp_id || '',
            viewMode:'viewFromCorrespondence',
            recordId:this.data.recordId || '',
            correspondenceField:this.data.dfield,
        }
        let dataGrid=new DataTableAgGrid(config);
        this.data.dataGrid=dataGrid;
        this.append(dataGrid,this.el.find('.correspondence-box'));
    },

    beforeDestory(){
        this.el.off();
    }
}
export default class Correspondence extends Component{
    constructor(data,events,newConfig){
        super($.extend(true,{},config,newConfig),data,events)
    }
}