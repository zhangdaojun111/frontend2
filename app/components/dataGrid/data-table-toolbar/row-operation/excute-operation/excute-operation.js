/**
 * @author yangxiaochuan
 * 行级BI
 */
import Component from "../../../../../lib/component";
import template from './excute-operation.html';
import './excute-operation.scss';
import {PMAPI,PMENUM} from '../../../../../lib/postmsg';
import msgBox from '../../../../../lib/msgbox';
import {HTTP} from "../../../../../lib/http";

import {dataTableService} from "../../../../../services/dataGrid/data-table.service";

let config = {
    template: template,
    data: {
        rowData: [],
        field: '',
        operationId: '',
        params: '',
        rowId: '',
        tableId: '',
        deploylist: [],
        firstRender: true
    },
    actions: {
        //获取执行选项
        getDeployList: function( rowData , realId , field){
            let deploylist = [];
            for(let row of rowData){
                if( row['_id'] == realId ){
                    deploylist = row[field];
                }
            }
            return deploylist;
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.submit',
            callback: function ($event) {
                let checkbox = $($event).parent().parent().find( 'input' );
                let item = $($event).parent().parent().find( '.item-name' ).html();
                let checkItem = ['更新','清空','编译'];
                let arr = [];
                for( let i = 0;i<checkbox.length;i++ ){
                    if( checkbox[i].checked == true ){
                        arr.push( checkItem[i] )
                    }
                }
                if( arr.length == 0 ){
                    msgBox.alert( '请选择任务' );
                    return;
                }
                let json = {
                    table_id: this.data.tableId,
                    rowId: this.data.rowId,
                    deployItem: item,
                    exc_tasks: arr.join( ',' )
                }
                dataTableService.excuteOperation( this.data.params.substring( 4 ),json ).then( res=>{
                    if(res["success"] == 1){
                        msgBox.alert(res["message"]);
                    }else{
                        msgBox.alert( res.error );
                    }
                } )
            }
        }
    ],
    afterRender: function (){
        if( this.data.firstRender ){
            PMAPI.getIframeParams(window.config.key).then((res) => {
                this.data.firstRender = false;
                let d = res.data;
                this.data.rowData = d.allRowData;
                this.data.field = d.field;
                this.data.operationId = d.operation_id;
                this.data.params = d.params;
                this.data.rowId = d.rowId;
                this.data.tableId = d.tableId;
                this.data.deploylist = this.actions.getDeployList( this.data.rowData , this.data.rowId , this.data.field );
                this.reload();
            })
        }
    }
}

class excuteOperation extends Component {
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default excuteOperation;