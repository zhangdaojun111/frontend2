import Component from "../../../../lib/component";
import template from './data-table-agGrid.html';
import './data-table-agGrid.scss';

import agGrid from "../../agGrid/agGrid";
import HTTP from "../../../../lib/http";
import dataTableService from "../../service/data-table.service";

let config = {
    template: template,
    data: {
        tableId:'',
        formId:'',
        tableType:'',
        parentTableId:'',
        parentRealId:'',
        parentTempId:'',
        parentRecordId:''
    },
    //原始字段数据
    fieldsData:[],
    actions: {
        //请求数据（表头，提醒，偏好）
        prepareData: function (){
            dataTableService.getTableData("111")
        }
    },
    afterRender: function (){
        this.append(new agGrid({}), this.el.find('#data-agGrid'));
    }
}

class dataTableAgGrid extends Component {
    constructor(data) {
        for( let d in data ){
            config.data[d] = data[d]
        }
        super(config);
    }
}

export default dataTableAgGrid;